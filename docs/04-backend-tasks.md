# 04 — Backend Build Plan (backend agent)

You own `backend/` only. Build the API defined in `02-api-contract.md`, using the types in `03-data-model.md`. Do not modify `frontend/` or change the contract.

## Target folder structure

Building on what already exists (`src/index.ts`, `src/controlers/users/getUsers.ts`, `src/interface/user.model.ts`):

```
backend/
├── .env
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                      # express app, middleware, mount routes, listen
    ├── config/
    │   └── firebase.ts               # Firebase Admin init from service-account env vars
    ├── middleware/
    │   ├── auth.ts                   # verifyToken → sets req.uid; 401 on failure
    │   └── errorHandler.ts           # turns thrown errors into the {error:{...}} envelope
    ├── routes/
    │   ├── index.ts                  # mounts every router under /api
    │   ├── profile.routes.ts
    │   ├── food.routes.ts
    │   ├── meals.routes.ts
    │   ├── water.routes.ts
    │   ├── workout.routes.ts
    │   ├── steps.routes.ts
    │   ├── sleep.routes.ts
    │   └── dashboard.routes.ts
    ├── controlers/                   # keep existing spelling (see note)
    │   ├── users/getUsers.ts         # existing
    │   ├── profile/ food/ meals/ water/ workout/ steps/ sleep/ dashboard/
    ├── services/                     # Firestore data access, one file per resource
    │   ├── food.service.ts
    │   ├── meals.service.ts
    │   ├── water.service.ts
    │   ├── workout.service.ts
    │   ├── steps.service.ts
    │   ├── sleep.service.ts
    │   └── profile.service.ts
    └── interface/                    # the shared types from 03
        ├── user.model.ts             # existing
        ├── food.model.ts  meal.model.ts  water.model.ts  workout.model.ts
        └── steps.model.ts  sleep.model.ts  dashboard.model.ts
```

> Note on `controlers/`: the existing folder is spelled without the second "l". Keep that spelling so existing imports don't break, OR rename it to `controllers/` in one pass and update imports. Pick one and be consistent — don't end up with both.

Layering: **route → controller → service.** Routes wire URLs to controllers. Controllers validate input and shape responses. Services do the Firestore reads/writes. Keep Firestore calls only in `services/`.

## Dependencies

```bash
cd backend
npm install express cors firebase-admin
npm install -D typescript ts-node-dev @types/express @types/cors @types/node
```

## Environment variables (`backend/.env`)

```
PORT=4000
CORS_ORIGIN=http://localhost:3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# GEMINI_API_KEY=        # AI phase only, leave blank for now
```

Get `FIREBASE_*` from the Firebase console → Project settings → Service accounts → "Generate new private key". When reading `FIREBASE_PRIVATE_KEY` in code, replace literal `\n` with real newlines: `process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')`.

## Key implementation notes

- **`config/firebase.ts`** — initialize Admin once with `cert({ projectId, clientEmail, privateKey })`; export `admin.firestore()` as `db`.
- **`middleware/auth.ts`** — read `Authorization: Bearer <token>`; `await admin.auth().verifyIdToken(token)`; set `req.uid = decoded.uid`; on any failure `return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } })`. Apply this middleware to everything under `/api` except `/api/health`.
- **`index.ts`** — `app.use(cors({ origin: process.env.CORS_ORIGIN }))`, `app.use(express.json())`, mount `/api/health` (open), then auth middleware, then `routes/index.ts`, then `errorHandler` last.
- **Validation** — reject missing required fields and negative numbers with `400` and the error envelope. Keep it simple (manual checks or a tiny schema lib); don't over-engineer.
- **`req.uid` typing** — extend Express's `Request` type (a `types/express/index.d.ts` declaration) so `req.uid` is typed.
- **All services take `uid` as the first argument** and operate under `users/{uid}/...`. Never trust a uid from the request body — only use `req.uid`.

## Build order / checklist

Do these top to bottom. After each numbered group the API is testable with `curl` using a real Firebase ID token.

- [ ] **0. Setup** — install deps, add `tsconfig.json`, add `dev`/`build`/`start` scripts (`ts-node-dev src/index.ts`), create `.env`.
- [ ] **1. Boot + health** — `config/firebase.ts`, `index.ts` with CORS + JSON, `GET /api/health` returning `{status:"ok"}`. Confirm the server starts.
- [ ] **2. Auth** — `middleware/auth.ts`; apply to `/api`. Confirm a request without a token gets `401` and one with a valid token passes.
- [ ] **3. Profile** — `GET /api/profile` (lazy-create with default goals), `PUT /api/profile`. This also proves Firestore writes work.
- [ ] **4. Food + Dashboard** — food CRUD (`GET ?date`, `POST`, `DELETE /:id`), then `GET /api/dashboard?date=` (start with food totals; fill in the rest as those resources land). This is the core loop.
- [ ] **5. Water** — `GET ?date` (with `totalMl`), `POST`, `DELETE /:id`. Add water into the dashboard totals.
- [ ] **6. Steps** — `GET ?date` (0 if none), `PUT /:date` upsert. Add into dashboard.
- [ ] **7. Sleep** — `GET ?date`, `PUT /:date` upsert with duration calc. Add into dashboard.
- [ ] **8. Workouts** — `GET ?date`, `POST`, `DELETE /:id`. Add the day's workouts array into dashboard.
- [ ] **9. Meals** — `GET`, `POST` (compute totals), `PUT /:id`, `DELETE /:id`, `POST /:id/log` (expand to food entries).
- [ ] **10. Harden** — consistent errors everywhere, input validation, add Firestore indexes if the console asks, deploy to Render or Cloud Run, set `CORS_ORIGIN` to the deployed frontend URL.

## How the frontend will call you

Locally the frontend hits `http://localhost:4000/api` with `Authorization: Bearer <token>`. Make sure CORS allows `http://localhost:3000` in dev and the real Vercel origin in production. If you change a response shape, update `02`/`03` and tell the frontend agent.
