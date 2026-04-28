# Rookie's Coder

A manuscript-themed coding education platform for beginners. Structured learning paths, a live community forum, coding contests, and progress tracking — all backed by Supabase.

## Tech Stack

- **Frontend** — React 19, TypeScript, Vite 6
- **Styling** — Tailwind CSS v4, IBM Plex Mono / Playfair Display
- **Animation** — Motion (Framer Motion v12)
- **Charts** — Recharts
- **Backend** — Supabase (Auth, PostgreSQL, RLS)
- **Notifications** — Sonner

## Features

- Email/password + GitHub OAuth authentication
- Role-based access (student / admin)
- Structured learning path with 6 modules and 11 lessons
- Interactive code editor with exercise runner
- Community forum with likes, filters, and real-time thread creation
- Coding contests with live countdown timers and registration
- Progress tracking with XP, streaks, skill radar, and activity heatmap
- Admin dashboard with platform metrics and incident management

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/rookies-coder.git
cd rookies-coder
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your Supabase project URL and publishable key from the Supabase dashboard.

### 3. Set up the database

Run `docs/SUPABASE_SCHEMA.sql` in the Supabase SQL Editor to create all tables, enums, triggers, and RLS policies.

Then run `docs/SUPABASE_SEED.sql` to populate the initial modules, lessons, and contests.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role  | Email                          | Password   |
|-------|--------------------------------|------------|
| Admin | yashkalkhambkar@gmail.com      | yash@123   |
| User  | yash@rookiescoder.demo         | Demo@1234  |
| User  | vanshika@rookiescoder.demo     | Demo@1234  |
| User  | rohan@rookiescoder.demo        | Demo@1234  |
| User  | priya@rookiescoder.demo        | Demo@1234  |
| User  | aarav@rookiescoder.demo        | Demo@1234  |

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Sidebar + top nav
│   └── ProtectedRoute.tsx  # Auth guard
├── contexts/
│   └── AuthContext.tsx     # Session + profile state
├── lib/
│   └── supabase.ts         # Supabase client
└── pages/
    ├── Landing.tsx
    ├── Login.tsx           # Login + signup tabs
    ├── Dashboard.tsx
    ├── LearningPath.tsx
    ├── Lesson.tsx
    ├── Community.tsx
    ├── Progress.tsx
    ├── Contests.tsx
    └── Admin.tsx

docs/
├── SUPABASE_SCHEMA.sql     # Full DB schema
├── SUPABASE_SEED.sql       # Initial data
├── PROJECT_OVERVIEW.md
├── BACKEND_REQUIREMENTS.md
└── INTEGRATION_ROADMAP.md

scripts/
├── seed_sections.cjs       # Lesson content seeder
├── seed_activity.cjs       # Activity/progress seeder
├── seed_media_sections.cjs # Video/audio section seeder
└── fix_rls_and_admin.cjs   # RLS policies + admin setup
```

## Database Schema

17 tables covering: profiles, modules, lessons, lesson_sections, user_lesson_progress, daily_activity, milestones, certifications, threads, thread_replies, thread_likes, contests, contest_problems, contest_registrations, contest_submissions, notifications, incidents.

Full schema in `docs/SUPABASE_SCHEMA.sql`.
