/**
 * routes/habits.js
 * Habit CRUD, check-ins, 7-day micro-heatmaps, and analytics.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {
  calculateStreak,
  calculateBestStreak,
  getLast7Days,
  calculateDashboardStats,
  getTodayStr,
  getDateStr,
} = require('../utils/streaks');

const os = require('os');
const isVercel = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const BUNDLED_FILE = path.join(__dirname, '..', 'data', 'habits.json');
const DATA_FILE = isVercel
  ? path.join(os.tmpdir(), 'habits.json')
  : BUNDLED_FILE;

let memoryCache = null;

function ensureDataFile() {
  if (isVercel) {
    if (!fs.existsSync(DATA_FILE) && fs.existsSync(BUNDLED_FILE)) {
      try {
        fs.copyFileSync(BUNDLED_FILE, DATA_FILE);
      } catch (e) {
        // Fallback silently to memory
      }
    }
  } else {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ habits: [] }, null, 2));
    }
  }
}

function readData() {
  if (memoryCache) return memoryCache;
  ensureDataFile();
  try {
    const filePath = fs.existsSync(DATA_FILE) ? DATA_FILE : BUNDLED_FILE;
    const raw = fs.readFileSync(filePath, 'utf-8');
    memoryCache = JSON.parse(raw);
    return memoryCache;
  } catch (err) {
    console.error('habits.json read error:', err.message);
    const empty = { habits: [] };
    memoryCache = empty;
    return empty;
  }
}

function writeData(data) {
  memoryCache = data;
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('Storage write fallback to memory:', err.message);
  }
}

function enrichHabit(habit) {
  const today = getTodayStr();
  const dates = habit.completedDates || [];
  return {
    ...habit,
    category: habit.category || 'General',
    emoji: habit.emoji || '🎯',
    streak: calculateStreak(dates),
    bestStreak: calculateBestStreak(dates),
    checkedToday: dates.includes(today),
    last7Days: getLast7Days(dates),
  };
}

// GET /api/habits
router.get('/', (req, res) => {
  const data = readData();
  const enriched = data.habits.map(enrichHabit);
  const stats = calculateDashboardStats(data.habits);
  res.json({ habits: enriched, stats });
});

// POST /api/habits
router.post('/', (req, res) => {
  const { name, category, emoji } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Habit name is required.' });
  }

  const data = readData();
  const newHabit = {
    id: crypto.randomUUID(),
    name: name.trim(),
    category: (category || 'General').trim(),
    emoji: (emoji || '🎯').trim(),
    completedDates: [],
  };
  data.habits.push(newHabit);
  writeData(data);
  res.status(201).json(enrichHabit(newHabit));
});

// POST /api/habits/demo — 1-click winning demo state generator for presentations
router.post('/demo', (req, res) => {
  const pastDays = (count, skipToday = false) => {
    const list = [];
    const start = skipToday ? -1 : 0;
    for (let i = start; i >= -count; i--) {
      list.push(getDateStr(i));
    }
    return list;
  };

  const demoHabits = [
    {
      id: crypto.randomUUID(),
      name: 'Morning 5K Run',
      category: 'Fitness',
      emoji: '🏃',
      completedDates: pastDays(12, false),
    },
    {
      id: crypto.randomUUID(),
      name: 'Drink 2.5L Water',
      category: 'Health',
      emoji: '💧',
      completedDates: pastDays(8, false),
    },
    {
      id: crypto.randomUUID(),
      name: 'Read 20 Pages (Atomic Habits)',
      category: 'Mind',
      emoji: '📚',
      completedDates: pastDays(6, true), // pending today
    },
    {
      id: crypto.randomUUID(),
      name: '10-Minute Zen Meditation',
      category: 'Zen',
      emoji: '🧘',
      completedDates: pastDays(14, false),
    },
    {
      id: crypto.randomUUID(),
      name: 'Deep Work Sprint (45m)',
      category: 'Focus',
      emoji: '⚡',
      completedDates: pastDays(9, true), // pending today
    },
  ];

  writeData({ habits: demoHabits });
  const enriched = demoHabits.map(enrichHabit);
  const stats = calculateDashboardStats(demoHabits);
  res.json({ habits: enriched, stats });
});

// POST /api/habits/:id/check
router.post('/:id/check', (req, res) => {
  const data = readData();
  const habit = data.habits.find((h) => h.id === req.params.id);

  if (!habit) {
    return res.status(404).json({ error: 'Habit not found.' });
  }

  const today = getTodayStr();
  if (!habit.completedDates) habit.completedDates = [];
  const alreadyChecked = habit.completedDates.includes(today);

  if (alreadyChecked) {
    habit.completedDates = habit.completedDates.filter((d) => d !== today);
  } else {
    habit.completedDates.push(today);
  }

  writeData(data);
  const stats = calculateDashboardStats(data.habits);
  res.json({ habit: enrichHabit(habit), stats });
});

// DELETE /api/habits/:id
router.delete('/:id', (req, res) => {
  const data = readData();
  const index = data.habits.findIndex((h) => h.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Habit not found.' });
  }

  data.habits.splice(index, 1);
  writeData(data);
  const stats = calculateDashboardStats(data.habits);
  res.json({ success: true, stats });
});

module.exports = router;
