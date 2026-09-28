import { ArrowUpRightIcon, FrameIcon, GitBranchIcon, GlobeIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toFigmaEmbedUrl, toFigmaOpenUrl } from "@/lib/figma"
import type { Project } from "@/types/models"

type LinkRow = { label: string; href: string | null; icon: React.ComponentType<{ className?: string }> }

function displayUrl(href: string) {
  try {
    const u = new URL(href)
    return (u.host + u.pathname).replace(/\/$/, "")
  } catch {
    return href
  }
}

export function PrototypeTab({
  project,
  tokenCount,
  openRequestCount,
}: {
  project: Project
  tokenCount: number
  openRequestCount: number
}) {
  const embedUrl = toFigmaEmbedUrl(project.figma_embed_url)
  const figmaUrl = toFigmaOpenUrl(project.figma_embed_url)

  const links: LinkRow[] = [
    { label: "Repository", href: project.repository_url, icon: GitBranchIcon },
    { label: "Live staging", href: project.staging_url, icon: GlobeIcon },
    { label: "Figma file", href: figmaUrl, icon: FrameIcon },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex h-12 items-center gap-3 border-b px-4">
          <div aria-hidden className="flex gap-1.5">
            <span className="bg-border size-2.5 rounded-full" />
            <span className="bg-border size-2.5 rounded-full" />
            <span className="bg-border size-2.5 rounded-full" />
          </div>
          <p className="text-muted-foreground min-w-0 flex-1 truncate font-mono text-xs">
            {figmaUrl ? displayUrl(figmaUrl) : "No prototype linked yet"}
          </p>
          {figmaUrl && (
            <a
              href={figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium"
            >
              Open in Figma <ArrowUpRightIcon className="size-3.5" aria-hidden />
            </a>
          )}
        </div>

        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${project.name} — live Figma prototype`}
            className="bg-canvas aspect-[4/3] w-full lg:aspect-auto lg:h-[640px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          />
        ) : (
          <div className="bg-canvas flex min-h-[420px] flex-col items-center justify-center gap-3 bg-[radial-gradient(var(--canvas-dot)_1px,transparent_1px)] [background-size:20px_20px] p-8 text-center lg:h-[640px]">
            <FrameIcon className="text-muted-foreground size-8" aria-hidden />
            <p className="font-display text-lg font-semibold">Prototype not linked yet</p>
            <p className="text-muted-foreground max-w-sm text-sm">
              Set <code className="font-mono text-xs">projects.figma_embed_url</code> to a Figma file, design or prototype
              link and it will render here.
            </p>
          </div>
        )}
      </Card>

      <aside className="flex flex-col gap-4">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle className="font-display text-lg">Project links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 px-3">
            {links.map(({ label, href, icon: Icon }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-accent group flex min-h-14 items-center gap-3 rounded-lg px-3 py-2"
                >
                  <Icon className="size-5 shrink-0" aria-hidden />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-muted-foreground truncate font-mono text-xs">{displayUrl(href)}</span>
                  </span>
                  <ArrowUpRightIcon className="group-hover:text-primary size-4 shrink-0" aria-hidden />
                </a>
              ) : (
                <div key={label} className="flex min-h-14 items-center gap-3 rounded-lg px-3 py-2 opacity-60">
                  <Icon className="size-5 shrink-0" aria-hidden />
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-muted-foreground text-xs">Not set</span>
                  </span>
                </div>
              ),
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="eyebrow">Tokens</span>
              <span className="font-display text-3xl font-bold">{tokenCount}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="eyebrow">Open requests</span>
              <span className="font-display text-3xl font-bold">{openRequestCount}</span>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
