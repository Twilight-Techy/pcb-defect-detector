"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, Clock, CircuitBoard } from "lucide-react"

type ResultsHeaderProps = {
  id: string
  name: string
  createdAt: string
  defectsCount: number
  severity: "Low" | "Medium" | "High" | "Critical"
  status: "Pending" | "Processing" | "Completed" | "Failed"
}

export function ResultsHeader({ id, name, createdAt, defectsCount, severity, status }: ResultsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00E5E5] mb-2">Analysis Results</h1>
          <div className="flex items-center text-gray-400 mb-2">
            <CircuitBoard className="h-4 w-4 mr-2" />
            <span className="font-medium text-white">{name}</span>
            <span className="mx-2">•</span>
            <span className="text-sm">ID: {id}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            <span>{new Date(createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            className="border-[#00E5E5] text-[#00E5E5] hover:bg-[#00E5E5]/10"
            onClick={() => {
              navigator.clipboard.writeText(`https://pcbdetect.com/results/${id}`)
              alert(`Share link copied: https://pcbdetect.com/results/${id}`)
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            className="bg-[#B347FF] hover:bg-[#B347FF]/80 text-white"
            onClick={() => {
              const reportData = [
                ["PCB Analysis Report"],
                ["ID", id],
                ["Name", name],
                ["Timestamp", new Date(createdAt).toLocaleString()],
                ["Defects", defectsCount.toString()],
                ["Severity", severity],
                ["Status", status],
              ]

              const csvContent = reportData.map((row) => row.join(",")).join("\n")
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
        <Badge className="bg-[#00E5E5]/10 text-[#00E5E5] border-[#00E5E5]/20">Status: {status}</Badge>
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Defects: {defectsCount}</Badge>
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Severity: {severity}</Badge>
      </div>
    </div>
  )
}

