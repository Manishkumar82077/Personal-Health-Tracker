# Personal Health Tracker — Documentation

A health tracking app, built as **two independent codebases**:

- **`backend/`** — Express + TypeScript REST API. Talks to Firestore via the Firebase Admin SDK and verifies users with Firebase Auth.
- **`frontend/`** — Next.js + TypeScript + Tailwind. The UI. Calls the backend API and uses Firebase Auth for sign-in.

> **Status:** these docs describe the **shipped** app, not just a plan. The app started as a single-user tracker and has since grown a **shared food library** and a **community chat**, so it is now multi-user — each person's daily logs stay private, while the food/meal catalog and community are shared by everyone.

🔗 **Live:** https://personal-health-tracker-beta.vercel.app/

## How these docs are organized

| File | What it is |
|------|------------|
| `00-README.md` | This file. Overview + repo layout. |
| `01-system-design.md` | Architecture, tech stack, auth flow, theming, hosting. |
| `02-api-contract.md` | Every endpoint, request, response. |
| `03-data-model.md` | Firestore layout + the shared TypeScript interfaces. |
| `04-backend-tasks.md` | Backend build plan + what shipped. |
| `05-frontend-tasks.md` | Frontend build plan + what shipped. |

`02-api-contract.md` and `03-data-model.md` are the shared contract: the same types live in `backend/src/interface/*.model.ts` and `frontend/lib/types.ts`. Change the contract first, then both sides.

## What the app does

- **Auth** — email/password sign up & sign in (Firebase Auth), forgot-password reset email, in-app change password.
- **Daily dashboard** — calories, macros, water, steps, sleep, workouts for any date, with progress vs. goals.
- **Trackers** — Food, Water, Workouts, Steps, Sleep.
- **Goals & profile** — per-metric targets, display name, weight (Settings).
- **Shared food library** — global, searchable `itemList` + `mealList`; search-first "add food"; create new (with duplicate prevention).
- **Community** — Telegram-style chat: messages, emoji reactions, replies, public profiles.
- **Light/dark theme** + cute heading font (Baloo 2) over a modern body font (Geist).

## Repository layout

```
personal-health-tracker/
├── docs/                       ← these documents
├── README.md                   ← top-level project readme
├── backend/                    ← Express + Firestore API
│   └── src/
│       ├── index.ts  app.ts
│       ├── config/             firebase.ts
│       ├── middleware/         auth.ts, errorHandler.ts
│       ├── routes/             one router per resource (+ index.ts)
│       ├── controlers/         request handlers (existing spelling kept)
│       ├── services/           Firestore access + business logic
│       ├── interface/          shared TypeScript models
│       ├── data/               foodCatalog.json (seed: 200 items + meals)
│       └── scripts/            seedCatalog.ts
└── frontend/                   ← Next.js app (App Router)
    ├── app/                    /, /dashboard, /login, /signup, /food, /water,
    │                           /workout, /steps, /sleep, /library, /settings,
    │                           /community, /community/profile/[uid]
    ├── components/             ui/, forms/, community/, theme, nav
    ├── lib/                    api.ts, mock.ts, types.ts, firebase.ts, date.ts
    └── hooks/                  SWR data hooks
```

## Running it locally

```bash
# terminal 1 — backend
cd backend && npm install && npm run dev      # http://localhost:5000

# terminal 2 — frontend
cd frontend && npm install && npm run dev     # http://localhost:3000
```

The frontend reads `NEXT_PUBLIC_API_URL` (point it at `http://localhost:5000/api`). The backend allows `CORS_ORIGIN=http://localhost:3000`. Set `NEXT_PUBLIC_USE_MOCK=true` to run the whole UI with in-memory data and no backend. See `04`/`05` for the full env var lists.

Seed the shared food catalog once (writes `itemList` + `mealList` to Firestore):

```bash
cd backend && npm run seed
```

## Hosting

| Piece | Host |
|-------|------|
| Frontend | **Vercel** — https://personal-health-tracker-beta.vercel.app/ |
| Backend | **Render** web service (`/api`) |
| Database | **Firebase / Cloud Firestore** |
