/**
 * utils/streaks.js
 * Advanced streak calculation, 7-day micro-heatmaps, and aggregate metrics.
 */

function getTodayStr() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function getDateStr(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function calculateStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0;
  const dateSet = new Set(completedDates);
  const today = getTodayStr();
  let streak = 0;

  let startOffset = dateSet.has(today) ? 0 : -1;

  for (let i = startOffset; i >= -365; i--) {
    const dateStr = getDateStr(i);
    if (dateSet.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateBestStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0;
  const sorted = Array.from(new Set(completedDates)).sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
      if (current > best) best = current;
    } else if (diffDays > 1) {
      current = 1;
    }
  }

  return best;
}

function getLast7Days(completedDates) {
  const dateSet = new Set(completedDates || []);
  const today = getTodayStr();
  const history = [];

  for (let i = -6; i <= 0; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = DAY_LABELS[d.getDay()];

    history.push({
      date: dateStr,
      dayLabel: dayLabel,
      isToday: dateStr === today,
      completed: dateSet.has(dateStr),
    });
  }

  return history;
}

function calculateDashboardStats(habits) {
  const today = getTodayStr();
  const totalHabits = habits.length;
  if (totalHabits === 0) {
    return {
      totalHabits: 0,
      completedTodayCount: 0,
      completionRate: 0,
      bestStreak: 0,
      totalCheckins: 0,
    };
  }

  let completedTodayCount = 0;
  let bestStreak = 0;
  let totalCheckins = 0;

  for (const h of habits) {
    const dates = h.completedDates || [];
    totalCheckins += dates.length;
    if (dates.includes(today)) completedTodayCount++;
    const streak = calculateStreak(dates);
    if (streak > bestStreak) bestStreak = streak;
  }

  const completionRate = Math.round((completedTodayCount / totalHabits) * 100);

  return {
    totalHabits,
    completedTodayCount,
    completionRate,
    bestStreak,
    totalCheckins,
  };
}

module.exports = {
  calculateStreak,
  calculateBestStreak,
  getLast7Days,
  calculateDashboardStats,
  getTodayStr,
  getDateStr,
};
