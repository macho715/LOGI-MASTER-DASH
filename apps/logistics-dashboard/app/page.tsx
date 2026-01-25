"use client"

import { Suspense } from "react"
import { UnifiedLayout } from "@/components/UnifiedLayout"

function DashboardContent() {
  return <UnifiedLayout />
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
