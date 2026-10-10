---
doc: scope
status: approved
---

# AI Habit Coach

A native mobile application and PWA for Android and iOS that tracks habits, visualizes 7-day consistency matrices, and delivers voice-enabled AI coaching powered by Google Gemini.

## The Unique Kernel

Most habit trackers just count raw numbers. AI Habit Coach analyzes your actual multi-day streak consistency, detects slipping routines, and delivers personalized coaching with voice audio playback across 4 distinct AI personas (Stoic Sage, Tough Love, Hype Coach, Empathetic Guide).

## Who It's For

Individuals seeking daily discipline who want actionable, voice-enabled coaching on their mobile devices rather than generic notifications.

## The Core Loop

Users open the mobile app on Android or iOS, check off today's routines with tactile haptic and audio feedback, view their rolling 7-day micro-heatmaps, and request AI coaching or generate tailored micro-habits using Gemini.

## Inspiration & Identity

Apple Fitness rings and Headspace aesthetics. Deep space glassmorphism (`#090a12`), glowing emerald and amber accents, and clean mobile tab navigation.

## What "Working" Looks Like

A complete mobile application packaged with Capacitor for native Android APK and iOS builds. Users add routines, toggle completions with haptic and audio responses, see 7-day heatmaps update, and hear personalized voice advice from Gemini.

## The POC Boundary

- Native mobile app packaged for Android (`android/`) and iOS (`ios/`)
- Installable PWA with Service Worker and Manifest
- Real-time habit tracking with 7-day rolling micro-heatmaps
- 4 Gemini AI coaching personas with voice speech synthesis
- Gemini-powered AI habit generator
- Web Audio API chimes and confetti animations
