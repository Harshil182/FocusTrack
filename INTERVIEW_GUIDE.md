# FocusTrack — Complete Interview Preparation & Project Guidance

Welcome to the **FocusTrack Interview & Setup Guide**! This document contains everything you need to explain FocusTrack in technical interviews, understand every technology used, set up and run the application locally, and answer tough technical questions confidently.

---

## 📌 1. How to Explain This Project in an Interview

### ⏱️ 30-Second Elevator Pitch
> *"FocusTrack is a full-stack time tracking and productivity analytics platform. It consists of a **Chrome Extension (Manifest V3)** that automatically tracks active browsing domains and detects idle user states in real time, a **Node.js/Express REST API with MongoDB** for processing and domain categorization, and a **React 18 analytics dashboard** with interactive charts, goal tracking, and automated PDF/CSV report exports."*

### 🗣️ 2-Minute Detailed Project Walkthrough
> *"During my project, I built FocusTrack to solve a common problem in remote and digital work environments: existing time trackers are either privacy-invasive or require manual start/stop buttons that people forget to press.*
>
> *FocusTrack is built as a clean monorepo with three core modules:*
> 1. **Chrome Extension (Manifest V3)**: Operates quietly in the background using a service worker. It listens to active tab changes (`chrome.tabs`), filters out idle keyboard/mouse inactivity (`chrome.idle`), and buffers browsing logs locally (`chrome.storage`). Every minute, a background alarm (`chrome.alarms`) syncs these logs to the backend without clogging browser performance.
> 2. **REST API Backend (Node.js + Express + MongoDB)**: Provides stateless JWT authentication, password hashing with `bcryptjs`, and custom aggregation pipelines. It classifies domain activity into Productive, Neutral, or Distracting categories and calculates an active Productivity Index score. It also generates downloadable PDF/CSV reports.
> 3. **React Dashboard (React 18 + Vite + Tailwind CSS + Recharts)**: Displays real-time data visualizers, productivity graphs, domain usage breakdowns, goal progress bars, and custom categorization settings.*
>
> *Architecturally, I focused heavily on offline-first resilience, security (helmet, rate limiting, JWT), and seamless data flow across extension and web clients."*

---

## 🛠️ 2. Technologies Used & Why We Used Them

| Module | Technology | Why We Used It |
|---|---|---|
| **Frontend** | React 18 & Vite | Fast SPA framework with instant HMR and quick build times. |
| **Frontend** | Tailwind CSS | Utility-first styling for clean, responsive visual aesthetics and dark mode UI. |
| **Frontend** | Recharts | Composable visual library for interactive pie, bar, and area productivity charts. |
| **Frontend** | Axios | Configured with HTTP interceptors to auto-attach `Authorization: Bearer <token>` and handle 401 unauthenticated redirects. |
| **Backend** | Node.js & Express.js | Asynchronous, non-blocking REST API framework suited for fast I/O processing. |
| **Backend** | MongoDB Atlas & Mongoose | Flexible NoSQL database with Mongoose schemas and compound indexes for tracking logs. |
| **Backend** | JWT & Bcryptjs | Stateless session security and password salting/hashing (10 rounds). |
| **Backend** | PDFKit & ExcelJS | Server-side engines for generating downloadable analytics reports in PDF and Excel formats. |
| **Extension**| Chrome Manifest V3 | Standard Chrome extension platform using background Service Workers. |
| **Extension**| Chrome Storage & Alarms | Local offline buffer persistence and periodic 1-minute batch sync background trigger. |
| **Extension**| Chrome Idle API | Automatic detection of 60-second user inactivity to stop tracking unused tabs. |

---

## 🚀 3. Step-by-Step Setup & How to Use the Project

### Step 1: Start Backend Server
```bash
cd server
npm install
# Create .env file with PORT=5000, MONGO_URI, JWT_SECRET
npm run dev
```

### Step 2: Start Frontend Web Dashboard
```bash
cd client
npm install
# Create .env file with VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```
Dashboard runs at: `http://localhost:5173`

### Step 3: Load Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions`.
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** (top-left button).
4. Select the `FocusTrack/extension` folder.

### Step 4: Full User Journey
1. Open `http://localhost:5173/register` and register an account.
2. Click the FocusTrack Chrome Extension icon, log in with your credentials.
3. Browse websites normally (e.g. GitHub, YouTube, StackOverflow).
4. The background service worker silently tracks active domains and syncs every 1 minute.
5. Check your React Dashboard to see live graphs, set focus goals, and export PDF reports!

---

## 🎯 4. Exhaustive List of Interview Questions & Model Answers

### Category A: Core Architecture & Monorepo Design

