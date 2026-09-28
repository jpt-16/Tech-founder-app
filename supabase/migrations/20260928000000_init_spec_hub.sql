-- =============================================================================
-- Tech Founder Spec Hub — initial schema
--
-- Tables: organisations, organisation_members, projects, design_tokens,
--         feature_backlog
--
-- Access model (enforced with RLS):
--   * A user sees an organisation's data only if they are a row in
--     organisation_members for that organisation.
--   * role = 'owner'  → the founder / studio running the portal. Full write
--                        access to the organisation, its projects and tokens,
--                        and can triage the backlog.
--   * role = 'client' → read-only on projects and tokens; may submit new
--                        feature requests (status is forced to 'backlog').
-- =============================================================================

create extension if not exists "pgcrypto" with schema extensions;

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
create type public.member_role as enum ('owner', 'client');
create type public.project_status as enum ('planning', 'in_progress', 'review', 'live', 'paused');
create type public.token_category as enum ('colors', 'typography', 'icons');
create type public.feature_priority as enum ('low', 'medium', 'high');
create type public.feature_status as enum ('backlog', 'in_progress', 'completed');

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
create table public.organisations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 1 and 120),
  created_at    timestamptz not null default now(),
  primary_color text not null default '#FF5F1F'
                check (primary_color ~* '^#([0-9a-f]{3}|[0-9a-f]{6})$'),
  logo_url      text check (logo_url is null or logo_url ~* '^https://')
);

