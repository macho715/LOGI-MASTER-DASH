import { NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase"
import { mockStatuses } from "@/lib/api"
import type { LocationStatus, StatusCode } from "@/types/logistics"

function mapDbStatusToStatusCode(status: string | null): StatusCode {
  const normalized = (status ?? "").toUpperCase()
  if (normalized === "WARNING" || normalized === "WARN") return "WARNING"
  if (normalized === "CRITICAL" || normalized === "CRIT") return "CRITICAL"
  return "OK"
}

function normalizeOccupancyRate(value: number | string | null): number {
  if (value === null || value === undefined || value === "") return 0
  const parsed = typeof value === "number" ? value : Number.parseFloat(value)
  if (Number.isNaN(parsed)) return 0
  return parsed > 1 ? parsed / 100 : parsed
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("location_statuses")
      .select("location_id, status, occupancy_rate, updated_at")
      .order("updated_at", { ascending: false })

    if (error) throw error
    if (!data || data.length === 0) {
      console.warn("No location statuses found in DB, using mock data")
      return NextResponse.json(mockStatuses)
    }

    const statuses: LocationStatus[] = data
      .filter((row) => typeof row.location_id === "string" && row.location_id.length > 0)
      .map((row) => ({
        location_id: row.location_id,
        status_code: mapDbStatusToStatusCode(row.status),
        occupancy_rate: normalizeOccupancyRate(row.occupancy_rate),
        last_updated: row.updated_at ?? new Date().toISOString(),
      }))

    if (statuses.length === 0) {
      console.warn("Location statuses missing IDs, using mock data")
      return NextResponse.json(mockStatuses)
    }

    return NextResponse.json(statuses)
  } catch (error) {
    console.warn("Error fetching location statuses, using mock data")
    return NextResponse.json(mockStatuses)
  }
}
