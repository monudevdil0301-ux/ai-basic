---
doc: spec
status: approved
---

# AI Habit Coach — Technical Specification

## System Overview

AI Habit Coach is built as a cross-platform mobile application supporting native Android (Google Play Store) and iOS (Apple App Store) deployment via **Capacitor**, alongside Progressive Web App (PWA) support.

### Frontend
- Clean, responsive mobile app container (`public/index.html`) optimized for touchscreens.
- Web Audio API for offline procedural sound effects.
- Web Speech Synthesis API for audio voice coaching playback.
- Canvas-Confetti for celebratory milestones.
- Service Worker (`public/sw.js`) and Web App Manifest (`public/manifest.json`).

### Native Mobile Platform Packaging
- **Capacitor Configuration:** `capacitor.config.json` with `com.devpost.aihabitcoach` bundle ID.
- **Android Native Project:** `android/` containing Gradle build files, `AndroidManifest.xml`, and `MainActivity.java`. Builds directly to `.apk` / `.aab`.
- **iOS Native Project:** `ios/` containing Xcode project structure, `App.xcodeproj`, and `Package.swift`.

### Backend & AI Pipeline
- **Server:** Node.js v18+ with Express (`server.js`).
- **Habits API (`routes/habits.js`):** CRUD endpoints with automatic calculation of consecutive streaks, best streaks, and 7-day micro-heatmaps.
- **AI Coach API (`routes/coach.js`):** Direct REST calls to Google Gemini (`gemini-3.5-flash-lite`, `gemini-3.8-flash`, `gemini-flash-latest`) with custom system instructions for 4 coaching personas and JSON structured output for habit suggestions.
- **Storage:** File-based JSON persistence (`data/habits.json`).

## API Endpoints

- `GET /api/habits` — Fetch habits with 7-day heatmaps and dashboard stats.
- `POST /api/habits` — Create new habit `{ name, category, emoji }`.
- `POST /api/habits/:id/check` — Toggle daily completion and update streaks.
- `DELETE /api/habits/:id` — Delete habit.
- `POST /api/coach` — Generate persona-specific coaching message from habit data.
- `POST /api/coach/suggest` — Generate 3 micro-habits from goal prompt.

## Where It Runs and How to Test

1. **Local Server / PWA:**
   ```bash
   npm install
   node server.js
   ```
   Open `http://localhost:3000`.

2. **Native Android App (Google Play):**
   ```bash
   npx cap sync
   npx cap open android
   ```
   Opens in Android Studio; click "Build Bundle(s) / APK(s)" to produce release-ready APK/AAB.

3. **Native iOS App (App Store):**
   ```bash
   npx cap sync
   npx cap open ios
   ```
   Opens in Xcode for iOS deployment and TestFlight.
