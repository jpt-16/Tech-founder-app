"use server"

import { revalidatePath } from "next/cache"

import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"
import type { FeaturePriority } from "@/types/models"

export type FeatureRequestState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<Record<"title" | "description" | "priority" | "requestedBy", string>>
}

const PRIORITIES: FeaturePriority[] = ["low", "medium", "high"]

export async function submitFeatureRequest(
  projectId: string,
  _prev: FeatureRequestState,
  formData: FormData,
): Promise<FeatureRequestState> {
  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const priority = String(formData.get("priority") ?? "") as FeaturePriority
  const requestedBy = String(formData.get("requestedBy") ?? "").trim()

  const fieldErrors: FeatureRequestState["fieldErrors"] = {}
  if (title.length < 3 || title.length > 140) fieldErrors.title = "Use 3–140 characters."
  if (description.length > 4000) fieldErrors.description = "Keep it under 4,000 characters."
  if (!PRIORITIES.includes(priority)) fieldErrors.priority = "Pick a priority."
  if (requestedBy.length > 200) fieldErrors.requestedBy = "Too long."
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Check the highlighted fields.", fieldErrors }
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Demo mode: connect Supabase (see CLAUDE.md) to save requests.",
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { status: "error", message: "Your session expired. Sign in again." }

  const { error } = await supabase.from("feature_backlog").insert({
    project_id: projectId,
    title,
    description: description || null,
    priority,
    status: "backlog",
    requested_by: requestedBy || user.email || "Client",
    created_by: user.id,
  })

  if (error) {
    // RLS rejections surface as 42501 — the user isn't a member of this project's org.
    const message =
      error.code === "42501"
        ? "You don't have access to submit requests for this project."
        : "Couldn't save the request. Try again."
    return { status: "error", message }
  }

  revalidatePath(`/dashboard/${projectId}`)
  return { status: "success", message: "Request submitted." }
}
