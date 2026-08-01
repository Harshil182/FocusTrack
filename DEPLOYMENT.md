# FocusTrack — Deployment Guide

## 1. MongoDB Atlas (Database)
1. Create a free cluster at https://www.mongodb.com/atlas
2. Database Access → add a user with a strong password.
3. Network Access → allow your deployment platform's IP (or `0.0.0.0/0` for simplicity, tightened later).
4. Copy the connection string into `server/.env` as `MONGO_URI`.

## 2. Backend — Render (or Railway / Fly.io)
1. Push the `server/` folder to a Git repo (or the whole monorepo with a root directory setting).
2. On Render: **New Web Service** → connect repo → set:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Add environment variables from `server/.env.example`:
   `PORT`, `NODE_ENV=production`, `CLIENT_URL`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`.
4. Deploy. Note the public URL, e.g. `https://focustrack-api.onrender.com`.

## 3. Frontend — Vercel (or Netlify)
1. Import the repo → set **Root Directory** to `client`.
2. Build Command: `npm run build` · Output Directory: `dist`.
3. Environment variable: `VITE_API_BASE_URL=https://focustrack-api.onrender.com/api`.
4. Deploy. Note the public URL, e.g. `https://focustrack.vercel.app`.
5. Go back to the backend's `CLIENT_URL` env var and set it to this Vercel URL, then redeploy the backend (needed for CORS).

## 4. Chrome Extension — Chrome Web Store
1. In `extension/utils/api.js`, change `API_BASE_URL` to your deployed backend URL.
2. In `extension/popup/popup.html`, update the "Open Full Dashboard" link to your Vercel URL.
3. Update `manifest.json` → `host_permissions` to include your production API domain.
4. Zip the `extension/` folder contents (not the folder itself as top level — the manifest must be at the zip root).
5. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole), pay the one-time $5 registration fee if you haven't, and upload the zip.
6. Fill in store listing (screenshots, description, privacy policy — required since the extension handles browsing data).
7. Submit for review (typically a few days).

## 5. Post-deploy checklist
- [ ] Backend `/api/health` returns 200
- [ ] Register/login works end-to-end from the deployed frontend
- [ ] Extension popup successfully logs in against the production API
- [ ] CORS: only the production frontend origin is allowed
- [ ] `NODE_ENV=production` set on the backend (disables verbose error stacks)
- [ ] MongoDB Atlas network access is scoped (not left wide open long-term)
- [ ] JWT_SECRET is a long, random, unique value (never reuse the example)
