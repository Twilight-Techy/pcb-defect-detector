"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Download } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#00E5E5] mb-2">PCB Analysis Dashboard</h1>
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
            // Create a CSV with dashboard data
            const headers = ["Date", "PCBs Analyzed", "Defects Detected", "Detection Rate", "Avg. Processing Time"]

            // Mock data for the last 30 days
            const mockData = Array.from({ length: 30 }, (_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - i)
              return [
                date.toISOString().split("T")[0],
                Math.floor(Math.random() * 50 + 20).toString(),
                Math.floor(Math.random() * 15 + 5).toString(),
                (Math.random() * 5 + 95).toFixed(1) + "%",
                (Math.random() * 0.5 + 1.5).toFixed(1) + "s",
              ].join(",")
            })

            const csvContent = [headers.join(","), ...mockData].join("\n")

            // Create a blob and download it
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

