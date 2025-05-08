"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

export function RecentScans() {
  const scans = [
    {
      id: "scan-123",
      name: "Main Controller PCB",
      timestamp: "2 hours ago",
      defects: 3,
      severity: "Critical",
      status: "Completed",
    },
    {
      id: "scan-122",
      name: "Power Supply Unit",
      timestamp: "5 hours ago",
      defects: 1,
      severity: "Minor",
      status: "Completed",
    },
    {
      id: "scan-121",
      name: "Sensor Array v2",
      timestamp: "Yesterday",
      defects: 0,
      severity: "None",
      status: "Completed",
    },
    {
      id: "scan-120",
      name: "LED Controller",
      timestamp: "Yesterday",
      defects: 2,
      severity: "Moderate",
      status: "Completed",
    },
    {
      id: "scan-119",
      name: "Motor Driver Board",
      timestamp: "2 days ago",
      defects: 5,
      severity: "Critical",
      status: "Completed",
    },
  ]

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
    <Card className="bg-[#1A2035] border-[#00E5E5]/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-white">Recent Scans</CardTitle>
        <Button
          variant="ghost"
          className="text-[#B347FF] hover:text-[#B347FF] hover:bg-[#B347FF]/10"
          onClick={() => {
            // Navigate to a page with all scans
            window.location.href = "/batch"
          }}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#00E5E5]/20">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">PCB Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Defects</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Severity</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id} className="border-b border-[#00E5E5]/10 hover:bg-[#00E5E5]/5">
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{scan.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-400">{scan.timestamp}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {scan.defects > 0 ? (
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      <span className="text-white">{scan.defects}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`${getSeverityColor(scan.severity)} font-normal`}>{scan.severity}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="bg-[#00E5E5]/10 text-[#00E5E5] border-[#00E5E5]/20 font-normal">
                      {scan.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/results/${scan.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#B347FF] hover:text-[#B347FF] hover:bg-[#B347FF]/10"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

