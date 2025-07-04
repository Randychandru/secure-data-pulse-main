# Secure Data Pulse

A modern, glassmorphic fintech dashboard built with React, Firebase, and a custom Node.js OTP backend. Features Google and phone authentication, onboarding, and a beautiful, responsive UI inspired by top fintech apps.

## Features
- Glassmorphic, premium UI (inspired by Revolut/Nubank)
- Google Sign-In (Firebase Auth)
- Phone number sign-in with custom OTP backend (no SMS cost for demo)
- Multi-step onboarding with validation
- Personalized dashboard with charts, stats, and quick actions
- Realtime data storage (Firebase RTDB)
- Demo-friendly: OTP is shown in the UI for easy testing

## Demo
- [Live Demo Link](#) <!-- Add your deployed link here -->
- Use any phone number (with country code) for demo; OTP will appear in the UI.

## Getting Started

### 1. Clone the repo
```sh
git clone https://github.com/Randychandru/secure-data-pulse-main.git
cd secure-data-pulse-main
```

### 2. Install dependencies
```sh
npm install
cd backend
npm install
```

### 3. Firebase Setup
- Create a Firebase project
- Add your web app config to `src/firebase.ts`
- Download your service account key and place it as `backend/serviceAccountKey.json`

### 4. Run the backend (OTP API)
```sh
cd backend
npm start
```

### 5. Run the frontend
```sh
cd ..
npm start
```

### 6. Open in your browser
- Go to `http://localhost:3000`
- Try Google or Phone sign-in (OTP will be shown in the UI)

## Deployment
- Push to GitHub and connect to Vercel/Netlify for easy hosting
- The OTP will always be shown in the UI for demo purposes

## License
MIT 