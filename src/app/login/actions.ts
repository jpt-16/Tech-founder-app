"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"
import { safeNextPath } from "@/lib/safe-next"

export type LoginState = { status: "idle" | "sent" | "error"; message?: string }

export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase isn't configured yet. Add your keys to .env.local." }
  }

  const email = String(formData.get("email") ?? "").trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Enter a valid email address." }
  }

  const next = safeNextPath(String(formData.get("next") ?? ""))
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? (await headers()).get("origin") ?? "http://localhost:3000"
  const redirectTo = new URL("/auth/confirm", origin)
  redirectTo.searchParams.set("next", next)

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo.toString() },
  })

  if (error) return { status: "error", message: error.message }
  return { status: "sent", message: `Check ${email} for a sign-in link.` }
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect("/login")
}
