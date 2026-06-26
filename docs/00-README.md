# Personal Health Tracker — Documentation

A personal health tracking app, built as **two independent codebases**:

- **`backend/`** — Express + TypeScript REST API. Talks to Firestore via the Firebase Admin SDK and verifies users with Firebase Auth.
- **`frontend/`** — Next.js + TypeScript + Tailwind. The UI. Calls the backend API and uses Firebase Auth only for login.

This is a single-user app (you). It runs entirely on free tiers.

## How these docs are organized

Read them in order. The first time, read all of them. After that, `02` and `03` are the ones you return to.

| File | What it is | Who needs it |
|------|------------|--------------|
| `00-README.md` | This file. Overview + the two-agent workflow. | Both agents |
| `01-system-design.md` | Architecture, tech stack, auth flow, hosting. | Both agents |
| `02-api-contract.md` | **The shared treaty.** Every endpoint, request, response. | **Both agents** |
| `03-data-model.md` | Firestore layout + the TypeScript interfaces both sides share. | **Both agents** |
| `04-backend-tasks.md` | The backend agent's full build plan and checklist. | Backend agent |
| `05-frontend-tasks.md` | The frontend agent's full build plan and checklist. | Frontend agent |

## The two-agent workflow

You want one agent on the backend and one on the frontend, working in parallel. That only works if they never disagree about how they talk. So there is one rule:

> **`02-api-contract.md` and `03-data-model.md` are frozen and shared. Neither agent changes them alone. If a change is needed, update the contract first, then both agents adapt.**

Practical setup:

1. **Copy the type definitions from `03-data-model.md` into both repos, identically.**
   - Backend: `backend/src/interface/*.model.ts`
   - Frontend: `frontend/lib/types.ts`
   - These two must stay byte-for-byte equivalent. They are the contract in code form.

2. **Give each agent a focused brief.** In `backend/AGENTS.md` (or `CLAUDE.md`), paste the backend agent's job: "Build the API in `02-api-contract.md`. Follow `01`, `03`, `04`. Do not touch `frontend/`." Do the mirror for the frontend agent in `frontend/AGENTS.md`.

3. **Frontend can start before the backend is finished.** It builds against the contract and uses a small mock layer (described in `05`) until the real API is live. Swapping mock for real is a one-line change because all calls go through `lib/api.ts`.

4. **Integrate at the end.** Point `NEXT_PUBLIC_API_URL` at the running backend, confirm CORS allows the frontend origin, log in once, and walk the dashboard.

## Repository layout (target)

```
assesment/
├── docs/                  ← these documents
├── backend/               ← owned by the backend agent
│   └── src/
│       ├── index.ts
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── controlers/    ← existing spelling kept; see note in 04
│       ├── services/
│       └── interface/
└── frontend/              ← owned by the frontend agent
    ├── app/
    ├── components/
    ├── lib/
    └── hooks/
```

## Running it locally (once both halves exist)

```bash
# terminal 1 — backend
cd backend && npm install && npm run dev      # http://localhost:4000

# terminal 2 — frontend
cd frontend && npm install && npm run dev     # http://localhost:3000
```

The frontend reads `NEXT_PUBLIC_API_URL=http://localhost:4000/api`. The backend allows `CORS_ORIGIN=http://localhost:3000`. See each tasks doc for the full env var list.

## Build order at a glance

1. Backend: Firebase Admin + auth middleware + health check (so the frontend has something to hit).
2. Both: profile/goals, then food + the dashboard endpoint (the core loop).
3. Both: water, steps, sleep, workouts (all the same shape as food).
4. Both: meals (create reusable, log to a day).
5. Polish, then the AI phase (see `01`, "Future: AI features").
