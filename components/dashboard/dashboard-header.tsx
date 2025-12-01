"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Download } from "lucide-react"

type DashboardHeaderProps = {
  stats: {
    analyzed: number
    defects: number
    detectionRate: number
    avgProcessingTime: number
  }
  scans: {
    id: string
    name: string
    timestamp: string
    defects: number
    severity: string
    status: string
  }[]
}

export function DashboardHeader({ stats, scans }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#00E5E5] mb-2">LASU Detect Dashboard</h1>
        <p className="text-gray-400">Monitor defect detection metrics and historical data</p>
      </div>

      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <div className="flex items-center bg-[#1A2035] rounded-md px-3 py-2 border border-[#00E5E5]/20">
          <Calendar className="h-4 w-4 text-[#B347FF] mr-2" />
          <span className="text-sm text-gray-300">Last 30 days</span>
        </div>

        <Button
          variant="outline"
          className="border-[#00E5E5] text-[#00E5E5] hover:bg-[#00E5E5]/10"
          onClick={() => {
            // First, add stats at the top of the CSV
            const statHeaders = ["Total Scans", "Total Defects", "Detection Rate (%)", "Avg. Processing Time (s)"]
            const statValues = [
              stats.analyzed.toString(),
              stats.defects.toString(),
              stats.detectionRate.toFixed(2),
              stats.avgProcessingTime.toFixed(2),
            ]

            // Then, add column headers for scan entries
            const scanHeaders = ["Date", "PCB Name", "Defects Detected", "Severity", "Status"]

            // Map each scan into a CSV row
            const scanRows = scans.map((scan) => {
              const date =
                typeof scan.timestamp === "string" || typeof scan.timestamp === "number"
                  ? new Date(scan.timestamp)
                  : null

              return [
                date ? date.toISOString().split("T")[0] : "Invalid Date",
                scan.name ?? "N/A",
                scan.defects?.toString() ?? "0",
                scan.severity ?? "N/A",
                scan.status ?? "N/A"
              ].join(",")
            })

            // Combine everything into one CSV content string
            const csvContent = [
              statHeaders.join(","),
              statValues.join(","),
              "", // blank line between stats and table
              scanHeaders.join(","),
              ...scanRows
            ].join("\n")

            // Trigger download
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.setAttribute("href", url)
            link.setAttribute("download", "pcb_dashboard_report.csv")
            link.style.visibility = "hidden"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  )
}

