# 📱 AI Habit Coach — Android & iOS Native Mobile App

> An adaptive, cross-platform mobile application and PWA for habit tracking, 7-day consistency matrices, and voice-enabled AI coaching powered by Google Gemini.

🏆 **Built for the Devpost "Build With AI: Basics" Hackathon.**

---

## 🌟 Overview & What Makes It Unique

Most habit trackers simply increment a streak counter or send robotic reminders. **AI Habit Coach** is different: it evaluates your **multi-day consistency patterns**, spots slipping routines, and delivers personalized advice via **Google Gemini** across 4 distinct coaching personas with **audible voice speech playback**.

Packaged with **Capacitor**, it deploys as a **native Android app (`android/`)** for the Google Play Store, a **native iOS app (`ios/`)** for the Apple App Store, and an **offline-capable PWA**.

---

## ✨ Features

- **📱 Native Mobile App & PWA:**
  - Full-screen, touch-optimized mobile interface with smooth spring interactions.
  - Native Android project with Gradle build files for `.apk` / `.aab` compilation.
  - Native iOS project with Xcode workspace for App Store and TestFlight deployment.
  - Standalone PWA installable on phone home screens without browser chrome.
- **🎯 Apple Fitness Style Hero Progress Ring:**
  - Real-time animated circular progress dial displaying today's completion rate.
- **📅 7-Day Micro-Heatmap Matrix (`M T W T F S S`):**
  - Interactive rolling status indicators on every routine card showing recent completion history.
- **🧠 4 Gemini AI Coaching Personas:**
  - 🧘 **Stoic Sage:** Marcus Aurelius-style discipline and wisdom.
  - 🎯 **Tough Love:** High-standards accountability that challenges procrastination.
  - ⚡ **Hype Coach:** High-energy celebration of momentum and fire.
  - 🤝 **Empathetic Guide:** Compassionate, friction-reducing behavioral coaching.
- **🔊 Voice AI (Web Speech Synthesis):**
  - Tap "🔊 Listen to Coach" to hear your AI coach read the guidance aloud with animated soundwaves.
- **✨ AI Studio (Micro-Habit Generator):**
  - Enter any goal (e.g. *"Build athletic stamina"*, *"Learn React"*) and Gemini generates 3 tailored routines with 1-tap addition.
- **📳 Mobile Haptics & Audio Chimes:**
  - Native phone vibration feedback (`navigator.vibrate`) on routine completion, synthesized Web Audio chimes, and full-screen confetti showers on 100% completion!

---

## 🚀 Quick Start & How to Run

### 1. Web / Mobile Preview
```bash
npm install
# Set GEMINI_API_KEY in .env
node server.js
```
Open **`http://localhost:3000`** in any browser.

### 2. Android App (Google Play Store)
```bash
npx cap sync
npx cap open android
```
Opens in Android Studio. Click **Build > Build Bundle(s) / APK(s) > Build APK** to generate your installable Android package.

### 3. iOS App (Apple App Store)
```bash
npx cap sync
npx cap open ios
```
Opens in Xcode for simulator testing or App Store submission.

---

## 📋 Devpost Learn Hackathon Planning Documents

In accordance with the Devpost Learn Skill Pack criteria, all planning documents are included:

- [`devpost/scope.md`](devpost/scope.md) — Unique kernel, POC boundary, and core loops.
- [`devpost/prd.md`](devpost/prd.md) — Product requirements, journey, screens, and acceptance criteria.
- [`devpost/spec.md`](devpost/spec.md) — Technical blueprint, component models, and API definitions.
- [`devpost/checklist.md`](devpost/checklist.md) — Verified build slices and mechanical verification log.
- [`devpost/app-map.html`](devpost/app-map.html) — Standalone app map and architecture guide.

---

## 📄 License

MIT
