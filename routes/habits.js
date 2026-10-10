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
} = require('../utils/streaks');

const DATA_FILE = path.join(__dirname, '..', 'data', 'habits.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ habits: [] }, null, 2));
  }
}

function readData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('habits.json reset:', err.message);
    const empty = { habits: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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
