import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import type { Database } from "@/types/database"
import { requireSupabaseEnv } from "./env"

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Create a new one per request — never share it across requests.
 */
export async function createClient() {
  const { url, anonKey } = requireSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore: middleware refreshes the session cookie.
        }
      },
    },
  })
}
