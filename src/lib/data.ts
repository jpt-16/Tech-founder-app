import "server-only"

import { cache } from "react"

import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import {
  DEMO_PROJECT_ID,
  demoBacklog,
  demoOrganisation,
  demoProject,
  demoTokens,
} from "@/lib/demo-data"
import type { DesignToken, FeatureRequest, Organisation, Project } from "@/types/models"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type Viewer = { email: string | null } | null

export type ProjectDashboard = {
  mode: "live" | "demo"
  viewer: Viewer
  organisation: Organisation
  project: Project
  tokens: DesignToken[]
  backlog: FeatureRequest[]
}

export type ProjectSummary = Project & { organisation: Organisation | null }

const PRIORITY_RANK: Record<FeatureRequest["priority"], number> = { high: 0, medium: 1, low: 2 }

function sortBacklog(items: FeatureRequest[]) {
  return [...items].sort(
    (a, b) =>
      PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
      b.created_at.localeCompare(a.created_at),
  )
}

export const getViewer = cache(async (): Promise<Viewer> => {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user ? { email: user.email ?? null } : null
})

/** Projects visible to the signed-in user (RLS decides which). */
export async function getProjects(): Promise<{ mode: "live" | "demo"; projects: ProjectSummary[] }> {
  if (!isSupabaseConfigured()) {
    return { mode: "demo", projects: [{ ...demoProject, organisation: demoOrganisation }] }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*, organisation:organisations(*)")
    .order("updated_at", { ascending: false })

  if (error) throw new Error(`Failed to load projects: ${error.message}`)
  return { mode: "live", projects: (data ?? []) as ProjectSummary[] }
}

/** Everything the /dashboard/[projectId] page needs, or null if not visible. */
export async function getProjectDashboard(projectId: string): Promise<ProjectDashboard | null> {
  if (!isSupabaseConfigured()) {
    if (projectId !== DEMO_PROJECT_ID) return null
    return {
      mode: "demo",
      viewer: null,
      organisation: demoOrganisation,
      project: demoProject,
      tokens: demoTokens,
      backlog: sortBacklog(demoBacklog),
    }
  }

  if (!UUID.test(projectId)) return null

  const supabase = await createClient()
  const { data: project, error } = await supabase
    .from("projects")
    .select("*, organisation:organisations(*)")
    .eq("id", projectId)
    .maybeSingle()

  if (error) throw new Error(`Failed to load project: ${error.message}`)
  if (!project) return null

  const [tokensRes, backlogRes, viewer] = await Promise.all([
    supabase
      .from("design_tokens")
      .select("*")
      .eq("project_id", projectId)
      .order("token_category")
      .order("created_at"),
    supabase.from("feature_backlog").select("*").eq("project_id", projectId),
    getViewer(),
  ])

  if (tokensRes.error) throw new Error(`Failed to load tokens: ${tokensRes.error.message}`)
  if (backlogRes.error) throw new Error(`Failed to load backlog: ${backlogRes.error.message}`)

  const { organisation, ...projectRow } = project as ProjectSummary
  if (!organisation) return null

  return {
    mode: "live",
    viewer,
    organisation,
    project: projectRow,
    tokens: tokensRes.data ?? [],
    backlog: sortBacklog(backlogRes.data ?? []),
  }
}
