import Link from "next/link"
import { ArrowRightIcon, BoxesIcon, FrameIcon, ListChecksIcon } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { DEMO_PROJECT_ID } from "@/lib/demo-data"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const FEATURES = [
  { icon: FrameIcon, title: "Live prototype", body: "The current Figma prototype, embedded next to the repo and staging links." },
  { icon: BoxesIcon, title: "Design tokens", body: "Colours, type scales and SVG icons, each one copyable in a click." },
  { icon: ListChecksIcon, title: "Feature backlog", body: "Clients file spec requests with a priority, and you triage them in one list." },
]

export default function Home() {
  const primaryHref = isSupabaseConfigured() ? "/dashboard" : `/dashboard/${DEMO_PROJECT_ID}`

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:px-8">
        <span
          aria-hidden
          className="bg-primary text-primary-foreground font-display flex size-8 items-center justify-center rounded-lg font-bold"
        >
          S
        </span>
        <span className="font-display text-lg font-bold">Spec Hub</span>
        <div className="flex-1" />
        <ThemeToggle />
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-16 pb-24 sm:px-8 sm:pt-28">
        <section className="flex max-w-3xl flex-col gap-6">
          <span className="eyebrow">Client portal for tech founders</span>
          <h1 className="font-display text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-7xl">
            Specs, tokens and prototypes in one link.
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            Give each client a single dashboard with the live Figma prototype, the design tokens and a backlog they
            can add requests to. No $150/mo enterprise portal needed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="h-12 px-5 text-base font-semibold">
              <Link href={primaryHref}>
                Open dashboard <ArrowRightIcon aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 px-5 text-base">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <ul className="grid gap-px overflow-hidden rounded-xl border bg-[var(--border)] sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-background flex flex-col gap-3 p-6">
              <Icon className="size-6" aria-hidden />
              <h2 className="font-display text-xl font-bold">{title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
