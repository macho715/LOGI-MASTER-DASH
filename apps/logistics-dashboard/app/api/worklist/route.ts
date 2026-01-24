/**
 * GET /api/worklist
 * Dashboard Worklist API
 * DB 데이터를 WorklistRow 형식으로 변환하여 반환
 */

import { supabaseAdmin as supabase } from "@/lib/supabase"
import {
  calculateKpis,
  getDubaiToday,
  getDubaiTimestamp,
  shipmentToWorklistRow,
  type ShipmentRow,
} from "@/lib/worklist-utils"
import type { DashboardPayload, WorklistRow } from "@repo/shared"
import { NextRequest, NextResponse } from "next/server"

/**
 * Fallback Demo 데이터 (API 실패 시 사용)
 */
const getFallbackPayload = (): DashboardPayload => ({
  lastRefreshAt: getDubaiTimestamp(),
  kpis: {
    driAvg: 0.0,
    wsiAvg: 0.0,
    redCount: 0,
    overdueCount: 0,
    recoverableAED: 0.0,
    zeroStops: 0,
  },
  rows: [],
})

/**
 * GET /api/worklist
 */
export async function GET(request: NextRequest) {
  try {
    // Asia/Dubai 시간대 기준 오늘 날짜 사용 (필터링 및 계산 일관성)
    const today = getDubaiToday()

    // 1. Shipments 조회 (warehouse_inventory와 함께, Flow Code 필드 포함)
    const { data: shipments, error: shipmentsError } = await supabase
      .from("shipments")
      .select(
        `
        id,
        sct_ship_no,
        mr_number,
        commercial_invoice_no,
        invoice_date,
        vendor,
        main_description,
        port_of_loading,
        port_of_discharge,
        vessel_name,
        bl_awb_no,
        ship_mode,
        coe,
        etd,
        eta,
        do_collection_date,
        customs_start_date,
        customs_close_date,
        delivery_date,
        duty_amount_aed,
        vat_amount_aed,
        incoterms,
        flow_code,
        flow_code_original,
        flow_override_reason,
        final_location,
        warehouse_inventory (
          mosb,
          dsv_indoor,
          dsv_outdoor,
          dsv_mzd,
          jdn_mzd,
          jdn_waterfront,
          project_shu2,
          project_mir3,
          project_das4,
          project_agi5
        )
      `
      )
      .order("eta", { ascending: false })

    if (shipmentsError) {
      console.error("Supabase error:", shipmentsError)
      // API 실패 시에도 UI가 보이도록 Fallback 데이터 반환
      return NextResponse.json(getFallbackPayload())
    }

    // 2. ShipmentRow[] → WorklistRow[] 변환
    const worklistRows = (shipments || [])
      .map((s: any) => {
        try {
          // warehouse_inventory는 배열일 수 있으므로 첫 번째 항목 사용
          const wh = Array.isArray(s.warehouse_inventory)
            ? s.warehouse_inventory[0]
            : s.warehouse_inventory

          const shipmentRow: ShipmentRow = {
            id: s.id,
            sct_ship_no: s.sct_ship_no,
            mr_number: s.mr_number,
            commercial_invoice_no: s.commercial_invoice_no,
            invoice_date: s.invoice_date,
            vendor: s.vendor,
            main_description: s.main_description,
            port_of_loading: s.port_of_loading,
            port_of_discharge: s.port_of_discharge,
            vessel_name: s.vessel_name,
            bl_awb_no: s.bl_awb_no,
            ship_mode: s.ship_mode,
            coe: s.coe,
            etd: s.etd,
            eta: s.eta,
            do_collection_date: s.do_collection_date,
            customs_start_date: s.customs_start_date,
            customs_close_date: s.customs_close_date,
            delivery_date: s.delivery_date,
            duty_amount_aed: s.duty_amount_aed ? Number(s.duty_amount_aed) : null,
            vat_amount_aed: s.vat_amount_aed ? Number(s.vat_amount_aed) : null,
            incoterms: s.incoterms,
            flow_code: s.flow_code ? Number(s.flow_code) : null,
            flow_code_original: s.flow_code_original ? Number(s.flow_code_original) : null,
            flow_override_reason: s.flow_override_reason,
            final_location: s.final_location,
            warehouse_inventory: wh
              ? {
                  mosb: wh.mosb,
                  dsv_indoor: wh.dsv_indoor,
                  dsv_outdoor: wh.dsv_outdoor,
                  dsv_mzd: wh.dsv_mzd,
                  jdn_mzd: wh.jdn_mzd,
                  jdn_waterfront: wh.jdn_waterfront,
                  project_shu2: wh.project_shu2,
                  project_mir3: wh.project_mir3,
                  project_das4: wh.project_das4,
                  project_agi5: wh.project_agi5,
                }
              : null,
          }

          return shipmentToWorklistRow(shipmentRow, today)
        } catch (err) {
          console.error(`Error converting shipment ${s.id}:`, err)
          return null
        }
      })
      .filter((row: WorklistRow | null): row is WorklistRow => row !== null)

    // 3. KPI 계산
    const kpis = calculateKpis(worklistRows, today)

    // 4. Payload 구성
    const payload: DashboardPayload = {
      lastRefreshAt: getDubaiTimestamp(),
      kpis,
      rows: worklistRows,
    }

    return NextResponse.json(payload)
  } catch (error: any) {
    console.error("Worklist API error:", error)
    // 에러 발생 시에도 Fallback 데이터 반환 (UI 깨짐 방지)
    return NextResponse.json(getFallbackPayload())
  }
}
