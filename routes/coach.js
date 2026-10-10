/**
 * routes/coach.js
 * Multi-Persona AI Coaching and AI Habit Suggestions powered by Google Gemini
 * with intelligent offline/fallback generation.
 */

const express = require('express');
const router = express.Router();

const PERSONA_PROMPTS = {
  stoic: `You are Marcus Aurelius / a Stoic mentor. Calm, wise, deeply grounded in discipline and daily practice. 
Focus on consistency, mastering the small choices, and remembering that daily habits shape our character. 
Keep your response short (2-3 sentences). No bullet points.`,

  'tough-love': `You are a tough-love, high-standards coach. Direct, blunt, no-fluff. 
If they have a streak, give them credit but remind them today isn't over. If they missed something, call it out directly without being cruel. 
Keep your response punchy and direct (2-3 sentences). No excuses. No bullet points.`,

  hype: `You are an electric, high-energy hype coach! Unstoppable positive momentum, cheering them on with genuine fire and intensity. 
Celebrate their wins passionately, pump them up to crush the remaining habits today!
Keep your response short (2-3 sentences) with vibrant energy. No bullet points.`,

  empathetic: `You are a warm, supportive wellness coach and psychologist. 
Gentle, understanding, focused on self-compassion, reducing friction, and making habits feel easy and sustainable.
Keep your response short (2-3 sentences). No bullet points.`,
};

async function callGemini(prompt, systemInstruction = '') {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set. Please add it to your .env file.');
  }

  const models = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const bodyPayload = {
        contents: [{ parts: [{ text: prompt }] }],
      };
      if (systemInstruction) {
        bodyPayload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        lastError = data.error?.message || `HTTP ${res.status}`;
      }
    } catch (e) {
      lastError = e.message;
    }
  }

  throw new Error(`Gemini request failed: ${lastError}`);
}

// POST /api/coach
router.post('/', async (req, res) => {
  const { habits, persona = 'stoic' } = req.body;

  if (!habits || !Array.isArray(habits) || habits.length === 0) {
    return res.status(400).json({ error: 'No habit data provided. Please add habits first.' });
  }

  const habitSummary = habits
    .map((h) => {
      const streakText = h.streak > 0 ? `${h.streak}-day streak (best: ${h.bestStreak || h.streak})` : '0-day streak';
      const todayText = h.checkedToday ? 'COMPLETED today' : 'PENDING today';
      return `- [${h.emoji || '🎯'}] ${h.name} (${h.category || 'General'}): ${streakText}, status: ${todayText}`;
    })
    .join('\n');

  const completedToday = habits.filter((h) => h.checkedToday).map((h) => h.name);
  const pendingToday = habits.filter((h) => !h.checkedToday).map((h) => h.name);

  const systemPrompt = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS['stoic'];

  const userPrompt = `Here is my current habit tracking data for today:

${habitSummary}

Summary:
- Total habits: ${habits.length}
- Done today: ${completedToday.length > 0 ? completedToday.join(', ') : 'None yet'}
- Still pending today: ${pendingToday.length > 0 ? pendingToday.join(', ') : 'All completed!'}

Deliver your personalized coaching message based on this real data. Name specific habits and streak counts.`;

  try {
    const coaching = await callGemini(userPrompt, systemPrompt);
    res.json({ coaching, persona });
  } catch (err) {
    console.warn('Gemini API notice:', err.message);
    
    // Intelligent persona-specific fallback matching the learner's real habit data
    const topHabit = habits[0] || { name: 'Daily Habits', streak: 1 };
    const streak = topHabit.streak || 1;
    let fallback = '';

    if (persona === 'hype') {
      fallback = `Boom! ${topHabit.name} is on a ${streak}-day streak! You are building unstoppable momentum right now—keep this fire burning and crush every single goal today!`;
    } else if (persona === 'tough-love') {
      fallback = `${streak} days on ${topHabit.name} is a solid start, but real discipline is about showing up every single day. Stop making excuses and lock in your reps today.`;
    } else if (persona === 'empathetic') {
      fallback = `You're making meaningful progress with ${topHabit.name} on day ${streak}. Celebrate every small step and remember that long-term habits are built with self-compassion, not perfection.`;
    } else {
      fallback = `Protect your ${streak}-day discipline with ${topHabit.name}. Character is forged in the quiet, deliberate choices we repeat each morning. Do not break the chain.`;
    }

    res.json({ coaching: fallback, persona, fallback: true });
  }
});

// POST /api/coach/suggest
router.post('/suggest', async (req, res) => {
  const { goal } = req.body;
  const userGoal = goal && goal.trim() ? goal.trim() : 'Healthy balanced lifestyle and productivity';

  const prompt = `Suggest 3 high-impact, achievable daily micro-habits for someone who wants to achieve this goal: "${userGoal}".
Return ONLY a valid JSON array of 3 objects with this exact structure:
[
  {"name": "Habit Name", "emoji": "🏃", "category": "Fitness", "reason": "Short 1-sentence why"}
]
Do not wrap in markdown quotes if possible, or return just the JSON.`;

  try {
    const rawText = await callGemini(prompt, 'You are an expert behavioral scientist. Respond strictly in valid JSON.');
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const suggestions = JSON.parse(cleaned);
    res.json({ suggestions });
  } catch (err) {
    console.warn('Suggest fallback notice:', err.message);
    res.json({
      suggestions: [
        { name: '10-Minute Morning Walk', emoji: '🚶', category: 'Health', reason: 'Jumpstarts circadian rhythm and mood.' },
        { name: 'Read 10 Pages Daily', emoji: '📚', category: 'Mind', reason: 'Compounds knowledge effortlessly over time.' },
        { name: 'Evening Digital Sunset (30m screen-free)', emoji: '🌙', category: 'Zen', reason: 'Improves deep sleep and recovery.' },
      ],
    });
  }
});

module.exports = router;
