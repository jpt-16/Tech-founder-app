import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import type { Database } from "@/types/database"
import { isSupabaseConfigured, requireSupabaseEnv } from "./env"

const PROTECTED_PREFIXES = ["/dashboard"]

/** Refreshes the Supabase auth cookie and gates protected routes. */
export async function updateSession(request: NextRequest) {
  // Demo mode: no Supabase configured, let every route render sample data.
  if (!isSupabaseConfigured()) return NextResponse.next({ request })

  const { url, anonKey } = requireSupabaseEnv()
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // Do not run code between createServerClient and getUser(): it revalidates the token.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  if (!user && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.search = ""
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}
