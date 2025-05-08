"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, Clock, CircuitBoard } from "lucide-react"

export function ResultsHeader({ id }: { id: string }) {
  // In a real app, we would fetch this data based on the ID
  const result = {
    name: "Main Controller PCB",
    timestamp: "April 1, 2025 - 09:35 AM",
    defects: 3,
    severity: "Critical",
    status: "Completed",
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00E5E5] mb-2">Analysis Results</h1>
          <div className="flex items-center text-gray-400 mb-2">
            <CircuitBoard className="h-4 w-4 mr-2" />
            <span className="font-medium text-white">{result.name}</span>
            <span className="mx-2">•</span>
            <span className="text-sm">ID: {id}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            <span>{result.timestamp}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            className="border-[#00E5E5] text-[#00E5E5] hover:bg-[#00E5E5]/10"
            onClick={() => {
              // In a real app, this would open a share dialog or copy a link
              alert(`Share link copied: https://pcbdetect.com/results/${id}`)
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            className="bg-[#B347FF] hover:bg-[#B347FF]/80 text-white"
            onClick={() => {
              // Create a PDF-like report (in this case, we'll use a CSV as a simple example)
              const reportData = [
                ["PCB Analysis Report"],
                ["ID", id],
                ["Name", result.name],
                ["Timestamp", result.timestamp],
                ["Defects", result.defects.toString()],
                ["Severity", result.severity],
                ["Status", result.status],
              ]

              const csvContent = reportData.map((row) => row.join(",")).join("\n")

              // Create a blob and download it
              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
              const url = URL.createObjectURL(blob)
              const link = document.createElement("a")
              link.setAttribute("href", url)
              link.setAttribute("download", `pcb_report_${id}.csv`)
              link.style.visibility = "hidden"
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <Badge className="bg-[#00E5E5]/10 text-[#00E5E5] border-[#00E5E5]/20">Status: {result.status}</Badge>
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Defects: {result.defects}</Badge>
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Severity: {result.severity}</Badge>
      </div>
    </div>
  )
}

