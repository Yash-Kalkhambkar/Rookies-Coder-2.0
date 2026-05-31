# Rookie's Coder

A coding education platform I built for beginners. Think of it as a manuscript-themed learning experience where you can work through lessons, compete in contests, and hang out with other learners.

## What's inside

This is basically a full-stack learning platform with:
- Interactive coding lessons with a built-in code runner
- Community forum where you can ask questions and share stuff
- Coding contests (because who doesn't like a little competition?)
- Progress tracking with XP, streaks, and all that gamification goodness
- Admin panel for managing content and users

The whole thing has this cool manuscript/editorial vibe going on - I wanted it to feel like you're reading a well-crafted textbook rather than just another coding tutorial site.

## Tech I used

**Frontend:**
- React 19 + TypeScript
- Vite for bundling
- Tailwind CSS v4 (the new one!)
- Framer Motion for animations
- Recharts for the progress charts
- React Router v7

**Backend:**
- Supabase (handles auth, database, realtime stuff)
- PostgreSQL with RLS policies
- Edge Functions for code execution

**Fonts:**
- IBM Plex Mono for code
- Playfair Display for headings (gives it that manuscript feel)

## Getting started

1. Clone this thing:
```bash
git clone https://github.com/your-username/rookies-coder.git
cd rookies-coder
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```
Then add your Supabase credentials to `.env`

4. Database setup:
- Head to your Supabase project dashboard
- Go to the SQL editor
- Run `docs/SUPABASE_SCHEMA.sql` first (creates all the tables)
- Then run `docs/SUPABASE_SEED.sql` (adds some initial data)

5. Fire it up:
```bash
npm run dev
```

Should be running on `http://localhost:3000`

## Demo accounts

You can use these to test things out:

**Admin:**
- Email: yashkalkhambkar@gmail.com
- Password: yash@123

**Regular users:**
- yash@rookiescoder.demo / Demo@1234
- vanshika@rookiescoder.demo / Demo@1234
- rohan@rookiescoder.demo / Demo@1234

(there's a few more in the seed file)

## How it's organized

```
src/
├── components/       # Shared components (Layout, ProtectedRoute)
├── contexts/         # Auth context
├── lib/             # Supabase client setup
└── pages/           # All the main pages
    ├── Landing.tsx
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── LearningPath.tsx
    ├── Lesson.tsx
    ├── Community.tsx
    ├── Progress.tsx
    ├── Contests.tsx
    └── Admin.tsx

docs/                # Database schemas and project docs
scripts/             # Seed scripts for populating data
```

## Features breakdown

**Learning Path**
- Modules organized in a timeline view
- Each lesson has text, code examples, videos, and interactive exercises
- Code editor with real execution (supports JS, Python, Rust)
- XP rewards and progress tracking

**Community**
- Create threads, reply to discussions
- Like posts, mark solutions
- Tag system with AI-powered suggestions
- Real-time updates

**Contests**
- Timed coding challenges
- Live leaderboard
- Submission tracking with verdicts
- Registration system

**Progress**
- Activity heatmap (GitHub-style)
- Skill radar chart
- XP and streak tracking
- Certifications when you complete modules

**Admin Panel**
- User management
- Content creation/editing
- Platform analytics
- Incident tracking

## Database

The schema is pretty straightforward - profiles, modules, lessons, progress tracking, community stuff (threads/replies/likes), contests, and notifications. Everything's protected with RLS policies so users can only see/edit what they should.

Check `docs/SUPABASE_SCHEMA.sql` if you want the full details.

## Scripts

There's a few helper scripts in the `scripts/` folder:
- `seed_sections.cjs` - Adds lesson content
- `seed_activity.cjs` - Generates fake activity data
- `seed_media_sections.cjs` - Adds video/audio sections
- `fix_rls_and_admin.cjs` - Fixes RLS policies and admin access

Run them with node if you need to populate more data.

## Notes

- The code execution uses Piston API through a Supabase Edge Function
- AI hints are powered by Google Gemini (you'll need an API key)
- Notifications update in real-time thanks to Supabase subscriptions
- The manuscript theme uses custom shadows and serif fonts

## TODO

- [ ] Add more languages to the code runner
- [ ] Mobile responsive improvements
- [ ] Dark mode (maybe?)
- [ ] More contest problems
- [ ] Email notifications

---

Built this as a learning project. Feel free to use it, fork it, whatever. If you find bugs or have suggestions, open an issue!