/**
 * routes/coach.js
 * Multi-Persona AI Coaching and AI Habit Suggestions
 * Powered by Google Gemini via the official @google/genai SDK.
 */

const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const PERSONA_PROMPTS = {
  stoic: `You are Marcus Aurelius, a Stoic philosopher-mentor. Calm, wise, deeply grounded in discipline and daily practice.
Focus on consistency, mastering small choices, and how daily habits forge character.
Keep your response short (2-3 sentences). No bullet points. No hashtags.`,

  'tough-love': `You are a tough-love, high-standards coach. Direct, blunt, no fluff.
If they have a streak, give credit but remind them today isn't over. If they missed something, call it out directly without being cruel.
Keep your response punchy (2-3 sentences). No bullet points. No hashtags.`,

  hype: `You are an electric, high-energy hype coach with unstoppable positive momentum!
Celebrate wins passionately and pump them up to crush remaining habits today!
Keep your response (2-3 sentences) with vibrant energy. No bullet points. No hashtags.`,

  empathetic: `You are a warm, supportive wellness coach and psychologist.
Gentle, understanding, focused on self-compassion, reducing friction, and making habits feel easy and sustainable.
Keep your response short (2-3 sentences). No bullet points. No hashtags.`,
};

// Initialize Gemini client using the official @google/genai SDK
function getAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is missing from .env');
  return new GoogleGenAI({ apiKey: key });
}

async function callGemini(userText, systemInstruction = '') {
  const ai = getAI();
  // Try models in order — auto-fallback if one is overloaded
  const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];
  let lastErr;
  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userText,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: 0.85,
          maxOutputTokens: 256,
        },
      });
      return response.text;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

// ─── POST /api/coach ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { habits, persona = 'stoic', userMessage = '' } = req.body;

  if (!habits || !Array.isArray(habits) || habits.length === 0) {
    return res.status(400).json({ error: 'No habit data provided. Please add habits first.' });
  }

  const habitSummary = habits
    .map((h) => {
      const streakText =
        h.streak > 0 ? `${h.streak}-day streak (best: ${h.bestStreak || h.streak})` : '0-day streak';
      const todayText = h.checkedToday ? 'COMPLETED today' : 'PENDING today';
      return `- [${h.emoji || '🎯'}] ${h.name} (${h.category || 'General'}): ${streakText}, ${todayText}`;
    })
    .join('\n');

  const completedToday = habits.filter((h) => h.checkedToday).map((h) => h.name);
  const pendingToday = habits.filter((h) => !h.checkedToday).map((h) => h.name);

  const systemPrompt = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS['stoic'];

  let userPrompt = `Here is my current habit tracking data for today:

${habitSummary}

Summary:
- Total habits: ${habits.length}
- Done today: ${completedToday.length > 0 ? completedToday.join(', ') : 'None yet'}
- Still pending today: ${pendingToday.length > 0 ? pendingToday.join(', ') : 'All completed!'}`;

  if (userMessage && userMessage.trim()) {
    userPrompt += `\n\nUser Question/Note to Coach: "${userMessage.trim()}"\nAnswer the user directly while tailoring the advice to their habit stats and streaks.`;
  } else {
    userPrompt += `\n\nDeliver personalized daily coaching. Reference specific habit names and streak counts.`;
  }

  try {
    const coaching = await callGemini(userPrompt, systemPrompt);
    res.json({ coaching, persona, live: true });
  } catch (err) {
    console.warn('[Coach API] Gemini fallback triggered:', err.message);
    const topHabit = habits[0] || { name: 'Daily Habits', streak: 1 };
    const streak = topHabit.streak || 1;
    let fallback = '';
    if (userMessage && userMessage.trim()) {
      fallback = `Regarding "${userMessage.trim()}": remember that showing up consistently for ${topHabit.name} (${streak}-day streak) is your anchor. Keep your daily commitment first.`;
    } else if (persona === 'hype') {
      fallback = `🔥 BOOM! ${topHabit.name} is on a ${streak}-day streak! You're building unstoppable momentum — every check-in today is a vote for who you're becoming!`;
    } else if (persona === 'tough-love') {
      fallback = `${streak} days on ${topHabit.name}. Decent. But real discipline means showing up especially when you don't feel like it. Stop waiting and lock in your reps — NOW.`;
    } else if (persona === 'empathetic') {
      fallback = `You're genuinely doing great with ${topHabit.name} — ${streak} days is meaningful progress. Be kind to yourself today and remember: small, consistent steps always compound into big change.`;
    } else {
      fallback = `${streak} days protecting your practice with ${topHabit.name}. Character is forged in quiet, deliberate choices repeated each morning. Do not break the chain.`;
    }
    res.json({ coaching: fallback, persona, live: false });
  }
});

// ─── POST /api/coach/suggest ──────────────────────────────────────────────────
router.post('/suggest', async (req, res) => {
  const { goal } = req.body;
  const userGoal = goal && goal.trim() ? goal.trim() : 'Healthy, balanced lifestyle and daily productivity';

  const prompt = `Suggest 3 high-impact, achievable daily micro-habits for the goal: "${userGoal}".
Return ONLY valid JSON — no markdown, no explanation, no code fences.
Format exactly:
[
  {"name": "Habit Name", "emoji": "🏃", "category": "Fitness", "reason": "One-sentence reason."},
  {"name": "Habit Name", "emoji": "📚", "category": "Mind", "reason": "One-sentence reason."},
  {"name": "Habit Name", "emoji": "🌙", "category": "Zen", "reason": "One-sentence reason."}
]`;

  try {
    const rawText = await callGemini(prompt, 'You are an expert behavioral scientist. Respond strictly with valid JSON only.');
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const suggestions = JSON.parse(cleaned);
    res.json({ suggestions, live: true });
  } catch (err) {
    console.warn('[Suggest API] Fallback triggered:', err.message);
    res.json({
      live: false,
      suggestions: [
        { name: '10-Minute Morning Walk', emoji: '🚶', category: 'Health', reason: 'Jumpstarts circadian rhythm, mood, and creative thinking for the day.' },
        { name: 'Read 10 Pages Daily', emoji: '📚', category: 'Mind', reason: 'Compounds knowledge effortlessly — 3,650 pages per year.' },
        { name: 'Evening Digital Sunset (30 min)', emoji: '🌙', category: 'Zen', reason: 'Signals the brain to wind down, dramatically improving deep sleep quality.' },
      ],
    });
  }
});

module.exports = router;
