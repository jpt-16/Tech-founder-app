import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FeatureRequestDialog } from "@/components/dashboard/feature-request-dialog"
import { FeatureStatusLabel, PriorityBadge } from "@/components/dashboard/status"
import type { FeatureRequest, FeatureStatus } from "@/types/models"

const headClass = "eyebrow h-12 px-5 text-[11px] font-medium"

export function BacklogTab({
  projectId,
  items,
  defaultRequester,
}: {
  projectId: string
  items: FeatureRequest[]
  defaultRequester?: string | null
}) {
  const counts = items.reduce(
    (acc, i) => ({ ...acc, [i.status]: acc[i.status] + 1 }),
    { backlog: 0, in_progress: 0, completed: 0 } as Record<FeatureStatus, number>,
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1">
          <h2 className="font-display text-2xl font-bold">Spec &amp; feature requests</h2>
          <p className="text-muted-foreground text-sm">
            {counts.in_progress} in progress · {counts.backlog} in backlog · {counts.completed} completed. Highest
            priority first.
          </p>
        </div>
        <FeatureRequestDialog projectId={projectId} defaultRequester={defaultRequester} />
      </div>

      <Card className="py-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <p className="font-display text-lg font-semibold">No requests yet</p>
            <p className="text-muted-foreground text-sm">Use “New request” to add the first spec or feature.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={headClass}>Request</TableHead>
                <TableHead className={`${headClass} w-32`}>Priority</TableHead>
                <TableHead className={`${headClass} w-40`}>Status</TableHead>
                <TableHead className={`${headClass} w-56`}>Requested by</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-md px-5 py-4 whitespace-normal">
                    <p className="font-semibold">{item.title}</p>
                    {item.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{item.description}</p>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <PriorityBadge priority={item.priority} />
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <FeatureStatusLabel status={item.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground px-5 py-4 font-mono text-xs">
                    {item.requested_by}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
