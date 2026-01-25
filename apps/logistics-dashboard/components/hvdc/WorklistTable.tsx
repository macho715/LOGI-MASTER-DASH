"use client"

import { useMemo } from "react"
import { useShallow } from "zustand/react/shallow"
import { selectFilteredWorklistRows, useOpsActions, useOpsStore, useSelectedCaseId } from "@repo/shared"
import type { Gate } from "@repo/shared"

const MAX_ROWS = 200

function gateClass(gate: Gate) {
  if (gate === "ZERO") return "bg-black/80 text-white border-white/10"
  if (gate === "RED") return "bg-red-600/80 text-white border-red-500/50"
  if (gate === "AMBER") return "bg-amber-500/80 text-black border-amber-400/50"
  return "bg-emerald-600/80 text-white border-emerald-500/50"
}

export function WorklistTable() {
  const actions = useOpsActions()
  const selectedCaseId = useSelectedCaseId()
  const rows = useOpsStore(useShallow(selectFilteredWorklistRows))

  const visible = useMemo(() => rows.slice(0, MAX_ROWS), [rows])

  return (
    <div className="h-full overflow-auto rounded-lg border border-border">
      <table className="min-w-full text-xs">
        <thead className="sticky top-0 bg-muted/70 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left">Gate</th>
            <th className="px-3 py-2 text-left">Flow</th>
            <th className="px-3 py-2 text-left">Title</th>
            <th className="px-3 py-2 text-left">ETA</th>
            <th className="px-3 py-2 text-left">Due</th>
            <th className="px-3 py-2 text-left">Location</th>
            <th className="px-3 py-2 text-left">Triggers</th>
            <th className="px-3 py-2 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => {
            const active = row.id === selectedCaseId
            const triggers = row.triggers ?? []
            return (
              <tr
                key={row.id}
                className={`cursor-pointer border-t border-border/60 hover:bg-accent/40 ${
                  active ? "bg-accent/60" : "bg-background"
                }`}
                onClick={() => actions.selectCase(row.id)}
                aria-label={`Open case ${row.title}`}
              >
                <td className="px-3 py-2">
                  <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${gateClass(row.gate)}`}>
                    {row.gate}
                  </span>
                </td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">
                  {typeof row.flowCode === "number" ? row.flowCode : "-"}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-foreground">{row.title}</div>
                  <div className="text-[11px] text-muted-foreground">{row.subtitle ?? "-"}</div>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{row.eta ?? "-"}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.dueAt ?? "-"}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.currentLocation ?? "-"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {triggers.slice(0, 3).map((trigger) => (
                      <span
                        key={trigger}
                        className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {trigger}
                      </span>
                    ))}
                    {triggers.length > 3 && (
                      <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        +{triggers.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-foreground">
                  {typeof row.score === "number" ? row.score.toFixed(2) : "-"}
                </td>
              </tr>
            )
          })}
          {visible.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-center text-muted-foreground" colSpan={8}>
                No results (check filters)
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
