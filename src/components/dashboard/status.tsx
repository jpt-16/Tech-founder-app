import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FeaturePriority, FeatureStatus, ProjectStatus } from "@/types/models"

// Priority levels differ in fill *and* lightness, not hue alone:
// High = solid brand fill, Medium = strong outline, Low = muted.
const PRIORITY: Record<FeaturePriority, { label: string; className: string }> = {
  high: { label: "High", className: "bg-primary text-primary-foreground font-semibold" },
  medium: { label: "Medium", className: "border-foreground text-foreground font-semibold" },
  low: { label: "Low", className: "border-border bg-muted text-muted-foreground" },
}

export function PriorityBadge({ priority }: { priority: FeaturePriority }) {
  const p = PRIORITY[priority]
  return (
    <Badge variant="outline" className={cn("px-2.5 py-1", p.className)}>
      {p.label}
    </Badge>
  )
}

const FEATURE_STATUS: Record<FeatureStatus, { label: string; dot: string }> = {
  backlog: { label: "Backlog", dot: "bg-muted-foreground/60" },
  in_progress: { label: "In progress", dot: "bg-primary" },
  completed: { label: "Completed", dot: "bg-foreground" },
}

export function FeatureStatusLabel({ status }: { status: FeatureStatus }) {
  const s = FEATURE_STATUS[status]
  return (
    <span className="inline-flex items-center gap-2 text-sm whitespace-nowrap">
      <span aria-hidden className={cn("size-2 rounded-full", s.dot)} />
      {s.label}
    </span>
  )
}

const PROJECT_STATUS: Record<ProjectStatus, string> = {
  planning: "Planning",
  in_progress: "In progress",
  review: "In review",
  live: "Live",
  paused: "Paused",
}

export function ProjectStatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
      <span
        aria-hidden
        className={cn("size-2 rounded-full", status === "paused" ? "bg-muted-foreground" : "bg-primary")}
      />
      {PROJECT_STATUS[status]}
    </span>
  )
}
