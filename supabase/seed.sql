-- Demo data for local development (`npx supabase db reset` runs this after migrations).
-- Same IDs as src/lib/demo-data.ts.
--
-- RLS hides everything until you are a member. After signing in once, run:
--   insert into public.organisation_members (org_id, user_id, role)
--   select '00000000-0000-4000-8000-000000000001', id, 'owner'
--   from auth.users where email = 'you@example.com';

insert into public.organisations (id, name, primary_color, logo_url) values
  ('00000000-0000-4000-8000-000000000001', 'Acme Labs', '#FF5F1F', null);

insert into public.projects (id, org_id, name, description, figma_embed_url, repository_url, staging_url, status) values
  ('00000000-0000-4000-8000-000000000101',
   '00000000-0000-4000-8000-000000000001',
   'Orbit Mobile App',
   'Trip-planning app for small teams. Phase 1 covers onboarding, saved trips and shared itineraries.',
   null,
   'https://github.com/acme/orbit',
   'https://staging.orbit.example.com',
   'in_progress');

insert into public.design_tokens (project_id, token_category, key, value, description) values
  ('00000000-0000-4000-8000-000000000101', 'colors', 'brand-primary', '#FF5F1F', 'Primary actions, focus rings'),
  ('00000000-0000-4000-8000-000000000101', 'colors', 'surface-0', '#0A0A0B', 'App background (dark)'),
  ('00000000-0000-4000-8000-000000000101', 'colors', 'surface-1', '#121214', 'Cards and sheets'),
  ('00000000-0000-4000-8000-000000000101', 'colors', 'border', '#2A2A2F', 'Hairlines and dividers'),
  ('00000000-0000-4000-8000-000000000101', 'colors', 'text-primary', '#F4F3EE', 'Body and headings'),
  ('00000000-0000-4000-8000-000000000101', 'colors', 'text-muted', '#A3A3AB', 'Secondary copy, captions'),
  ('00000000-0000-4000-8000-000000000101', 'typography', 'display',
   'font-family: Bricolage Grotesque; font-size: 36px; line-height: 40px; font-weight: 700; letter-spacing: -0.02em', 'Screen titles'),
  ('00000000-0000-4000-8000-000000000101', 'typography', 'heading',
   'font-family: Bricolage Grotesque; font-size: 24px; line-height: 32px; font-weight: 600', 'Section headings'),
  ('00000000-0000-4000-8000-000000000101', 'typography', 'body',
   'font-family: IBM Plex Sans; font-size: 16px; line-height: 24px; font-weight: 400', 'Paragraphs'),
  ('00000000-0000-4000-8000-000000000101', 'typography', 'caption',
   'font-family: JetBrains Mono; font-size: 12px; line-height: 16px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase', 'Labels and eyebrows'),
  ('00000000-0000-4000-8000-000000000101', 'icons', 'icon-home',
   '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5V21H3z"/></svg>', null),
  ('00000000-0000-4000-8000-000000000101', 'icons', 'icon-search',
   '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>', null),
  ('00000000-0000-4000-8000-000000000101', 'icons', 'icon-bell',
   '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>', null),
  ('00000000-0000-4000-8000-000000000101', 'icons', 'icon-map-pin',
   '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>', null);

insert into public.feature_backlog (project_id, title, description, priority, status, requested_by, created_by) values
  ('00000000-0000-4000-8000-000000000101', 'Apple sign-in on onboarding', 'Add Sign in with Apple next to the email magic link.', 'high', 'in_progress', 'founder@acmelabs.dev', null),
  ('00000000-0000-4000-8000-000000000101', 'Offline mode for saved trips', 'Cache the last five trips so they open without signal.', 'high', 'backlog', 'founder@acmelabs.dev', null),
  ('00000000-0000-4000-8000-000000000101', 'Dark theme parity', 'Check every screen against the dark token set.', 'medium', 'backlog', 'pm@acmelabs.dev', null),
  ('00000000-0000-4000-8000-000000000101', 'Share itinerary as link', 'Read-only public link for a single itinerary.', 'medium', 'in_progress', 'pm@acmelabs.dev', null),
  ('00000000-0000-4000-8000-000000000101', 'Empty-state illustrations', 'Replace placeholder art on list screens.', 'low', 'completed', 'pm@acmelabs.dev', null);
