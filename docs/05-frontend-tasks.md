# 05 — Frontend Build Plan (frontend agent)

You own `frontend/` only. Build the UI that consumes the API in `02-api-contract.md`, using the types in `03-data-model.md`. Do not modify `backend/` or change the contract.

You can build the whole UI **before the backend is finished** by pointing the API client at a mock (see "Mock-first" below) and flipping one flag when the real API is up.

## Target structure

Building on the existing scaffold (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`, Tailwind via `postcss`):

```
frontend/
├── app/
│   ├── layout.tsx              # add AuthProvider + bottom nav
│   ├── page.tsx                # the dashboard (home)
│   ├── globals.css             # Tailwind
│   ├── login/page.tsx          # Firebase Auth login
│   ├── food/page.tsx
│   ├── water/page.tsx
│   ├── workout/page.tsx
│   ├── steps/page.tsx
│   ├── sleep/page.tsx
│   ├── meals/page.tsx
│   └── settings/page.tsx       # edit goals
├── components/
│   ├── ui/                     # Card, ProgressBar, StatTile, Button, Input, Spinner
│   ├── DashboardGrid.tsx       # the cards + progress bars
│   ├── BottomNav.tsx           # mobile-first nav
│   └── forms/                  # FoodForm, WaterForm, WorkoutForm, StepsForm, SleepForm, MealForm
├── lib/
│   ├── firebase.ts             # client SDK init (auth only)
│   ├── api.ts                  # fetch wrapper: base URL + Bearer token + error handling
│   ├── api/                    # one typed module per resource
│   │   ├── food.ts  meals.ts  water.ts  workouts.ts
│   │   ├── steps.ts  sleep.ts  profile.ts  dashboard.ts
│   ├── mock.ts                 # in-memory fake API (mock-first development)
│   ├── date.ts                 # today() and YYYY-MM-DD helpers
│   └── types.ts                # the shared types from 03 (mirror of backend)
└── hooks/
    ├── useAuth.ts              # Firebase auth state + getIdToken
    └── useDashboard.ts         # SWR hook → GET /api/dashboard
```

## Dependencies

```bash
cd frontend
npm install firebase swr
```

(`firebase` for client auth; `swr` for data fetching/caching. Tailwind is already set up.)

## Environment variables (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_USE_MOCK=true        # flip to false when the backend is live
```

These come from Firebase console → Project settings → "Your apps" → Web app config. They are public by design (the client config is not a secret; security is enforced by the backend verifying the token).

## The API client (the most important frontend piece)

Every network call goes through `lib/api.ts` so auth and errors are handled in exactly one place:

- It builds the URL from `NEXT_PUBLIC_API_URL`.
- It calls `getIdToken()` (from `useAuth`/Firebase) and sets `Authorization: Bearer <token>`.
- It parses JSON, and on non-2xx throws an `Error` carrying the `error.code`/`message` from the envelope.
- The per-resource modules in `lib/api/` are thin typed wrappers, e.g. `getFood(date): Promise<FoodEntry[]>`, `addFood(input): Promise<FoodEntry>`.

**Mock-first:** when `NEXT_PUBLIC_USE_MOCK=true`, `lib/api.ts` routes calls to `lib/mock.ts` (an in-memory store that returns contract-shaped data) instead of `fetch`. This lets you build and demo the entire UI with zero backend. Flip the flag to `false` to use the real API — no component changes.

## Auth wiring

- `lib/firebase.ts` initializes the Firebase **client** SDK (auth only — no Firestore on the client).
- `hooks/useAuth.ts` exposes `{ user, loading, signIn, signOut, getToken }` via `onAuthStateChanged`.
- `app/layout.tsx` wraps the app in an `AuthProvider`. Unauthenticated users are redirected to `/login`. The login page offers email/password and/or Google sign-in.

## UI direction

Mobile-first, light theme, cards with progress bars (per the original brief). The dashboard is a grid of `StatTile`s: Calories (with remaining), Protein, Carbs, Fat, Fiber, Water, Steps, Sleep, plus a Workout summary tile. Each tile shows the number, the goal, and a `ProgressBar` from the dashboard `progress` value. A `BottomNav` switches between sections. Design with Tailwind's `dark:` variants in mind so dark mode is a later toggle, not a rewrite.

> If you want a stronger visual identity, the `frontend-design` skill covers typography and styling tokens for this environment — worth a look before locking the component styles.

## Build order / checklist

- [ ] **0. Setup** — install `firebase` + `swr`, add `.env.local`, create `lib/types.ts` (paste from `03`), `lib/date.ts`, and the `ui/` primitives (Card, ProgressBar, StatTile, Button, Input, Spinner).
- [ ] **1. API client + mock** — `lib/api.ts` with the mock switch, plus `lib/mock.ts`. Build the rest against the mock.
- [ ] **2. Auth** — `lib/firebase.ts`, `useAuth`, `AuthProvider`, `/login`, and redirect-if-signed-out. (Mock can stub a fake token until real Firebase is wired.)
- [ ] **3. Dashboard** — `useDashboard` → `GET /api/dashboard?date=today`, render `DashboardGrid` with all tiles and progress bars. This is the centerpiece.
- [ ] **4. Food** — `/food`: list today's entries + `FoodForm` to add + delete. Dashboard updates after a change (revalidate SWR).
- [ ] **5. Water / Steps / Sleep** — same add-and-list pattern; small screens.
- [ ] **6. Workouts** — `/workout`: list + `WorkoutForm` (exercise, weight, reps, sets) + delete.
- [ ] **7. Meals** — `/meals`: create reusable meals with multiple items; then a "Log meal" action on the food screen that calls `POST /api/meals/:id/log`.
- [ ] **8. Settings** — `/settings`: edit goals via `PUT /api/profile`.
- [ ] **9. Polish** — loading/empty/error states, a date switcher to view past days, mobile spacing; deploy to Vercel and set `NEXT_PUBLIC_API_URL` to the deployed backend, `NEXT_PUBLIC_USE_MOCK=false`.

## Contract discipline

Treat `02` and `03` as read-only truth. If you find the contract can't express something the UI needs, don't improvise a different shape — note it, update `02`/`03`, and coordinate with the backend agent so both sides change together.
