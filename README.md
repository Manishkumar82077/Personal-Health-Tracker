# 🩺 Personal Health Tracker

A full-stack health & wellness tracker — log your food, water, workouts, steps, and sleep, see it all roll up into one clean daily dashboard, reuse a shared food library, and cheer each other on in a Telegram-style community chat.

🔗 **Live app:** https://personal-health-tracker-beta.vercel.app/

---

## ✨ Features

- **Auth** — email/password sign up & sign in (Firebase Auth), forgot-password reset email, and in-app change password.
- **Daily dashboard** — calories, macros (protein/carbs/fat/fiber), water, steps, sleep, and workouts for any date, with progress against your goals.
- **Trackers** — dedicated pages for Food, Water, Workouts, Steps, and Sleep.
- **Goals & profile** — set per-metric targets and your display name/weight in Settings.
- **Food library (shared)** — a global, searchable catalog of **food items** and **meals** that grows as users add to it (with duplicate prevention). Search-first "add food" flow: find & log, or create new.
- **Community chat** — a Telegram-style group chat: message bubbles, emoji **reactions**, **reply** to a message, and tappable **public profiles**.
- **Light / dark mode** — manual theme toggle (light / dark / system) with no flash on load.

---

## 🧱 Tech stack

| Layer | Stack |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, SWR, Firebase Web SDK (auth), react-icons |
| **Backend** | Node + Express 5, TypeScript, Firebase Admin SDK |
| **Database** | Cloud Firestore |
| **Hosting** | Frontend → Vercel · Backend → Render |

---

## 📁 Project structure

```
personal-health-tracker/
├── frontend/            # Next.js app (App Router)
│   ├── app/             # routes: /, /dashboard, /food, /library, /community, /settings, ...
│   ├── components/      # UI, forms, community chat, theme
│   ├── hooks/           # SWR data hooks
│   └── lib/             # api client, mock layer, types, firebase, date utils
├── backend/             # Express + Firestore API
│   └── src/
│       ├── routes/      # route definitions
│       ├── controlers/  # request handlers
│       ├── services/    # Firestore data access + business logic
│       ├── interface/   # shared TypeScript models
│       ├── data/        # foodCatalog.json (seed data: 200 items + meals)
│       └── scripts/     # seedCatalog.ts
└── docs/                # design notes, API contract, data model
```

---

## 🔌 API overview

All routes are under `/api` and require a Firebase ID token (`Authorization: Bearer <token>`), except `GET /api/health`.

| Area | Endpoints |
|---|---|
| Profile | `GET/PUT /profile` |
| Dashboard | `GET /dashboard?date=` |
| Food log | `GET/POST /food`, `DELETE /food/:id` |
| Food items (shared) | `GET /food-items`, `GET /food-items/library`, `POST /food-items`, `PUT/DELETE /food-items/:id`, `POST /food-items/:id/log` |
| Meals (shared) | `GET/POST /meals`, `PUT/DELETE /meals/:id`, `POST /meals/:id/log` |
| Water | `GET/POST /water`, `DELETE /water/:id` |
| Workouts | `GET/POST /workouts`, `DELETE /workouts/:id` |
| Steps | `GET /steps?date=`, `PUT /steps/:date` |
| Sleep | `GET /sleep?date=`, `PUT /sleep/:date` |
| Community | `GET/POST /community/posts`, `DELETE /community/posts/:id`, `POST /community/posts/:id/react`, `GET /community/profile/:uid` |

---

## 🗄️ Data model (Firestore)

**Per-user** (private) — under `users/{uid}/`:
- `foodEntries`, `waterLogs`, `workouts`, `steps`, `sleep` — the daily logs
- the user profile doc lives at `users/{uid}`

**Global (shared by all users)** — top-level collections:
- `itemList` — reusable food items (per-100g nutrition + serving size)
- `mealList` — reusable meals (items + quantities)
- `posts` — community messages, with `posts/{id}/reactions/{uid}`

> Daily logs stay private; the food library and community are shared.

---

## 🚀 Local development

### Prerequisites
- Node.js 20+
- A Firebase project with **Authentication (Email/Password)** and **Firestore** enabled, plus a service-account key for the backend.

### 1. Backend
```bash
cd backend
npm install
# create backend/.env (see below)
npm run dev          # starts the API on PORT (default 5000)
```

`backend/.env`:
```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Frontend
```bash
cd frontend
npm install
# create frontend/.env.local (see below)
npm run dev          # http://localhost:3000
```

`frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_USE_MOCK=false          # set true to run with in-memory mock data, no backend
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
```

> **Mock mode:** set `NEXT_PUBLIC_USE_MOCK=true` to explore the whole app with seeded in-memory data and no backend or Firebase required.

### 3. Seed the shared food catalog
Populates `itemList` (200 food items) and `mealList` (sample meals) in Firestore:
```bash
cd backend
npm run seed
```
The data lives in [`backend/src/data/foodCatalog.json`](backend/src/data/foodCatalog.json) — edit it and re-run `npm run seed` (it's idempotent; deterministic IDs overwrite).

---

## 📜 Scripts

**Backend** (`backend/`)
| Script | Description |
|---|---|
| `npm run dev` | Start API with hot reload (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm run seed` | Seed the global food catalog into Firestore |

**Frontend** (`frontend/`)
| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint |

---

## ☁️ Deployment

- **Frontend → Vercel** — set the `NEXT_PUBLIC_*` env vars in the Vercel project; `NEXT_PUBLIC_API_URL` points at the deployed backend.
- **Backend → Render** — set the `FIREBASE_*` env vars and `CORS_ORIGIN` (your Vercel URL).

---

## 🔒 Security notes

- Service-account credentials (`FIREBASE_PRIVATE_KEY`, etc.) belong only in `backend/.env` / your host's secret manager — never commit them (both `.env` files are gitignored).
- Public profiles expose only display name, join date, and posts — never email, weight, or goals.