#### Q1: Why did you choose a Monorepo structure for FocusTrack (`/client`, `/server`, `/extension`)?
**Answer:**
> *"A monorepo allowed us to keep the frontend client, backend REST API, and Chrome extension in a single synchronized repository while keeping their codebases cleanly separated. It simplified shared configurations, unified environment variables, and enabled seamless end-to-end development without managing three separate Git repos."*

#### Q2: What was the biggest architectural design challenge in FocusTrack?
**Answer:**
> *"The biggest challenge was state synchronization and data batching between the Chrome Extension and Backend. If the extension sent an HTTP request every second during active browsing, it would overwhelm the server and drain client performance. We solved this by creating a local buffer engine in `chrome.storage.local` combined with a periodic 1-minute `chrome.alarms` batch flush mechanism."*

---

### Category B: Chrome Extension & Manifest V3

#### Q3: How does the Chrome Extension track time without slowing down the browser?
**Answer:**
> *"Instead of using continuous `setInterval` polling or spamming HTTP requests, the extension uses event-driven listeners like `chrome.tabs.onActivated` and `chrome.tabs.onUpdated`. It calculates exact session duration when a tab changes and buffers log entries in `chrome.storage.local`. A periodic `chrome.alarms` trigger flushes data to the server once every minute in a single batch request."*

#### Q4: How does FocusTrack prevent tracking idle time when the user steps away from their computer?
**Answer:**
> *"We integrate `chrome.idle.setDetectionInterval(60)` alongside `chrome.windows.onFocusChanged`. When Chrome detects no mouse or keyboard input for 60 seconds or the user minimizes the window, the state changes to `idle` or `locked`. The background worker immediately closes the active session and pauses time calculation until user activity resumes."*

#### Q5: What is Manifest V3, and what specific challenges did it present compared to V2?
**Answer:**
> *"Manifest V3 replaces persistent background scripts with ephemeral Service Workers. Service workers automatically terminate after ~30 seconds of inactivity to conserve system memory. The challenge was that in-memory variables get wiped. We solved this by storing persistent state in `chrome.storage.local` and registering all top-level event listeners so Chrome can re-awaken the service worker whenever tab or alarm events fire."*

#### Q6: How do you extract clean domain names from URLs?
**Answer:**
> *"We parsing URLs using JavaScript's native `URL` API (`new URL(url)`). We filter out non-HTTP/HTTPS protocols (like internal `chrome://` or `about:blank` pages) and strip prefixes like `www.` to normalize domains (e.g., converting `https://www.github.com/repo` to `github.com`)."*

#### Q7: How does the extension handle offline mode or temporary network disconnects?
**Answer:**
> *"We built an offline-first buffering queue in `chrome.storage.local`. Tracking entries are appended to a `PENDING_SYNC` array in storage. When the alarm triggers `flushPendingSync()`, the queue is sent via HTTP POST. The storage queue is cleared **only after** receiving a successful HTTP 200 OK response from the server. If the network is offline, data stays queued safely without loss."*

---

### Category C: Backend REST API & Database (Node.js, Express, MongoDB)

#### Q8: How is the Productivity Score calculated on the backend?
**Answer:**
> *"Domains are classified into three categories: Productive (+1 weight), Neutral (0 weight), or Distracting (-1 weight). The backend runs a MongoDB aggregation pipeline summing tracked seconds per category for a user over a requested date range. The productivity score percentage formula is: `(Productive Time / Total Tracked Time) * 100`."*

#### Q9: Why did you choose MongoDB over a SQL database like PostgreSQL?
**Answer:**
> *"MongoDB's document model fits time-series tracking logs and flexible user-defined domain category mappings naturally. Domain logs can vary in structure without requiring rigid schema migrations. Furthermore, MongoDB aggregation pipelines allowed us to compute daily, weekly, and monthly productivity summaries efficiently."*

#### Q10: How did you optimize MongoDB queries for high volume tracking data?
**Answer:**
> *"We created compound indexes on `{ userId: 1, date: 1, domain: 1 }` in Mongoose schemas. This index drastically speeds up query performance when fetching daily domain summaries or aggregating tracking durations for a specific user."*

#### Q11: What security measures did you implement on the API server?
**Answer:**
> *"We implemented several layers of security:
> 1. **Helmet.js** to set secure HTTP response headers.
> 2. **CORS configuration** to restrict origin access.
> 3. **Express Rate Limit** (`express-rate-limit`) to throttle API requests against brute-force attacks.
> 4. **Express Validator** to sanitize and validate request payloads.
> 5. **Bcryptjs** to salt and hash user passwords with 10 rounds."*

