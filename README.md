# Tech Founder Spec Hub

A self-hosted client portal for tech founders. Each project gets one dashboard with:

1. **Live Prototype & Specs**: an embedded Figma prototype plus links to the repo and staging.
2. **Design Tokens**: colour, typography and SVG icon tokens, each copyable in one click.
3. **Feature Backlog**: prioritised spec requests, with a dialog clients use to file new ones.

Built with Next.js 15, Tailwind CSS v4, shadcn/ui and Supabase (Auth + Postgres with row-level security).

## Quick start

```bash
npm install
npm run dev   # demo mode with sample data, no Supabase needed
```

Open http://localhost:3000 and click **Open dashboard**.

### Connect Supabase (local)

```bash
cp .env.example .env.local
npx supabase start        # requires Docker; applies migrations + seed
npx supabase status       # copy "API URL" and "anon key" into .env.local
npm run dev
```

Sign in at `/login` (magic links are captured by the local Mailpit inbox at http://127.0.0.1:54324). Then add yourself to the seeded org in Studio (http://127.0.0.1:54323) using the SQL snippet in `CLAUDE.md`.

### Connect Supabase (hosted)

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push                 # add --include-seed to load the demo data
```

Put the project URL and anon key in `.env.local`. Under **Auth → URL Configuration**, add `https://<your-domain>/auth/confirm` (and `http://localhost:3000/auth/confirm`) to the redirect URLs.

See [`CLAUDE.md`](./CLAUDE.md) for the folder structure, data model and conventions.
