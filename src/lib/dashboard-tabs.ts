export const DASHBOARD_TABS = ["prototype", "tokens", "backlog"] as const
export type DashboardTab = (typeof DASHBOARD_TABS)[number]

export function parseDashboardTab(value: string | string[] | undefined): DashboardTab {
  const v = Array.isArray(value) ? value[0] : value
  return DASHBOARD_TABS.includes(v as DashboardTab) ? (v as DashboardTab) : "prototype"
}
