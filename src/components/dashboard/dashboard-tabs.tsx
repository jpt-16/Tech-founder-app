"use client"

import { useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DASHBOARD_TABS, type DashboardTab } from "@/lib/dashboard-tabs"

const LABELS: Record<DashboardTab, string> = {
  prototype: "Live Prototype & Specs",
  tokens: "Design Tokens",
  backlog: "Feature Backlog",
}

/** Tabs whose selection is mirrored to `?tab=` so links are shareable. */
export function DashboardTabs({
  initialTab,
  panels,
}: {
  initialTab: DashboardTab
  panels: Record<DashboardTab, React.ReactNode>
}) {
  const [tab, setTab] = useState<DashboardTab>(initialTab)

  function onChange(value: string) {
    const next = value as DashboardTab
    setTab(next)
    const url = new URL(window.location.href)
    if (next === "prototype") url.searchParams.delete("tab")
    else url.searchParams.set("tab", next)
    window.history.replaceState(null, "", url)
  }

  return (
    <Tabs value={tab} onValueChange={onChange} className="gap-0">
      <div className="-mx-4 overflow-x-auto border-b px-4 sm:mx-0 sm:px-0">
        <TabsList variant="line" className="gap-1 p-0 group-data-[orientation=horizontal]/tabs:h-12">
          {DASHBOARD_TABS.map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="data-[state=active]:after:bg-primary h-12 flex-none px-4 text-[15px] after:bottom-0! data-[state=active]:font-semibold"
            >
              {LABELS[t]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {DASHBOARD_TABS.map((t) => (
        <TabsContent key={t} value={t} className="pt-7">
          {panels[t]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
