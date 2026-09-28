import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { SiteHeader } from "@/components/dashboard/site-header"
import { ProjectStatusPill } from "@/components/dashboard/status"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { brandStyle } from "@/lib/color"
import { getProjects, getViewer } from "@/lib/data"

export const metadata: Metadata = { title: "Projects" }

export default async function DashboardIndexPage() {
  const [{ mode, projects }, viewer] = await Promise.all([getProjects(), getViewer()])

  return (
    <div className="min-h-dvh">
      <SiteHeader viewer={viewer} demo={mode === "demo"} />
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-10 pb-16 sm:px-8">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">Your projects</span>
          <h1 className="font-display text-4xl font-bold tracking-tight">Projects</h1>
        </div>

        {projects.length === 0 ? (
          <Card className="items-center gap-2 p-12 text-center">
            <p className="font-display text-lg font-semibold">No projects yet</p>
            <p className="text-muted-foreground max-w-md text-sm">
              Ask the studio running this portal to add your account to their organisation. Projects appear here as
              soon as you&apos;re a member.
            </p>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li key={p.id} style={brandStyle(p.organisation?.primary_color)}>
                <Link href={`/dashboard/${p.id}`} className="group block h-full rounded-xl">
                  <Card className="group-hover:border-primary h-full transition-colors">
                    <CardHeader className="gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="eyebrow truncate">{p.organisation?.name}</span>
                        <ProjectStatusPill status={p.status} />
                      </div>
                      <CardTitle className="font-display flex items-center gap-2 text-xl">
                        {p.name}
                        <ArrowRightIcon
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </CardTitle>
                      {p.description && <CardDescription className="line-clamp-2">{p.description}</CardDescription>}
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
