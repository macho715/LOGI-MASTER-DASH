import { NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase"
import { ontologyLocations } from "@/lib/data/ontology-locations"
import { POI_LOCATIONS } from "@/lib/map/poiLocations"
import type { Event } from "@/types/logistics"

const COORD_JITTER_DEGREES = 0.002

const SITE_TYPE_BY_POI_CATEGORY = {
  HVDC_SITE: "SITE",
  PORT: "PORT",
  BERTH: "BERTH",
  YARD: "MOSB_WH",
  OFFICE: "OTHER",
  AIRPORT: "OTHER",
} as const

function generateMockEvents(): Event[] {
  const events: Event[] = []
  const statuses = ["PICKUP", "IN_TRANSIT", "DELIVERED", "DELAYED", "HOLD"]
  const mockLocations =
    ontologyLocations.length > 0
      ? ontologyLocations
      : POI_LOCATIONS.map((poi) => ({
          location_id: poi.id,
          name: poi.name,
          siteType: SITE_TYPE_BY_POI_CATEGORY[poi.category] ?? "OTHER",
          lat: poi.latitude,
          lon: poi.longitude,
        }))

  if (mockLocations.length === 0) {
    return events
  }

  for (let i = 0; i < 50; i += 1) {
    const location = mockLocations[Math.floor(Math.random() * mockLocations.length)]
    const hoursAgo = Math.random() * 48
    const ts = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

    events.push({
      event_id: `evt-${i}`,
      ts,
      shpt_no: `SHPT-${1000 + i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location_id: location.location_id,
      lat: location.lat + (Math.random() - 0.5) * COORD_JITTER_DEGREES,
      lon: location.lon + (Math.random() - 0.5) * COORD_JITTER_DEGREES,
      remark: Math.random() > 0.7 ? "Sample remark" : undefined,
    })
  }

  return events
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        id,
        location_id,
        shipment_id,
        event_type,
        description,
        metadata,
        ts,
        locations!inner (
          id,
          lat,
          lng
        ),
        shipments (
          id,
          sct_ship_no
        )
      `,
      )
      .order("ts", { ascending: false })
      .limit(1000)

    if (error) throw error
    if (!data || data.length === 0) {
      console.warn("No events found in DB, using mock data")
      return NextResponse.json(generateMockEvents())
    }

    const events: Event[] = data
      .filter((row) => {
        const location = row.locations as { lat: number | null; lng: number | null } | null
        return (
          location &&
          typeof location.lat === "number" &&
          typeof location.lng === "number" &&
          typeof row.ts === "string"
        )
      })
      .map((row) => {
        const location = row.locations as { id: string; lat: number; lng: number } | null
        const shipment = row.shipments as { id: string; sct_ship_no: string | null } | null

        return {
          event_id: row.id,
          ts: row.ts,
          shpt_no: shipment?.sct_ship_no ?? "",
          status: row.event_type ?? "UNKNOWN",
          location_id: row.location_id ?? location?.id ?? "",
          lat: location!.lat,
          lon: location!.lng,
          remark: row.description ?? undefined,
          event_type: row.event_type ?? undefined,
          event_date_dubai:
            row.metadata && typeof row.metadata === "object"
              ? (row.metadata.event_date_dubai as string | undefined)
              : undefined,
        }
      })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    console.warn("Using mock data as fallback")
    return NextResponse.json(generateMockEvents())
  }
}
