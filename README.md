# FocusTrack – Chrome Extension for Time Tracking & Productivity Analytics

FocusTrack automatically tracks the websites you visit, calculates how
productive your browsing is, and shows the results on a React analytics
dashboard.

## Monorepo Structure

```
FocusTrack/
├── client/       React (Vite) dashboard — auth, analytics, goals, settings
├── server/       Node.js + Express + MongoDB REST API (MVC architecture)
└── extension/    Chrome Extension (Manifest V3) — tab & idle tracking
```

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React (Vite), Tailwind CSS, React Router, Axios, Recharts |
| Backend    | Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt |
| Extension  | Manifest V3, Service Worker, chrome.tabs, chrome.idle, chrome.alarms, chrome.storage, chrome.notifications |

## Build Order (Modules)

This project is being built module by module:

1. **Project Setup** ← *you are here*
2. Backend Setup
3. MongoDB Configuration
4. Authentication
5. Chrome Extension Setup
6. Time Tracking Logic
7. REST APIs
8. React Dashboard
9. Analytics
10. Goals
11. Reports
12. Notifications
13. Testing
14. Deployment

## Getting Started (filled in as modules are completed)

### Server
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Client
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### Extension
```
chrome://extensions → Enable Developer Mode → Load Unpacked → select /extension
```
