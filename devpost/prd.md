---
doc: prd
status: approved
---

# AI Habit Coach — Product Requirements Document

A native mobile application (Android & iOS via Capacitor) and Progressive Web App providing daily routine management, 7-day consistency matrices, and multi-persona AI coaching powered by Google Gemini.
Source: `scope.md > The Core Loop`, `scope.md > The Unique Kernel`.

## The Core Journey

1. **Mobile App Launch** — The app opens directly to the **Today** tab, displaying the Apple Fitness-style hero progress ring and today's routines.
2. **Category Filtering** — Users filter routines with horizontal pills (`All`, `Fitness`, `Health`, `Mind`, `Zen`, `Focus`).
3. **Tactile Check-in** — Tapping habit checkboxes triggers native vibration (`navigator.vibrate`), Web Audio chimes, and updates the 7-day micro-heatmap dots. Completing all routines triggers a full confetti shower.
4. **Routine Creation** — Tapping the Floating Action Button (`+`) smoothly slides open the iOS Bottom Sheet drawer to add routines with category and emoji tags.
5. **AI Coaching Station** — On the **AI Coach** tab, users select a persona (`Stoic Sage`, `Tough Love`, `Hype Coach`, `Empathetic Guide`) and tap "Ask Coach". Gemini evaluates multi-day consistency and streams advice, accompanied by a "🔊 Listen to Coach" audio playback button.
6. **AI Studio** — On the **AI Studio** tab, users enter any target goal (e.g. "Build physical stamina", "Learn React") and Gemini outputs 3 tailored micro-habits with 1-tap addition.

## Screens & Surfaces

- **App Bar:** Frosted glass header with brand flame badge, live date, and sound toggle.
- **Tab 1 (Today):** Progress dial, category filter pills, habit cards with 7-day micro-heatmaps.
- **Tab 2 (Stats):** Longest streak counters, total lifetime check-ins, discipline matrix.
- **Tab 3 (AI Coach):** Persona selector, advice bubble, audio play bar with wave visualizer.
- **Tab 4 (AI Studio):** Goal input and Gemini habit generator cards.
- **Bottom Navigation Dock:** Fixed 4-tab thumb navigation.
- **Bottom Sheet Drawer:** Routine addition drawer with category selection.

## Non-Goals & Boundaries

- No complicated cloud database setup needed for PoC — local storage and JSON persistence ensure offline usability.
- No mandatory login/authentication required — single-user privacy-first architecture.
