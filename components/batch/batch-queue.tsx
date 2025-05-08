"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertTriangle, Loader2, XCircle, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function BatchQueue() {
  // In a real app, this would come from a server/API
  const [queueItems, setQueueItems] = useState([
    {
      id: "batch-1",
      name: "Main_Controller_PCB.jpg",
      status: "processing",
      progress: 65,
    },
    {
      id: "batch-2",
      name: "Power_Supply_Unit.jpg",
      status: "queued",
      progress: 0,
    },
    {
      id: "batch-3",
      name: "Sensor_Array_v2.jpg",
      status: "queued",
      progress: 0,
    },
    {
      id: "batch-4",
      name: "LED_Controller.jpg",
      status: "completed",
      progress: 100,
      result: { defects: 2, severity: "Moderate" },
    },
    {
      id: "batch-5",
      name: "Motor_Driver_Board.jpg",
      status: "failed",
      progress: 30,
      error: "Image resolution too low for accurate analysis",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <Clock className="h-5 w-5 text-gray-400" />
      case "processing":
        return <Loader2 className="h-5 w-5 text-[#00E5E5] animate-spin" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "queued":
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Queued</Badge>
      case "processing":
        return <Badge className="bg-[#00E5E5]/10 text-[#00E5E5] border-[#00E5E5]/20">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>
      default:
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Unknown</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Critical</Badge>
      case "Moderate":
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Moderate</Badge>
      case "Minor":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Minor</Badge>
      case "None":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">No Defects</Badge>
      default:
        return null
    }
  }

  // Simulate refreshing the queue
  const refreshQueue = () => {
    // In a real app, this would fetch the latest queue from the server
    setQueueItems((prev) => {
      return prev.map((item) => {
        if (item.status === "processing") {
          const newProgress = Math.min(item.progress + 15, 100)
          return {
            ...item,
            progress: newProgress,
            status: newProgress === 100 ? "completed" : "processing",
            result: newProgress === 100 ? { defects: Math.floor(Math.random() * 3), severity: "Moderate" } : undefined,
          }
        }
        if (item.status === "queued" && prev.filter((i) => i.status === "processing").length < 2) {
          return { ...item, status: "processing", progress: 10 }
        }
        return item
      })
    })
  }

  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-white">Processing Queue</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="border-[#00E5E5] text-[#00E5E5] hover:bg-[#00E5E5]/10"
          onClick={refreshQueue}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {queueItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No items in the processing queue</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queueItems.map((item) => (
              <div key={item.id} className="bg-[#0F172A] rounded-lg p-4 border border-[#00E5E5]/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center">
                    {getStatusIcon(item.status)}
                    <span className="ml-2 font-medium text-white">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(item.status)}
                    {item.status === "completed" && item.result && getSeverityBadge(item.result.severity)}
                  </div>
                </div>

                {item.status === "processing" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Processing...</span>
                      <span className="text-[#00E5E5]">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-1.5 bg-[#1A2035]" indicatorClassName="bg-[#00E5E5]" />
                  </div>
                )}

                {item.status === "completed" && item.result && (
                  <div className="text-sm text-gray-300 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                    <span>{item.result.defects} defects detected</span>
                    <Button
                      variant="link"
                      className="text-[#B347FF] p-0 h-auto ml-2"
                      onClick={() => {
                        // Navigate to results page
                        window.location.href = `/results/${item.id}`
                      }}
                    >
                      View Results
                    </Button>
                  </div>
                )}

                {item.status === "failed" && item.error && (
                  <div className="text-sm text-red-400">Error: {item.error}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