-- Join table that powers every RLS policy below.
create table public.organisation_members (
  org_id     uuid not null references public.organisations (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       public.member_role not null default 'client',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organisations (id) on delete cascade,
  name            text not null check (char_length(name) between 1 and 120),
  description     text,
  figma_embed_url text check (figma_embed_url is null or figma_embed_url ~* '^https://([a-z0-9-]+\.)?figma\.com/'),
  repository_url  text check (repository_url is null or repository_url ~* '^https://'),
  staging_url     text check (staging_url is null or staging_url ~* '^https://'),
  status          public.project_status not null default 'planning',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.design_tokens (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.projects (id) on delete cascade,
  token_category public.token_category not null,
  key            text not null check (char_length(key) between 1 and 80),
  value          text not null check (char_length(value) <= 20000),
  description    text,
  created_at     timestamptz not null default now(),
  unique (project_id, token_category, key)
);

create table public.feature_backlog (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  title        text not null check (char_length(title) between 3 and 140),
  description  text check (description is null or char_length(description) <= 4000),
  priority     public.feature_priority not null default 'medium',
  status       public.feature_status not null default 'backlog',
  -- Display name / email of the requester, shown in the backlog table.
  requested_by text not null check (char_length(requested_by) between 1 and 200),
  -- Auth user that created the row (used by RLS).
  created_by   uuid references auth.users (id) on delete set null default auth.uid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Indexes (every foreign key used by RLS lookups)
-- -----------------------------------------------------------------------------
create index organisation_members_user_id_idx on public.organisation_members (user_id);
create index projects_org_id_idx on public.projects (org_id);
create index design_tokens_project_id_idx on public.design_tokens (project_id, token_category);
create index feature_backlog_project_id_idx on public.feature_backlog (project_id, status);
create index feature_backlog_created_by_idx on public.feature_backlog (created_by);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger feature_backlog_set_updated_at
  before update on public.feature_backlog
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS helper functions
-- SECURITY DEFINER so policies can read organisation_members without
-- recursing into its own RLS policy. search_path is pinned to ''.
-- -----------------------------------------------------------------------------
create or replace function public.is_org_member(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organisation_members m
    where m.org_id = p_org_id
      and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.is_org_owner(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organisation_members m
    where m.org_id = p_org_id
      and m.user_id = (select auth.uid())
      and m.role = 'owner'
  );
$$;

create or replace function public.project_org_id(p_project_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.org_id from public.projects p where p.id = p_project_id;
$$;

revoke all on function public.is_org_member(uuid) from public, anon;
revoke all on function public.is_org_owner(uuid) from public, anon;
revoke all on function public.project_org_id(uuid) from public, anon;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_owner(uuid) to authenticated;
grant execute on function public.project_org_id(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.organisations        enable row level security;
alter table public.organisation_members enable row level security;
alter table public.projects             enable row level security;
alter table public.design_tokens        enable row level security;
alter table public.feature_backlog      enable row level security;

-- organisations ---------------------------------------------------------------
create policy "Members can view their organisations"
  on public.organisations for select to authenticated
  using ((select public.is_org_member(id)));

create policy "Owners can update their organisations"
  on public.organisations for update to authenticated
  using ((select public.is_org_owner(id)))
  with check ((select public.is_org_owner(id)));

create policy "Owners can delete their organisations"
  on public.organisations for delete to authenticated
  using ((select public.is_org_owner(id)));

-- Creating an organisation goes through public.create_organisation() below so
-- the creator is atomically added as its owner.

-- organisation_members ------------------------------------------------------------
create policy "Members can view fellow members"
  on public.organisation_members for select to authenticated
  using ((select public.is_org_member(org_id)));

create policy "Owners can add members"
  on public.organisation_members for insert to authenticated
  with check ((select public.is_org_owner(org_id)));

create policy "Owners can change member roles"
  on public.organisation_members for update to authenticated
  using ((select public.is_org_owner(org_id)))
  with check ((select public.is_org_owner(org_id)));

create policy "Owners can remove members"
  on public.organisation_members for delete to authenticated
  using ((select public.is_org_owner(org_id)));

-- projects -------------------------------------------------------------------------
create policy "Members can view projects"
  on public.projects for select to authenticated
  using ((select public.is_org_member(org_id)));

create policy "Owners can create projects"
  on public.projects for insert to authenticated
  with check ((select public.is_org_owner(org_id)));

create policy "Owners can update projects"
  on public.projects for update to authenticated
  using ((select public.is_org_owner(org_id)))
  with check ((select public.is_org_owner(org_id)));

create policy "Owners can delete projects"
  on public.projects for delete to authenticated
  using ((select public.is_org_owner(org_id)));

-- design_tokens --------------------------------------------------------------------
create policy "Members can view design tokens"
  on public.design_tokens for select to authenticated
  using ((select public.is_org_member(public.project_org_id(project_id))));

create policy "Owners can create design tokens"
  on public.design_tokens for insert to authenticated
  with check ((select public.is_org_owner(public.project_org_id(project_id))));

create policy "Owners can update design tokens"
  on public.design_tokens for update to authenticated
  using ((select public.is_org_owner(public.project_org_id(project_id))))
  with check ((select public.is_org_owner(public.project_org_id(project_id))));

create policy "Owners can delete design tokens"
  on public.design_tokens for delete to authenticated
  using ((select public.is_org_owner(public.project_org_id(project_id))));

-- feature_backlog ------------------------------------------------------------------
create policy "Members can view the backlog"
  on public.feature_backlog for select to authenticated
  using ((select public.is_org_member(public.project_org_id(project_id))));

-- Clients (and owners) can file requests; new requests always land in 'backlog'
-- and are attributed to the signed-in user.
create policy "Members can submit feature requests"
  on public.feature_backlog for insert to authenticated
  with check (
    (select public.is_org_member(public.project_org_id(project_id)))
    and created_by = (select auth.uid())
    and status = 'backlog'
  );

create policy "Owners can triage the backlog"
  on public.feature_backlog for update to authenticated
  using ((select public.is_org_owner(public.project_org_id(project_id))))
  with check ((select public.is_org_owner(public.project_org_id(project_id))));

create policy "Owners can delete backlog items"
  on public.feature_backlog for delete to authenticated
  using ((select public.is_org_owner(public.project_org_id(project_id))));

-- -----------------------------------------------------------------------------
-- create_organisation(): create an org and make the caller its owner.
-- -----------------------------------------------------------------------------
create or replace function public.create_organisation(
  p_name text,
  p_primary_color text default '#FF5F1F',
  p_logo_url text default null
)
returns public.organisations
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org public.organisations;
begin
  if (select auth.uid()) is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.organisations (name, primary_color, logo_url)
  values (p_name, p_primary_color, p_logo_url)
  returning * into v_org;

  insert into public.organisation_members (org_id, user_id, role)
  values (v_org.id, (select auth.uid()), 'owner');

  return v_org;
end;
$$;

revoke all on function public.create_organisation(text, text, text) from public, anon;
grant execute on function public.create_organisation(text, text, text) to authenticated;
