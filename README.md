# ZOOCO Backend

Node.js + Express + Prisma API for the ZOOCO Daily Reminders App.

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Server runs at `http://localhost:4000`.

> Note: `npx prisma migrate dev` downloads Prisma's query engine binaries the
> first time you run it — this requires normal internet access (it was blocked
> in the sandboxed environment these files were generated in, but will work
> fine on your machine).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start server with nodemon (auto-restart on changes) |
| `npm start` | Start server (production) |
| `npm run prisma:migrate` | Run/create a new migration |
| `npm run prisma:studio` | Open Prisma Studio (visual DB browser) |
| `npm run prisma:seed` | Seed sample pets + reminders |

## API Reference

### Health
- `GET /api/health` → `{ status: "ok", timestamp }`

### Pets
- `GET /api/pets` → list all pets
- `POST /api/pets` → `{ name, avatarUrl? }`
- `DELETE /api/pets/:id`

### Reminders
- `GET /api/reminders?petId=&category=&date=` → filterable list, includes `pet` relation
- `GET /api/reminders/:id` → single reminder
- `POST /api/reminders` → create
  ```json
  {
    "petId": "clxxxx",
    "category": "General",
    "title": "Morning Walk",
    "notes": "optional",
    "startDate": "2026-07-25",
    "startTime": "2:00 pm",
    "frequency": "Everyday"
  }
  ```
- `PUT /api/reminders/:id` → update (partial fields allowed)
- `DELETE /api/reminders/:id` → delete permanently
- `PATCH /api/reminders/:id/complete` → `{ "isCompleted": true }` — toggles status, logs a completion for streak tracking
- `GET /api/reminders/:id/streak` → `{ reminderId, streak }` — consecutive completed days

### Validation

`POST`/`PUT` on reminders validate:
- `petId`, `title`, `startDate`, `startTime`, `frequency` required (on create)
- `title` max 100 characters
- `category` must be one of `General`, `Lifestyle`, `Health`
- `startDate` must parse as a valid date

Validation errors return `400` with:
```json
{ "error": "Validation failed", "fields": { "title": "Reminder title is required" } }
```

## Deploying

1. Switch `datasource db` provider in `prisma/schema.prisma` from `sqlite` to `postgresql`
2. Set `DATABASE_URL` to your hosted Postgres connection string (Render/Railway/Neon)
3. Run `npx prisma migrate deploy` against the production DB
4. Update `FRONTEND_URL` env var to your deployed frontend's origin (for CORS)
# zooco-backend
