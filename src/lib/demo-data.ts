import type { DesignToken, FeatureRequest, Organisation, Project } from "@/types/models"

// Sample data shown when Supabase env vars are not set (demo mode).
// Keep in sync with supabase/seed.sql, which uses the same IDs.

export const DEMO_ORG_ID = "00000000-0000-4000-8000-000000000001"
export const DEMO_PROJECT_ID = "00000000-0000-4000-8000-000000000101"

const now = "2026-09-28T00:00:00.000Z"

export const demoOrganisation: Organisation = {
  id: DEMO_ORG_ID,
  name: "Acme Labs",
  created_at: now,
  primary_color: "#FF5F1F",
  logo_url: null,
}

export const demoProject: Project = {
  id: DEMO_PROJECT_ID,
  org_id: DEMO_ORG_ID,
  name: "Orbit Mobile App",
  description:
    "Trip-planning app for small teams. Phase 1 covers onboarding, saved trips and shared itineraries.",
  figma_embed_url: null,
  repository_url: "https://github.com/acme/orbit",
  staging_url: "https://staging.orbit.example.com",
  status: "in_progress",
  created_at: now,
  updated_at: now,
}

const icon = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`

const token = (
  id: number,
  token_category: DesignToken["token_category"],
  key: string,
  value: string,
  description: string | null = null,
): DesignToken => ({
  id: `00000000-0000-4000-8000-${String(1000 + id).padStart(12, "0")}`,
  project_id: DEMO_PROJECT_ID,
  token_category,
  key,
  value,
  description,
  created_at: now,
})

export const demoTokens: DesignToken[] = [
  token(1, "colors", "brand-primary", "#FF5F1F", "Primary actions, focus rings"),
  token(2, "colors", "surface-0", "#0A0A0B", "App background (dark)"),
  token(3, "colors", "surface-1", "#121214", "Cards and sheets"),
  token(4, "colors", "border", "#2A2A2F", "Hairlines and dividers"),
  token(5, "colors", "text-primary", "#F4F3EE", "Body and headings"),
  token(6, "colors", "text-muted", "#A3A3AB", "Secondary copy, captions"),
  token(
    7,
    "typography",
    "display",
    "font-family: Bricolage Grotesque; font-size: 36px; line-height: 40px; font-weight: 700; letter-spacing: -0.02em",
    "Screen titles",
  ),
  token(
    8,
    "typography",
    "heading",
    "font-family: Bricolage Grotesque; font-size: 24px; line-height: 32px; font-weight: 600",
    "Section headings",
  ),
  token(9, "typography", "body", "font-family: IBM Plex Sans; font-size: 16px; line-height: 24px; font-weight: 400", "Paragraphs"),
  token(
    10,
    "typography",
    "caption",
    "font-family: JetBrains Mono; font-size: 12px; line-height: 16px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase",
    "Labels and eyebrows",
  ),
  token(11, "icons", "icon-home", icon('<path d="M3 9.5 12 3l9 6.5V21H3z"/>')),
  token(12, "icons", "icon-search", icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>')),
  token(13, "icons", "icon-bell", icon('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>')),
  token(14, "icons", "icon-map-pin", icon('<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>')),
]

const request = (
  id: number,
  title: string,
  description: string,
  priority: FeatureRequest["priority"],
  status: FeatureRequest["status"],
  requested_by: string,
): FeatureRequest => ({
  id: `00000000-0000-4000-8000-${String(2000 + id).padStart(12, "0")}`,
  project_id: DEMO_PROJECT_ID,
  title,
  description,
  priority,
  status,
  requested_by,
  created_by: null,
  created_at: now,
  updated_at: now,
})

export const demoBacklog: FeatureRequest[] = [
  request(1, "Apple sign-in on onboarding", "Add Sign in with Apple next to the email magic link.", "high", "in_progress", "founder@acmelabs.dev"),
  request(2, "Offline mode for saved trips", "Cache the last five trips so they open without signal.", "high", "backlog", "founder@acmelabs.dev"),
  request(3, "Dark theme parity", "Check every screen against the dark token set.", "medium", "backlog", "pm@acmelabs.dev"),
  request(4, "Share itinerary as link", "Read-only public link for a single itinerary.", "medium", "in_progress", "pm@acmelabs.dev"),
  request(5, "Empty-state illustrations", "Replace placeholder art on list screens.", "low", "completed", "pm@acmelabs.dev"),
]
