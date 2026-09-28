import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/login/actions"
import type { Viewer } from "@/lib/data"
import type { Organisation } from "@/types/models"

export function SiteHeader({
  organisation,
  viewer,
  demo,
}: {
  organisation?: Pick<Organisation, "name" | "logo_url"> | null
  viewer: Viewer
  demo?: boolean
}) {
  const name = organisation?.name ?? "Spec Hub"

  return (
    <header className="border-b">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:px-8">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3 rounded-md">
          {organisation?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary org logo host
            <img src={organisation.logo_url} alt="" className="size-8 rounded-lg object-cover" />
          ) : (
            <span
              aria-hidden
              className="bg-primary text-primary-foreground font-display flex size-8 shrink-0 items-center justify-center rounded-lg text-base font-bold"
            >
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="font-display truncate text-lg font-bold">{name}</span>
          <span aria-hidden className="text-muted-foreground/60 hidden sm:inline">
            /
          </span>
          <span className="text-muted-foreground hidden text-sm sm:inline">Spec Hub</span>
        </Link>

        <div className="flex-1" />

        {demo && (
          <span className="eyebrow hidden rounded-full border px-2.5 py-1 sm:inline">Demo data</span>
        )}
        {viewer?.email && (
          <span className="text-muted-foreground hidden font-mono text-xs md:inline">{viewer.email}</span>
        )}
        <ThemeToggle />
        {viewer && (
          <form action={signOut}>
            <Button type="submit" variant="ghost" className="h-11">
              Sign out
            </Button>
          </form>
        )}
      </div>
    </header>
  )
}
