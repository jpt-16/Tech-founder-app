# Tech Founder Spec Hub

Client portal where tech founders view a project's live Figma prototype, design tokens and feature backlog, and submit new feature/spec requests.

**Stack:** Next.js 15 (App Router, React 19, TypeScript) · Tailwind CSS v4 · shadcn/ui (new-york, Radix) · Supabase (Postgres + Auth + RLS) via `@supabase/ssr`.

**UI source of truth:** the Claude Design canvas at https://claude.ai/artifact/R54GA84nbkufhs7Em68v7P (one artboard per dashboard tab, plus the request dialog). Match its tokens when changing the UI.

## Commands

```bash
npm install          # install deps
npm run dev          # dev server → http://localhost:3000
npm run build        # production build (also type-checks)
npm run lint         # ESLint
npx tsc --noEmit     # type-check only
```

Supabase (CLI runs through npx; local stack needs Docker):

```bash
npx supabase start                    # local Postgres/Auth/Studio; applies migrations + seed.sql
npx supabase status                   # prints local API URL + anon key for .env.local
npx supabase db reset                 # re-apply all migrations + seed locally
npx supabase migration new <name>     # new file in supabase/migrations/

npx supabase login
npx supabase link --project-ref <ref> # hosted project
npx supabase db push                  # apply migrations to the hosted project
npx supabase gen types typescript --linked > src/types/database.ts   # after schema changes
```

## Environment variables

Copy `.env.example` → `.env.local`.

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Project URL (Settings → API, or `supabase status`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | anon/publishable key. Safe for the browser; RLS enforces access |
| `NEXT_PUBLIC_SITE_URL` | no | Absolute origin for magic-link redirects; defaults to the request origin |

If the two Supabase vars are unset, the app runs in **demo mode**: middleware skips auth and `/dashboard/00000000-0000-4000-8000-000000000101` renders `src/lib/demo-data.ts`. Submitting a request in demo mode returns an error.

## Folder structure

```
src/
  app/
    layout.tsx                    fonts (Bricolage Grotesque / IBM Plex Sans / JetBrains Mono), ThemeProvider, Toaster
    globals.css                   theme tokens (light + .dark), Tailwind v4 @theme, `eyebrow` utility
    page.tsx                      landing page
    login/                        magic-link sign-in (page, form, server actions incl. signOut)
    auth/confirm/route.ts         magic-link callback (PKCE `code` or `token_hash`)
    dashboard/page.tsx            project list for the signed-in user
    dashboard/[projectId]/
      page.tsx                    the 3-tab dashboard (server component)
      actions.ts                  submitFeatureRequest server action
      loading.tsx, not-found.tsx
  components/
    ui/                           shadcn primitives: button card dialog input textarea badge tabs table label sonner
    dashboard/                    dashboard-tabs, prototype-tab, tokens-tab, backlog-tab,
                                  feature-request-dialog, copy-button, status (badges), site-header
    theme-provider.tsx, theme-toggle.tsx
  lib/
    supabase/{client,server,middleware,env}.ts   @supabase/ssr helpers
    data.ts                       server-only data access (getProjects, getProjectDashboard); demo fallback
    demo-data.ts                  sample data (same IDs as supabase/seed.sql)
    figma.ts                      Figma URL → safe embed URL (figma.com hosts only)
    tokens.ts                     typography parsing, SVG-as-CSS-mask rendering
    color.ts                      org brand colour → --primary/--primary-foreground
    dashboard-tabs.ts, safe-next.ts, utils.ts
  types/database.ts               Supabase-generated DB types (regenerate, don't hand-edit)
  types/models.ts                 app aliases: Project, DesignToken, FeatureRequest, …
  middleware.ts                   session refresh + /dashboard auth gate
supabase/
  config.toml                     local stack config (auth redirect URLs include /auth/confirm)
  migrations/                     SQL schema + RLS
  seed.sql                        demo org/project/tokens/backlog
```

## Data model & access

Tables: `organisations`, `organisation_members` (org_id, user_id, role `owner|client`), `projects`, `design_tokens`, `feature_backlog`. All have RLS enabled.

- Visibility is by membership in `organisation_members` (helpers `is_org_member`, `is_org_owner`, `project_org_id` are `security definer`, `search_path = ''`).
- **owner**: full write access to org, members, projects, tokens; triages the backlog.
- **client**: read-only on projects and tokens; can insert `feature_backlog` rows only with `status = 'backlog'` and `created_by = auth.uid()`.
- New orgs are created with `rpc('create_organisation', …)`, which also makes the caller the owner.
- To grant yourself access to seeded data after first sign-in:
  ```sql
  insert into organisation_members (org_id, user_id, role)
  select '00000000-0000-4000-8000-000000000001', id, 'owner' from auth.users where email = 'you@example.com';
  ```

## Conventions

- Server Components fetch via `src/lib/data.ts`; mutations are Server Actions that call `revalidatePath`.
- Always create the Supabase server client per request (`await createClient()` from `@/lib/supabase/server`); in middleware nothing may run between `createServerClient` and `auth.getUser()`.
- Never inject stored markup: SVG icon tokens render as CSS masks (`svgMaskStyle`), Figma URLs go through `toFigmaEmbedUrl`, and typography values are whitelisted in `parseTypography`.
- Colours come from theme tokens (`bg-primary`, `text-muted-foreground`, …), never raw hex in components. The org's `primary_color` re-skins `--primary` through `brandStyle()`.
- Priority badges differ by fill and lightness (High solid, Medium outline, Low muted), not by hue alone. Keep touch targets ≥ 44px (`h-11`).
- shadcn components were vendored from the shadcn GitHub registry source (`apps/v4/registry/new-york-v4/ui`). `npx shadcn add <name>` works where ui.shadcn.com is reachable.
- Schema changes: add a new migration (never edit an applied one), then regenerate `src/types/database.ts`.
