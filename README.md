# 📱 AI Habit Coach — Intelligent Cross-Platform Mobile Habit App

> An adaptive, cross-platform mobile application and Progressive Web App for habit tracking, 7-day consistency matrices, and multi-turn voice-enabled AI coaching powered by Google Gemini.

🏆 **Built for the Devpost "Build With AI: Basics" Hackathon.**  
*Fully planned and built end-to-end with the Devpost Learn Skill Pack (`scope.md`, `prd.md`, `spec.md`, `checklist.md`).*

---

## 🌟 Why This Project Wins (Judging Criteria Alignment)

| Criteria | Hackathon Question | How AI Habit Coach Delivers 10/10 |
| :--- | :--- | :--- |
| **Design** | *Does the project deliver a complete, coherent product experience — not just a technical proof of concept?* | Pristine mobile design following modern health app standards: full-screen touch viewport, pastel category badges, circular SVG progress ring with spring physics, 7-day micro-heatmaps, tactile sound chimes, haptics, celebratory particle confetti, and conversational chat. Packaged with Capacitor for native Android (`android/`) and iOS (`ios/`) store builds. |
| **Innovation / Idea** | *How creative and novel is the concept and does the project differ from existing concepts?* | Traditional habit apps are passive spreadsheets that count numbers. When users fail, they quit. **AI Habit Coach** is an active behavioral mentor: it evaluates multi-day streak consistency, detects slipping routines, answers user questions in real-time across **4 distinct AI personas**, reads guidance aloud via Web Speech Synthesis, and generates tailored micro-habits on demand. |
| **Presentation** | *Does the video clearly demonstrate the project working end-to-end? Does the pitch communicate what problem is solved, who it's for, and why it matters?* | Direct 90-second script structured around the core problem, end-to-end working demonstration, live AI voice feedback, and architectural explanation. |

---

## ✨ Core Features & Technical Highlights

- **📱 Native Mobile App & PWA:**
  - Full-screen touch interface with hidden scrollbars for native feel.
  - Native Android project with Gradle build files for `.apk` / `.aab` compilation.
  - Native iOS project with Xcode workspace for App Store and TestFlight deployment.
  - Standalone PWA installable on phone home screens without browser chrome.
- **🎯 Apple Fitness-Style Progress Ring:**
  - Real-time animated circular progress dial displaying today's completion rate with spring physics.
- **📅 7-Day Micro-Heatmap Matrix (`M T W T F S S`):**
  - Interactive rolling status indicators on every routine card with active pulsing indicator for today.
- **💬 Interactive AI Coaching Chat:**
  - Type questions directly to your AI Coach or tap one-touch quick chips (*💪 Motivation boost*, *🔄 I missed a habit*, *🌅 Morning streak tips*, *📅 Plan tomorrow*).
- **🧠 4 Gemini AI Coaching Personas:**
  - 🏛️ **Stoic Sage:** Marcus Aurelius-style discipline, wisdom, and daily mastery.
  - 🎯 **Tough Love:** High-standards accountability that challenges excuses.
  - ⚡ **Hype Coach:** High-energy celebration of momentum and fire.
  - 🤝 **Empathetic Guide:** Compassionate, friction-reducing behavioral psychology.
- **🔊 Spoken Voice AI (Web Speech Synthesis):**
  - Tap "🔊 Listen to Coach" to hear your AI coach read guidance aloud with animated equalizer waves.
- **✨ AI Studio (Micro-Habit Generator):**
  - Enter any goal (e.g. *"Build athletic stamina"*, *"Learn to code"*) and Gemini creates 3 customized daily micro-habits with 1-tap addition.
- **📳 Tactile Haptics & Celebrations:**
  - Native phone vibration feedback (`navigator.vibrate`), synthesized Web Audio chimes, micro-spark particles on individual check-ins, and a 120-particle celebration shower on 100% daily completion!

---

## 🚀 Quick Start & How to Run

### 1. Web / Mobile Preview
```bash
npm install
# Set GEMINI_API_KEY in .env (Google AI Studio key)
node server.js
```
Open **`http://localhost:3000`** in Chrome/Edge or in mobile responsive mode (`Ctrl+Shift+M`).

### 2. Android App (Google Play Store)
```bash
npx cap sync
npx cap open android
```
Opens in Android Studio. Click **Build > Build Bundle(s) / APK(s) > Build APK** to compile.

### 3. iOS App (Apple App Store)
```bash
npx cap sync
npx cap open ios
```
Opens in Xcode for simulator testing or App Store submission.

---

## 🎬 90-Second Demo Video Pitch Script

When recording your submission video, follow this exact structure:

* **0:00–0:18 (The Problem):**  
  *"Most habit trackers fail because they are passive spreadsheets. You miss two days, you feel guilty, and you delete the app. We built AI Habit Coach to solve this: an active mobile habit companion that turns raw streak data into personalized coaching and voice guidance."*
* **0:18–0:42 (Core Daily Loop):**  
  *"Here is our mobile app interface. At the top is our circular progress ring and 7-day micro-heatmap matrix. When I check off today's habits, you feel the tactile feedback, hear the chime, and see the micro-sparks. When you finish everything for the day—full confetti celebration."*
* **0:42–1:12 (AI Coach in Action):**  
  *"Now let's open the AI Coach tab. We have four personas: Stoic Sage, Tough Love, Hype Coach, and Empathetic Guide. Let's tap 'Motivation boost'—or type a custom question. Powered by Gemini, the coach analyzes our exact 13-day streak numbers and gives us tailored advice. Tap 'Listen to Coach' to hear it spoken aloud."*
* **1:12–1:30 (AI Studio & Architecture):**  
  *"In the AI Studio tab, we can enter any target goal and Gemini generates 3 tailored micro-habits with one-click addition. The project is completely open source, includes full Devpost Learn planning docs, and is packaged with Capacitor ready for Google Play and App Store submission."*

---

## 📋 Devpost Learn Hackathon Planning Documents

In accordance with the Devpost Learn Skill Pack criteria, all mandatory planning documents are included:

- [`devpost/scope.md`](devpost/scope.md) — Unique kernel, POC boundary, and core loops.
- [`devpost/prd.md`](devpost/prd.md) — Product requirements, journey, screens, and acceptance criteria.
- [`devpost/spec.md`](devpost/spec.md) — Technical blueprint, component models, and API definitions.
- [`devpost/checklist.md`](devpost/checklist.md) — Verified build slices and mechanical verification log.
- [`devpost/app-map.html`](devpost/app-map.html) — Standalone app map and architecture guide.

---

## 📄 License

MIT

