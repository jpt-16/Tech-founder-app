import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BacklogTab } from "@/components/dashboard/backlog-tab"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { PrototypeTab } from "@/components/dashboard/prototype-tab"
import { SiteHeader } from "@/components/dashboard/site-header"
import { ProjectStatusPill } from "@/components/dashboard/status"
import { TokensTab } from "@/components/dashboard/tokens-tab"
import { brandStyle } from "@/lib/color"
import { parseDashboardTab } from "@/lib/dashboard-tabs"
import { getProjectDashboard } from "@/lib/data"

type PageProps = {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId } = await params
  const data = await getProjectDashboard(projectId)
  return { title: data?.project.name ?? "Project" }
}

export default async function ProjectDashboardPage({ params, searchParams }: PageProps) {
  const [{ projectId }, query] = await Promise.all([params, searchParams])
  const data = await getProjectDashboard(projectId)
  if (!data) notFound()

  const { organisation, project, tokens, backlog, viewer, mode } = data
  const openRequests = backlog.filter((b) => b.status !== "completed").length

  return (
    <div style={brandStyle(organisation.primary_color)} className="min-h-dvh">
      <SiteHeader organisation={organisation} viewer={viewer} demo={mode === "demo"} />

      <main className="mx-auto flex max-w-7xl flex-col px-4 pt-10 pb-16 sm:px-8">
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">Project</span>
            <ProjectStatusPill status={project.status} />
          </div>
          <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-muted-foreground max-w-3xl text-base leading-relaxed">{project.description}</p>
          )}
        </section>

        <div className="mt-7">
          <DashboardTabs
            initialTab={parseDashboardTab(query.tab)}
            panels={{
              prototype: (
                <PrototypeTab project={project} tokenCount={tokens.length} openRequestCount={openRequests} />
              ),
              tokens: <TokensTab tokens={tokens} />,
              backlog: <BacklogTab projectId={project.id} items={backlog} defaultRequester={viewer?.email} />,
            }}
          />
        </div>
      </main>
    </div>
  )
}
