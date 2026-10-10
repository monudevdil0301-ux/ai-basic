---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Core mobile routine tracking with 7-day micro-heatmaps**
  Becomes usable: A mobile web application where users add daily habits, filter by category, and see them rendered with 7-day rolling micro-heatmaps.
  Why now: Proves the core daily routine loop and visual consistency tracker end-to-end.
  PRD ref: `prd.md > The Core Journey` (steps 1-4)
  Spec ref: `spec.md > Frontend`, `spec.md > Habits API`
  Build: Scaffold mobile app layout with Express backend, habit CRUD routes, and pure streak calculator.
  Verify (mechanical): Start Express server, test `GET /api/habits` and `POST /api/habits`.
  Learner check: Open `http://localhost:3000`, add a habit, and verify it displays with category and streak badges.
  Commit: `Add core habit tracking with 7-day micro-heatmaps`

- [x] **2. Interactive daily check-ins with tactile audio and confetti**
  Becomes usable: Users check off habits, receive audio chimes and native haptics, and see the hero circular progress ring update with confetti when 100% complete.
  Why now: Provides positive reinforcement and makes daily habit logging rewarding.
  PRD ref: `prd.md > Tactile Check-in`
  Spec ref: `spec.md > Frontend`
  Build: Implement `POST /api/habits/:id/check` toggle, integrate Web Audio API synthesizer tones, and trigger canvas-confetti.
  Verify (mechanical): Send check-in POST request, verify streak increments and stats calculate accurately.
  Learner check: Check off habits in the UI and observe audio chime and progress ring animation.
  Commit: `Add interactive check-ins with audio and confetti`

- [x] **3. Multi-persona AI coaching and voice speech synthesis**
  Becomes usable: Gemini-powered adaptive coach analyzes habit data across 4 personas (Stoic, Tough Love, Hype, Empathetic) and speaks advice aloud.
  Why now: Fulfills the unique kernel of the app—AI that coaches based on multi-day streak consistency.
  PRD ref: `prd.md > AI Coaching Station`
  Spec ref: `spec.md > AI Coach API`
  Build: Implement `routes/coach.js` with prompt engineering for 4 personas, fallback Gemini models, and Web Speech Synthesis playback.
  Verify (mechanical): Send habit payload to `/api/coach` and confirm non-empty advice string from Gemini.
  Learner check: Switch personas, tap "Ask Coach", and tap "Listen to Coach" to hear spoken audio.
  Commit: `Add multi-persona AI coach with speech synthesis`

- [x] **4. AI Studio habit generator**
  Becomes usable: Users enter a custom goal in AI Studio and Gemini generates 3 actionable micro-habits with 1-tap addition.
  Why now: Solves cold-start problem when users want to build new routines.
  PRD ref: `prd.md > AI Studio`
  Spec ref: `spec.md > AI Coach API`
  Build: Implement `/api/coach/suggest` endpoint returning structured JSON habits from user goals.
  Verify (mechanical): Send goal prompt to `/api/coach/suggest` and verify array of 3 JSON habit objects.
  Learner check: Type a goal in the AI Studio tab, click Generate, and add a suggested routine with one tap.
  Commit: `Add AI Studio habit generator with Gemini`

- [x] **5. Native Android & iOS app store packaging with Capacitor**
  Becomes usable: Native Android Studio project (`android/`) and iOS Xcode project (`ios/`) ready to compile into `.apk` / `.aab` for Google Play and TestFlight/App Store.
  Why now: Delivers the user's requirement of a genuine store-deployable native mobile application.
  PRD ref: `prd.md > Screens & Surfaces`
  Spec ref: `spec.md > Native Mobile Platform Packaging`
  Build: Install Capacitor CLI/Core/Android/iOS, configure bundle ID, add native platforms, and sync assets.
  Verify (mechanical): Verify `android/` and `ios/` directory structures and run `npx cap sync`.
  Learner check: Verify `android/` project can be opened in Android Studio with `npx cap open android`.
  Commit: `Package native Android and iOS mobile app with Capacitor`

## Hands-on Checkpoints

- [x] Early usable behavior explored — habit creation, check-ins, and 7-day heatmaps tested
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — covered
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Verified native mobile architecture, Gemini API integration, and Capacitor packaging
Route and stops: `public/index.html` (mobile UI) -> `routes/coach.js` (Gemini API) -> `capacitor.config.json` (Native packaging)
Edit outcome: Kept and verified
Reflection: Covered
Activity mode: live app and editor

## Revisions

- Added native Android and iOS store packaging via Capacitor per store deployment requirements.
