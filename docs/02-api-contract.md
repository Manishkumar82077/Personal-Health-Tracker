# 02 — API Contract (the shared treaty)

**Both agents follow this exactly.** The backend implements it; the frontend consumes it. Do not change an endpoint, field name, or shape without updating this file first.

## Conventions

- **Base URL:** `/api` (e.g. `http://localhost:4000/api`).
- **Auth:** every endpoint except `GET /api/health` requires `Authorization: Bearer <Firebase ID token>`. Missing/invalid token → `401`.
- **Content type:** requests and responses are `application/json`.
- **Dates:** `date` is always a `YYYY-MM-DD` string. Times (`sleepTime`, `wakeTime`) are `HH:MM` 24-hour strings.
- **IDs:** server-generated string IDs, except `steps` and `sleep` where the ID is the date.
- **Errors:** non-2xx responses use `{ "error": { "code": "STRING", "message": "STRING" } }`.

### Status codes

| Code | Meaning |
|------|---------|
| 200 | OK (read or update) |
| 201 | Created |
| 204 | Deleted (no body) |
| 400 | Validation failed |
| 401 | Missing or invalid token |
| 404 | Resource not found |
| 500 | Server error |

The TypeScript types referenced below (`FoodEntry`, `Meal`, etc.) are defined in `03-data-model.md`.

---

## Health

### `GET /api/health`
No auth. Liveness check for the frontend and the host.
- **200** → `{ "status": "ok" }`

---

## Profile & goals

### `GET /api/profile`
Returns the user's profile and goals. **If no profile exists yet, the backend creates one with default goals and returns it** (lazy creation on first login).
- **200** → `Profile`

### `PUT /api/profile`
Update goals and weight. Send only the fields you want to change.
- **Body:** `Partial<Goals> & { weightKg?: number, displayName?: string }`
- **200** → `Profile`
- **400** if any numeric goal is negative.

Default goals created on first call:
```json
{
  "calorieGoal": 2000, "proteinGoal": 120, "carbsGoal": 250,
  "fatGoal": 65, "fiberGoal": 30, "waterGoalMl": 3000,
  "stepGoal": 10000, "sleepGoalHours": 8
}
```

---

## Food

### `GET /api/food?date=YYYY-MM-DD`
List all food entries for one day. `date` is required.
- **200** → `FoodEntry[]`

### `POST /api/food`
Add a food entry.
- **Body:**
```json
{
  "name": "Cooked rice",
  "quantity": 300,
  "calories": 900, "protein": 18, "carbs": 200, "fat": 2, "fiber": 4,
  "micros": { "iron": 2.5 },
  "date": "2026-06-26"
}
```
`micros` is optional. `mealId` is omitted for manual entries.
- **201** → `FoodEntry`
- **400** if `name`/`date` missing or any macro is negative.

### `DELETE /api/food/:id`
- **204** (no body)
- **404** if the entry doesn't belong to the user.

---

## Meals (reusable templates)

### `GET /api/meals`
- **200** → `Meal[]`

### `POST /api/meals`
Create a reusable meal. **The backend computes `totals` from the items** — the client does not send totals.
- **Body:**
```json
{
  "name": "Rice + Dal",
  "items": [
    { "name": "Cooked rice", "caloriesPer100": 300, "proteinPer100": 6, "carbsPer100": 67, "fatPer100": 0.7, "fiberPer100": 1.3, "quantity": 300 },
    { "name": "Cooked dal",  "caloriesPer100": 120, "proteinPer100": 9, "carbsPer100": 20, "fatPer100": 0.4, "fiberPer100": 8,   "quantity": 200 }
  ]
}
```
- **201** → `Meal` (with computed `totals`)

### `PUT /api/meals/:id`
Replace name and/or items; backend recomputes totals.
- **Body:** `{ name?: string, items?: MealItem[] }`
- **200** → `Meal`

### `DELETE /api/meals/:id`
- **204**

### `POST /api/meals/:id/log`
Log a saved meal to a day. The backend expands each item into a `FoodEntry` for that date (each entry carries `mealId`).
- **Body:** `{ "date": "2026-06-26" }`
- **201** → `{ "entries": FoodEntry[] }`
- **404** if the meal isn't the user's.

---

## Water

### `GET /api/water?date=YYYY-MM-DD`
- **200** → `{ "logs": WaterLog[], "totalMl": number }`

