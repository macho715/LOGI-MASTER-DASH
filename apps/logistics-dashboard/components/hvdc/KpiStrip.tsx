"use client"

import { useOpsStore } from "@repo/shared"
import { ConnectionStatusBadge } from "./ConnectionStatusBadge"
import { useKpiRealtime } from "@/hooks/useKpiRealtime"

const KPI_ITEMS = [
  { key: "driAvg", label: "DRI Avg", format: (v: number) => v.toFixed(2) },
  { key: "wsiAvg", label: "WSI Avg", format: (v: number) => v.toFixed(2) },
  { key: "redCount", label: "Red Count", format: (v: number) => v.toFixed(0) },
  { key: "overdueCount", label: "Overdue", format: (v: number) => v.toFixed(0) },
  { key: "recoverableAED", label: "Recoverable (AED)", format: (v: number) => v.toFixed(2) },
  { key: "zeroStops", label: "Zero Stops", format: (v: number) => v.toFixed(0) },
] as const

export function KpiStrip() {
  const kpis = useOpsStore((state) => state.kpis)
  const lastRefreshAt = useOpsStore((state) => state.lastRefreshAt)

  // Subscribe to Realtime KPI updates
  const { status } = useKpiRealtime({
    enabled: true,
  })

  const safe = {
    driAvg: kpis?.driAvg ?? 0,
    wsiAvg: kpis?.wsiAvg ?? 0,
    redCount: kpis?.redCount ?? 0,
    overdueCount: kpis?.overdueCount ?? 0,
    recoverableAED: kpis?.recoverableAED ?? 0,
    zeroStops: kpis?.zeroStops ?? 0,
  }

  const lastUpdatedAt = lastRefreshAt
    ? new Date(lastRefreshAt)
    : undefined

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">KPI Dashboard</h2>
        <ConnectionStatusBadge
          status={status}
          lastUpdatedAt={lastUpdatedAt}
          details={`KPI updates via ${status === "live" ? "Realtime" : status === "polling" ? "fallback polling" : "cached data"}`}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-7" aria-live="polite">
        {KPI_ITEMS.map((item) => (
          <KpiCard key={item.key} label={item.label} value={item.format(safe[item.key])} />
        ))}
        <KpiCard label="Last Refresh" value={lastRefreshAt ?? "-"} />
      </div>
    </div>
  )
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/80 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  )
}
