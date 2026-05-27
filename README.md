# Rookie's Coder

Rookie's Coder is a beginner-friendly coding learning app. It has lessons, a community space, contests, and progress tracking. The app uses Supabase for login and data storage.

## Tech stack

- Frontend: React 19, TypeScript, Vite 6
- Styling: Tailwind CSS v4
- Animations: Framer Motion
- Charts: Recharts
- Backend: Supabase (Auth, PostgreSQL, RLS)
- Notifications: Sonner

## What it includes

- Login using email/password or GitHub
- Student and admin access
- Learning path with modules and lessons
- Code editor for exercises
- Community forum with threads and likes
- Contests with registration and timers
- Progress tracking for activity and skills
- Admin dashboard for platform data

## Run the app

1. Clone the repo:

```bash
git clone https://github.com/your-username/rookies-coder.git
cd rookies-coder
npm install
```

2. Copy the example env file:

```bash
cp .env.example .env
```

3. Add your Supabase URL and publishable key to `.env`.

4. Set up the database:

- Run `docs/SUPABASE_SCHEMA.sql` in the Supabase SQL editor.
- Run `docs/SUPABASE_SEED.sql` to add initial data.

5. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo accounts

| Role  | Email                          | Password   |
|-------|--------------------------------|------------|
| Admin | yashkalkhambkar@gmail.com      | yash@123   |
| User  | yash@rookiescoder.demo         | Demo@1234  |
| User  | vanshika@rookiescoder.demo     | Demo@1234  |
| User  | rohan@rookiescoder.demo        | Demo@1234  |
| User  | priya@rookiescoder.demo        | Demo@1234  |
| User  | aarav@rookiescoder.demo        | Demo@1234  |

## Project structure

```
src/
├── components/
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── supabase.ts
└── pages/
    ├── Landing.tsx
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── LearningPath.tsx
    ├── Lesson.tsx
    ├── Community.tsx
    ├── Progress.tsx
    ├── Contests.tsx
    └── Admin.tsx
```

docs/
├── SUPABASE_SCHEMA.sql
├── SUPABASE_SEED.sql
├── PROJECT_OVERVIEW.md
├── BACKEND_REQUIREMENTS.md
└── INTEGRATION_ROADMAP.md

scripts/
├── seed_sections.cjs
├── seed_activity.cjs
├── seed_media_sections.cjs
└── fix_rls_and_admin.cjs
```

## Database overview

The database includes tables for profiles, modules, lessons, lesson sections, progress, activity, contests, threads, replies, likes, notifications, and incidents.

See `docs/SUPABASE_SCHEMA.sql` for the full schema.