### `POST /api/water`
- **Body:** `{ "amountMl": 250, "date": "2026-06-26" }`
- **201** → `WaterLog`

### `DELETE /api/water/:id`
- **204**

---

## Workouts

### `GET /api/workouts?date=YYYY-MM-DD`
- **200** → `Workout[]`

### `POST /api/workouts`
- **Body:** `{ "exercise": "Calf raise", "weightKg": 40, "reps": 8, "sets": 3, "date": "2026-06-26" }`
- **201** → `Workout`
- Note: no calories/intensity yet — those are an AI phase. Store raw data only.

### `DELETE /api/workouts/:id`
- **204**

---

## Steps (one per day, upsert)

### `GET /api/steps?date=YYYY-MM-DD`
Returns `count: 0` if nothing logged.
- **200** → `StepsEntry`

### `PUT /api/steps/:date`
Create or overwrite the day's step count. `:date` is `YYYY-MM-DD`.
- **Body:** `{ "count": 8432 }`
- **200** → `StepsEntry`

---

## Sleep (one per day, upsert)

### `GET /api/sleep?date=YYYY-MM-DD`
- **200** → `SleepEntry` (or `404` if not logged)

### `PUT /api/sleep/:date`
Create or overwrite the night's sleep. **The backend computes `durationMinutes`** from the two times (handling the wrap past midnight).
- **Body:** `{ "sleepTime": "23:30", "wakeTime": "07:00" }`
- **200** → `SleepEntry`

---

## Dashboard (aggregated — one call powers the home screen)

### `GET /api/dashboard?date=YYYY-MM-DD`
The backend gathers the day's food, water, steps, sleep, and workouts, sums everything, compares against the user's goals, and returns it all at once. This keeps the frontend simple — the home page makes exactly one request.

- **200** →
```json
{
  "date": "2026-06-26",
  "goals": { "calorieGoal": 2000, "proteinGoal": 120, "carbsGoal": 250, "fatGoal": 65, "fiberGoal": 30, "waterGoalMl": 3000, "stepGoal": 10000, "sleepGoalHours": 8 },
  "totals": { "calories": 1240, "protein": 27, "carbs": 220, "fat": 2.4, "fiber": 12, "waterMl": 1500, "steps": 8432, "sleepHours": 7.5 },
  "remaining": { "calories": 760, "protein": 93, "carbs": 30, "fat": 62.6, "fiber": 18, "waterMl": 1500, "steps": 1568 },
  "progress": { "calories": 0.62, "protein": 0.23, "carbs": 0.88, "fat": 0.04, "fiber": 0.4, "water": 0.5, "steps": 0.84, "sleep": 0.94 },
  "workouts": [ { "id": "...", "exercise": "Calf raise", "weightKg": 40, "reps": 8, "sets": 3, "date": "2026-06-26", "createdAt": "..." } ]
}
```
- `progress` values are clamped to `0..1` (a value over goal still shows as `1.0` for the bar; show the raw number alongside in the UI).
- `remaining` clamps at `0` (never negative).

---

## Quick endpoint index

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/health` | `{status}` |
| GET | `/api/profile` | `Profile` |
| PUT | `/api/profile` | `Profile` |
| GET | `/api/food?date=` | `FoodEntry[]` |
| POST | `/api/food` | `FoodEntry` |
| DELETE | `/api/food/:id` | — |
| GET | `/api/meals` | `Meal[]` |
| POST | `/api/meals` | `Meal` |
| PUT | `/api/meals/:id` | `Meal` |
| DELETE | `/api/meals/:id` | — |
| POST | `/api/meals/:id/log` | `{entries}` |
| GET | `/api/water?date=` | `{logs,totalMl}` |
| POST | `/api/water` | `WaterLog` |
| DELETE | `/api/water/:id` | — |
| GET | `/api/workouts?date=` | `Workout[]` |
| POST | `/api/workouts` | `Workout` |
| DELETE | `/api/workouts/:id` | — |
| GET | `/api/steps?date=` | `StepsEntry` |
| PUT | `/api/steps/:date` | `StepsEntry` |
| GET | `/api/sleep?date=` | `SleepEntry` |
| PUT | `/api/sleep/:date` | `SleepEntry` |
| GET | `/api/dashboard?date=` | dashboard object |