#### Q12: How are reports generated and delivered to the client?
**Answer:**
> *"We created dedicated report routes using `pdfkit` for PDF generation and `json2csv` / `exceljs` for CSV/Excel data. The server streams the generated file back as a binary response (`Content-Type: application/pdf` or `text/csv`). The React frontend receives the blob and triggers an automatic browser file download."*

---

### Category D: Frontend (React 18, Vite, Tailwind, Recharts)

#### Q13: How is state and authentication managed in the React Dashboard?
**Answer:**
> *"We use React Context API (`AuthContext`) to manage user authentication state globally. Upon login, the signed JWT token is stored in `localStorage`. An Axios instance is configured with request interceptors to automatically attach `Authorization: Bearer <token>` to every outgoing request. Response interceptors catch 401 Unauthorized responses and redirect users to `/login`."*

#### Q14: How are protected routes implemented in React Router v6?
**Answer:**
> *"We created a `ProtectedRoute` wrapper component that checks the `isAuthenticated` flag from `AuthContext`. If authenticated, it renders child components (`<Outlet />`); otherwise, it redirects the user to `/login` using React Router's `<Navigate replace />`."*

#### Q15: Why did you use Recharts for analytics visualization?
**Answer:**
> *"Recharts is built specifically for React, using declarative SVG elements. It handles smooth responsive animations, customizable tooltips, and dynamic data binding out of the box, making it ideal for rendering real-time domain usage pie charts and weekly productivity trend lines."*

---

### Category E: Authentication, CORS & Security

#### Q16: How does JWT authentication work between the Chrome Extension and the Web Dashboard?
**Answer:**
> *"Both clients share the same backend authentication endpoints (`/api/auth/login` and `/api/auth/register`). When a user logs in via either the extension popup or web dashboard, the server returns a signed JWT. The React web app saves it in `localStorage`, while the extension saves it in `chrome.storage.local`. All protected requests pass this token in the `Authorization: Bearer <token>` header."*

#### Q17: How did you solve CORS issues for the Chrome Extension?
**Answer:**
> *"Chrome Extensions send HTTP requests from a unique origin (`chrome-extension://<EXTENSION_ID>`). Browser CORS rules block these requests by default. We solved this on Express by configuring `cors` middleware to explicitly allow extension origins and using header-based Bearer JWT authentication rather than cross-site cookies."*

---

### Category F: System Design, Scalability & Advanced Questions

#### Q18: How would you scale FocusTrack if it grows to 100,000 active daily users?
**Answer:**
> *"To scale to 100k daily users, I would implement:
> 1. **Message Queue Architecture**: Ingest incoming tracking batch payloads into a Redis stream or RabbitMQ queue (e.g., using BullMQ) to process writes asynchronously without blocking Node's event loop.
> 2. **MongoDB Time-Series Collections**: Upgrade tracking schemas to native MongoDB Time-Series collections optimized for measurement metrics over time.
> 3. **Dynamic Client Batching**: Increase the extension sync interval dynamically (e.g., from 1 min to 5 mins) during heavy traffic."*

#### Q19: What would you do if a malicious user tries to send fake domain tracking data to the API?
**Answer:**
> *"We would implement input schema validation with `express-validator` to enforce valid domain formats and maximum threshold constraints (e.g., rejecting single sessions claiming >24 hours of tracking in a single day). We can also rate-limit tracking sync endpoints per user ID."*

#### Q20: What was a tough bug you faced during development and how did you resolve it?
**Answer:**
> *"A tricky bug was continuous active duration miscalculations when users rapidly switched tabs. The start time of the new tab was overriding the previous tab session without closing it cleanly. We fixed this by refactoring tracking logic into an atomic `endCurrentSession()` function that computes exact elapsed delta time (`Math.round((Date.now() - sessionStartedAt) / 1000)`) before starting a new session."*

---

## 💼 5. Resume Bullet Points

- **Architected FocusTrack**, a full-stack monorepo featuring React 18, Node.js/Express, MongoDB Atlas, and Chrome Extension Manifest V3.
- **Engineered background time-tracking engine** using `chrome.tabs` and `chrome.idle` APIs, achieving 100% accurate idle-time filtering.
- **Designed offline-first storage pipeline** utilizing `chrome.storage.local` and `chrome.alarms`, eliminating tracking data loss during network dropouts.
- **Implemented REST API & JWT security** with `bcryptjs`, rate limiting, input validation, and MongoDB compound indexes for optimized aggregation queries.
- **Developed React 18 analytics UI** with Recharts, Tailwind CSS, goal visualization, and automated PDF/CSV report export engine.
