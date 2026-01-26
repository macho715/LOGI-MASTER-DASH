import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin as supabase } from "@/lib/supabase"
import { readFile } from "fs/promises"
import { join } from "path"
import { parse } from "csv-parse/sync"

/**
 * POST /api/upload-csv
 * CSV 파일을 Supabase에 업로드 (서버 사이드, REST API 사용)
 * 
 * Body: {
 *   schema: "status" | "case" | "public",
 *   table: string,
 *   csvPath: string (프로젝트 루트 기준 상대 경로)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schema, table, csvPath } = body

    if (!schema || !table || !csvPath) {
      return NextResponse.json(
        { error: "Missing required fields: schema, table, csvPath" },
        { status: 400 }
      )
    }

    // 프로젝트 루트 경로 계산 (apps/logistics-dashboard 기준)
    const projectRoot = join(process.cwd(), "../..")
    const fullPath = join(projectRoot, csvPath)

    // CSV 파일 읽기
    const csvContent = await readFile(fullPath, "utf-8")
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    if (records.length === 0) {
      return NextResponse.json(
        { error: "CSV file is empty" },
        { status: 400 }
      )
    }

    // 배치 처리 (한 번에 100개씩)
    const batchSize = 100
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const batchNum = Math.floor(i / batchSize) + 1

      try {
        // Supabase REST API로 업로드
        // 주의: status/case 스키마는 REST API로 직접 접근 불가능할 수 있음
        // 이 경우 SQL 함수를 사용하거나 Dashboard Import 사용 권장
        
        let response
        if (schema === "public") {
          response = await supabase.from(table).upsert(batch).select()
        } else {
          // status/case 스키마는 RPC 함수를 통해 접근하거나
          // 직접 SQL 실행이 필요 (이 API Route에서는 지원하지 않음)
          return NextResponse.json(
            {
              error: `Schema '${schema}' is not directly accessible via REST API. Use Dashboard Table Editor Import instead.`,
              suggestion: `Go to Supabase Dashboard > Table Editor > ${schema}.${table} > Import data`,
            },
            { status: 400 }
          )
        }

        if (response.error) {
          results.failed += batch.length
          results.errors.push(`Batch ${batchNum}: ${response.error.message}`)
        } else {
          results.successful += batch.length
        }
      } catch (error: any) {
        results.failed += batch.length
        results.errors.push(`Batch ${batchNum}: ${error.message}`)
      }
    }

    return NextResponse.json({
      message: `Upload complete: ${results.successful} successful, ${results.failed} failed`,
      results,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
