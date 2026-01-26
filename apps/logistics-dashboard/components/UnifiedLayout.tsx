"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useOpsActions, useWorklistRows } from "@repo/shared"
import { HeaderBar } from "@/components/dashboard/HeaderBar"
import { RightPanel } from "@/components/dashboard/RightPanel"
import { KpiStrip } from "@/components/hvdc/KpiStrip"
import { StageCardsStrip } from "@/components/hvdc/StageCardsStrip"
import { WorklistTable } from "@/components/hvdc/WorklistTable"
import { DetailDrawer } from "@/components/hvdc/DetailDrawer"
import { MapView } from "@/components/map/MapView"
import { useLiveFeed } from "@/hooks/useLiveFeed"
import { useInitialDataLoad } from "@/hooks/useInitialDataLoad"
import { fetchEvents, fetchLocationStatuses, fetchLocations } from "@/lib/api"
import type { HvdcBucket } from "@/lib/hvdc/buckets"

const MIN_PANEL_HEIGHT = 200
const MAX_PANEL_HEIGHT = 600
const DEFAULT_PANEL_HEIGHT = 260

export function UnifiedLayout() {
  const mapDataLoadDone = useRef(false)
  const [panelHeight, setPanelHeight] = useState(DEFAULT_PANEL_HEIGHT)
  const panelDragRef = useRef<{ startY: number; startHeight: number } | null>(null)

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const actions = useOpsActions()
  const worklistRows = useWorklistRows()

  // Initial data load for worklist/KPI (before Realtime subscriptions)
  const { isLoading: isWorklistLoading } = useInitialDataLoad({
    loadOptionCKpis: false, // Option C not yet implemented
    onLoadComplete: (payload) => {
      console.log("Initial worklist/KPI load complete:", payload)
    },
  })

  // Connect to WebSocket for real-time updates (non-KPI feeds: events, location_status)
  useLiveFeed()

  // Load map data (locations, statuses, events) separately from worklist
  useEffect(() => {
    if (mapDataLoadDone.current) return
    mapDataLoadDone.current = true

    async function loadMapData() {
      try {
        const [locations, statuses, events] = await Promise.all([
          fetchLocations(),
          fetchLocationStatuses(),
          fetchEvents(),
        ])

        actions.setLocations(locations)
        actions.setLocationStatuses(statuses)
        actions.setEvents(events)
      } catch (error) {
        console.error("Failed to load map data:", error)
      }
    }

    loadMapData()
  }, [actions])

  // Close the drawer on Escape.
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        actions.setDrawerOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [actions])

  const handlePanelDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!panelDragRef.current) return

    if ("cancelable" in e && e.cancelable) {
      e.preventDefault()
    }

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    const deltaY = panelDragRef.current.startY - clientY
    const nextHeight = panelDragRef.current.startHeight + deltaY
    const clampedHeight = Math.max(MIN_PANEL_HEIGHT, Math.min(MAX_PANEL_HEIGHT, nextHeight))
    setPanelHeight(clampedHeight)
  }, [])

  const handlePanelDragEnd = useCallback(() => {
    panelDragRef.current = null
    document.removeEventListener("mousemove", handlePanelDragMove)
    document.removeEventListener("mouseup", handlePanelDragEnd)
    document.removeEventListener("touchmove", handlePanelDragMove)
    document.removeEventListener("touchend", handlePanelDragEnd)
  }, [handlePanelDragMove])

  const handlePanelDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      panelDragRef.current = {
        startY: clientY,
        startHeight: panelHeight,
      }

      document.addEventListener("mousemove", handlePanelDragMove)
      document.addEventListener("mouseup", handlePanelDragEnd)
      document.addEventListener("touchmove", handlePanelDragMove, { passive: false })
      document.addEventListener("touchend", handlePanelDragEnd)
    },
    [handlePanelDragEnd, handlePanelDragMove, panelHeight],
  )

  useEffect(() => () => handlePanelDragEnd(), [handlePanelDragEnd])

  useEffect(() => {
    const raw = searchParams.get("bucket")
    if (raw !== "cumulative" && raw !== "current" && raw !== "future") {
      actions.setFilters({ bucket: undefined })
      return
    }
    actions.setFilters({ bucket: raw as HvdcBucket })
  }, [actions, searchParams])

  const handleNavigateBucket = useCallback(
    (bucket: HvdcBucket) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("bucket", bucket)
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams],
  )

  return (
    <div className="min-h-screen bg-background dark">
      <HeaderBar />

      <div className="flex min-h-screen pt-24 lg:pb-96">
        <div className="flex-1 relative min-w-0" role="main" aria-label="Logistics Map View">
          <MapView />
        </div>

        <aside className="hidden lg:block w-80 shrink-0" aria-label="Location Status Panel">
          <RightPanel />
        </aside>
      </div>

      <div
        className="hidden lg:block fixed bottom-0 left-0 right-80 bg-card border-t border-border z-40"
        aria-label="HVDC Worklist Panel"
      >
        <div className="h-80 flex flex-col">
          <div className="p-4 border-b space-y-3">
            <StageCardsStrip rows={worklistRows} onNavigateBucket={handleNavigateBucket} />
            <KpiStrip />
          </div>
          <div className="flex-1 overflow-auto">
            <WorklistTable />
          </div>
        </div>
      </div>

      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 rounded-t-lg shadow-lg"
        aria-label="HVDC Worklist Panel (Mobile)"
      >
        <div
          className="h-1 bg-border rounded-full mx-auto w-12 mt-2 mb-2 cursor-grab active:cursor-grabbing touch-none"
          onMouseDown={handlePanelDragStart}
          onTouchStart={handlePanelDragStart}
          role="button"
          aria-label="Drag to resize panel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setPanelHeight((height) =>
                height <= MIN_PANEL_HEIGHT + 8 ? DEFAULT_PANEL_HEIGHT : MIN_PANEL_HEIGHT,
              )
            }
          }}
        />

        <div className="overflow-hidden transition-all duration-200" style={{ height: `${panelHeight}px` }}>
          <div className="p-4 border-b space-y-3">
            <StageCardsStrip rows={worklistRows} onNavigateBucket={handleNavigateBucket} />
            <KpiStrip />
          </div>
          <div className="flex-1 overflow-auto" style={{ height: `${panelHeight - 120}px` }}>
            <WorklistTable />
          </div>
        </div>
      </div>

      <div className="hidden lg:block fixed top-24 right-80 bottom-80 w-96 z-50">
        <DetailDrawer mode="sidepanel" />
      </div>
      <div className="lg:hidden">
        <DetailDrawer mode="overlay" />
      </div>
    </div>
  )
}
