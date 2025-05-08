"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Download, ExternalLink, Filter } from "lucide-react"
import Link from "next/link"

export function BatchResults() {
  const [filter, setFilter] = useState("all")

  // In a real app, this would come from a server/API
  const results = [
    {
      id: "result-1",
      name: "Motor_Driver_Board.jpg",
      timestamp: "2 hours ago",
      defects: 5,
      severity: "Critical",
      status: "Completed",
    },
    {
      id: "result-2",
      name: "LED_Controller.jpg",
      timestamp: "2 hours ago",
      defects: 2,
      severity: "Moderate",
      status: "Completed",
    },
    {
      id: "result-3",
      name: "Sensor_Array_v1.jpg",
      timestamp: "Yesterday",
      defects: 0,
      severity: "None",
      status: "Completed",
    },
    {
      id: "result-4",
      name: "Power_Supply_Unit_Rev2.jpg",
      timestamp: "Yesterday",
      defects: 1,
      severity: "Minor",
      status: "Completed",
    },
    {
      id: "result-5",
      name: "Main_Controller_PCB_v3.jpg",
      timestamp: "2 days ago",
      defects: 3,
      severity: "Critical",
      status: "Completed",
    },
  ]

  const filteredResults =
    filter === "all"
      ? results
      : filter === "defects"
        ? results.filter((r) => r.defects > 0)
        : results.filter((r) => r.defects === 0)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "Moderate":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "Minor":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "None":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-white">Batch Results</CardTitle>
        <Button
          variant="outline"
          className="border-[#B347FF] text-[#B347FF] hover:bg-[#B347FF]/10"
          onClick={() => {
            // Create a CSV file with the results data
            const headers = ["PCB Name", "Timestamp", "Defects", "Severity", "Status"]
            const csvContent = [
              headers.join(","),
              ...filteredResults.map((result) =>
                [result.name, result.timestamp, result.defects, result.severity, result.status].join(","),
              ),
            ].join("\n")

            // Create a blob and download it
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.setAttribute("href", url)
            link.setAttribute("download", "pcb_batch_results.csv")
            link.style.visibility = "hidden"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
            <TabsList className="bg-[#0F172A]">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
                All Results
              </TabsTrigger>
              <TabsTrigger value="defects" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
                With Defects
              </TabsTrigger>
              <TabsTrigger value="clean" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
                No Defects
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#00E5E5]/20">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">PCB Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Defects</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Severity</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No results match the selected filter
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <tr key={result.id} className="border-b border-[#00E5E5]/10 hover:bg-[#00E5E5]/5">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{result.name}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{result.timestamp}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {result.defects > 0 ? (
                          <AlertTriangle className="h-4 w-4 text-[#FF5733] mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        )}
                        <span className="text-white">{result.defects}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getSeverityColor(result.severity)} font-normal`}>{result.severity}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#00E5E5] hover:text-[#00E5E5] hover:bg-[#00E5E5]/10"
                          onClick={() => {
                            // Create a CSV file with this specific result
                            const headers = ["PCB Name", "Timestamp", "Defects", "Severity", "Status"]
                            const csvContent = [
                              headers.join(","),
                              [result.name, result.timestamp, result.defects, result.severity, result.status].join(","),
                            ].join("\n")

                            // Create a blob and download it
                            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement("a")
                            link.setAttribute("href", url)
                            link.setAttribute("download", `pcb_result_${result.id}.csv`)
                            link.style.visibility = "hidden"
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Link href={`/results/${result.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#B347FF] hover:text-[#B347FF] hover:bg-[#B347FF]/10"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

