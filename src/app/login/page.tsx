import type { Metadata } from "next"
import Link from "next/link"

import { LoginForm } from "./login-form"
import { safeNextPath } from "@/lib/safe-next"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { DEMO_PROJECT_ID } from "@/lib/demo-data"

export const metadata: Metadata = { title: "Sign in" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams
  const configured = isSupabaseConfigured()

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-8 px-4 py-16">
      <div className="flex flex-col gap-3">
        <span
          aria-hidden
          className="bg-primary text-primary-foreground font-display flex size-10 items-center justify-center rounded-xl text-lg font-bold"
        >
          S
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight">Sign in to Spec Hub</h1>
        <p className="text-muted-foreground">We&apos;ll email you a one-time sign-in link. No password needed.</p>
      </div>

      {error && (
        <p role="alert" className="border-destructive text-destructive rounded-lg border p-3 text-sm">
          That sign-in link is invalid or has expired. Request a new one.
        </p>
      )}

      {configured ? (
        <LoginForm next={safeNextPath(next)} />
      ) : (
        <div className="flex flex-col gap-3 rounded-xl border p-4 text-sm">
          <p>
            Supabase isn&apos;t configured, so the app is running in <strong>demo mode</strong>.
          </p>
          <Link href={`/dashboard/${DEMO_PROJECT_ID}`} className="text-primary font-semibold underline-offset-4 hover:underline">
            Open the demo dashboard →
          </Link>
        </div>
      )}
    </main>
  )
}
