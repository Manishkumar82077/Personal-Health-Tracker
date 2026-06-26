# 01 — System Design

## Overview

Two separate apps that talk over HTTP/JSON:

```
Browser ──▶ Next.js frontend (Vercel) ──▶ Express API (Render / Cloud Run) ──▶ Firestore
                     │                                  ▲
                     └────── Firebase Auth ─────────────┘
                          (login on the client,
                           token verified on the server)
```

The frontend never touches the database directly. It signs the user in with Firebase Auth, gets an ID token, and sends that token on every API request. The backend verifies the token, learns the user's `uid`, and does all Firestore work scoped to that user.

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js (App Router) + TypeScript + Tailwind | Already scaffolded; mobile-first UI |
| Backend | Express + TypeScript | Already scaffolded; plain REST API |
| Auth | Firebase Auth | Free, handles login; backend verifies via Admin SDK |
| Database | Cloud Firestore | Free Spark tier; accessed only from the backend |
| AI (later) | Gemini API (free tier) | Lives behind backend routes so the key stays secret |

## Why a separate backend (vs. the frontend calling Firestore directly)

Both designs are valid. You have chosen the separate-backend design, which is the better fit here because:

- The AI features need a secret API key. A secret can never live in browser code. A backend is the natural place for it, and you already have one.
- Business logic (computing daily totals, expanding a meal into food entries, estimating calories burned) lives in one place and is reusable.
- The frontend stays thin: it renders data and posts forms. It does not own any rules.

The cost is that you run and host two things instead of one. For a personal app that is a small, acceptable cost.

## Authentication flow

1. **Login (frontend).** User signs in on `/login` with Firebase Auth (email/password or Google). Firebase returns a user and an **ID token** (a signed JWT).
2. **Every request (frontend).** `lib/api.ts` calls `getIdToken()` and attaches `Authorization: Bearer <token>` to the request. Firebase refreshes the token automatically when it nears expiry.
3. **Verify (backend).** `middleware/auth.ts` reads the header and calls `admin.auth().verifyIdToken(token)`. On success it sets `req.uid` and continues; on failure it returns `401`.
4. **Scope (backend).** Every Firestore read/write is under `users/{req.uid}/...`. A user can only ever see their own data, enforced in code by always using `req.uid`.

There is no separate "users table" to manage — Firebase Auth is the source of truth for identity. The backend lazily creates a profile document on first request (see the `GET /api/profile` behavior in `02`).

## Error handling

The backend returns a consistent error envelope so the frontend can handle failures uniformly:

```json
{ "error": { "code": "NOT_FOUND", "message": "Food entry not found" } }
```

Status codes used: `200` OK, `201` Created, `204` No Content, `400` Bad Request (validation), `401` Unauthorized (bad/missing token), `404` Not Found, `500` Internal Error. Full details in `02`.

## Dates and time

- All calendar dates are strings in `YYYY-MM-DD` format, in the **user's local day**. The frontend decides "today" and sends it explicitly; the backend never guesses the timezone.
- All timestamps (`createdAt`, `updatedAt`) are ISO 8601 strings set by the backend.
- `steps` and `sleep` have exactly one record per day, so their document ID **is** the date string. Food, water, and workouts can have many per day, so they get generated IDs and carry a `date` field.

## Hosting (all free)

| Piece | Host | Notes |
|-------|------|-------|
| Frontend | **Vercel** (Hobby) | Free, personal/non-commercial. Built for Next.js. |
| Backend | **Render** free web service | Free, but spins down after inactivity, so the first request after a quiet period takes ~1 minute to wake. Fine for personal use. |
| Backend (alt) | **Google Cloud Run** | Same Google ecosystem as Firebase, scales to zero with fast cold starts, has a free tier. A bit more setup than Render. |
| Database | **Firebase** (Spark) | Free. 1 GB storage, 50k reads / 20k writes per day — far beyond one person. |

Note: Railway is no longer a true free tier (trial credit only, card required as of 2023), so prefer Render or Cloud Run if "stays free" matters. Verify current limits before you deploy, since free tiers change.

For development you can also just run the backend locally and only deploy the frontend — for a personal tool that is often enough.

## Future: AI features (separate phase, do not build yet)

When you add AI, it slots in as **new backend routes only**. Nothing else changes.

- Add `GEMINI_API_KEY` to the backend `.env`.
- Add routes like `POST /api/ai/workout-estimate`, `POST /api/ai/meal-suggestions`, `POST /api/ai/sleep-analysis`. Each reads the relevant Firestore data for `req.uid`, builds a prompt, calls Gemini, and returns structured JSON.
- The frontend adds buttons that call these routes and render the result. No new infrastructure.

Planned AI capabilities (from the original brief): estimate calories burned and training volume from workouts, suggest meals for the remaining calories/macros, analyze sleep quality, recommend workout improvements, and generate weekly/monthly reports. All of these are "read user data → prompt → return JSON," so they share one helper.

Privacy note: the Gemini free tier may use inputs to improve Google's models, so avoid sending anything sensitive through it. Add a small retry-with-backoff because the free tier is rate-limited per minute.
