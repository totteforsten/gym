# 🏋️ Atlas — Modern Gym & Rehab Tracker

A sleek, 2026-modern gym app for **finding video-guided exercises, building programs, and tracking your recovery** — purpose-built for hip rehabilitation, but great for general strength and mobility too.

Dark-mode first, fully responsive, backed by a real Postgres database, and ready to deploy to Vercel in a couple of clicks.

![Dark mode dashboard](https://img.shields.io/badge/theme-dark%20mode-8b5cf6) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Postgres](https://img.shields.io/badge/database-Postgres-336791)

---

## ✨ Features

- **Exercise library** with a video demonstration + step-by-step coaching cues for every move. Live search & filtering by category, difficulty, body part.
- **Prebuilt hip-rehab programs** — a physio-inspired *Hip Rehab Foundations* plan, a *Hip Strength Progression*, and a *Daily Mobility Flow*, seeded automatically.
- **Build your own** — create custom exercises (paste any YouTube link) and assemble your own programs.
- **Per-exercise progress tracking** — log sets, reps, weight, **pain level (0–10)** and effort (RPE). See volume and pain trends chart out over time.
- **Dashboard** — weekly goal ring, streak, training-volume chart, pain-recovery trend, effort split and recent activity.
- **Profile** — set your goals & weekly target, view lifetime stats and unlock achievements.

## 🧱 Tech stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 15 (App Router, Server Actions, RSC)       |
| Language   | TypeScript                                         |
| Styling    | Tailwind CSS v4 + a custom dark design system      |
| Database   | Postgres via **Prisma ORM**                        |
| Charts     | Recharts                                           |
| UI motion  | Framer Motion + lucide-react icons                 |

The database **seeds itself** on first load, so the app is never empty — no manual seed step required in production.

---

## 🚀 Deploy to Vercel (recommended)

### 1. Create a Postgres database

Pick any Postgres provider — all work out of the box:

- **[Neon](https://neon.tech)** (free tier, recommended) — create a project and copy the connection string.
- **Vercel Postgres** — add it from your project's **Storage** tab.
- Supabase / Railway / any Postgres.

> Use a **direct (non-pooled)** connection string so the schema can be created on deploy.

### 2. Deploy

1. Push this repo to GitHub and **import it into Vercel** (it auto-detects Next.js).
2. Add one environment variable:

   | Key            | Value                                             |
   | -------------- | ------------------------------------------------- |
   | `DATABASE_URL` | your Postgres connection string                   |

3. Click **Deploy**.

That's it. The build command (`prisma generate && prisma db push && next build`, configured in `vercel.json`) creates the tables automatically, and the app seeds the exercise library + programs on first request.

---

## 💻 Run locally

```bash
# 1. Install dependencies
npm install

# 2. Configure your database
cp .env.example .env
#   → edit .env and set DATABASE_URL to your Postgres URL

# 3. Create the tables
npm run db:push

# 4. (optional) seed now instead of on first request
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the dev server                     |
| `npm run build`   | Production build (`prisma generate` + `next build`) |
| `npm run start`   | Start the production server              |
| `npm run db:push` | Sync the Prisma schema to your database  |
| `npm run db:seed` | Seed exercises + programs                |

---

## 🗂️ Project structure

```
prisma/
  schema.prisma        # Exercise, Program, ProgramExercise, WorkoutLog, Profile
  seed.ts              # CLI seed entrypoint
src/
  app/                 # App Router pages (dashboard, library, programs, progress, profile)
  components/          # UI: Shell, charts, cards, forms, video player
  data/                # Curated hip-rehab exercises & prebuilt programs
  lib/
    prisma.ts          # Prisma client singleton
    seed.ts            # Idempotent self-seeding
    queries.ts         # Read/analytics layer
    actions.ts         # Server Actions (log, create exercise/program, profile…)
```

---

## 🩺 A note on the exercises

The seeded exercises are a curated hip-rehabilitation set (clamshells, glute bridges, clam progressions, hip airplanes, mobility flows and more) with YouTube demonstration videos. They are for general fitness and education — **not medical advice.** If you're recovering from an injury, check with a physiotherapist before starting.
