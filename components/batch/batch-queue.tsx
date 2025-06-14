"use client"

import { type Dispatch, type SetStateAction } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertTriangle, Loader2, XCircle, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export type QueueItem = {
  id: string
  name: string
  status: "Queued" | "Processing" | "Completed" | "Failed"
  progress: number
  error?: string
  result?: {
    defects: number
    severity: "Critical" | "Moderate" | "Minor" | "None"
  }
  timestamp?: string
}

type BatchQueueProps = {
  queueItems: QueueItem[]
  setQueueItems: Dispatch<SetStateAction<QueueItem[]>>
}

export function BatchQueue({ queueItems, setQueueItems }: BatchQueueProps) {
  const getStatusIcon = (status: QueueItem["status"]) => {
    switch (status) {
      case "Queued":
        return <Clock className="h-5 w-5 text-gray-400" />
      case "Processing":
        return <Loader2 className="h-5 w-5 text-[#00E5E5] animate-spin" />
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: QueueItem["status"]) => {
    switch (status) {
      case "Queued":
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Queued</Badge>
      case "Processing":
        return <Badge className="bg-[#00E5E5]/10 text-[#00E5E5] border-[#00E5E5]/20">Processing</Badge>
      case "Completed":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
      case "Failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>
      default:
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Unknown</Badge>
    }
  }

  const getSeverityBadge = (severity?: string) => {
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

  const refreshQueue = () => {
    setQueueItems((prev) =>
      prev.map((item) => {
        if (item.status === "Processing") {
          const newProgress = Math.min(item.progress + 10, 100)
          return {
            ...item,
            progress: newProgress,
            status: newProgress === 100 ? "Completed" : "Processing",
            result: newProgress === 100
              ? {
                  defects: Math.floor(Math.random() * 3),
                  severity: ["None", "Minor", "Moderate", "Critical"][
                    Math.floor(Math.random() * 4)
                  ] as "None" | "Minor" | "Moderate" | "Critical",
                }
              : item.result,
          }
        }
        return item
      })
    )
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
                    {item.status === "Completed" && getSeverityBadge(item.result?.severity)}
                  </div>
                </div>

                {item.status === "Processing" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Processing...</span>
                      <span className="text-[#00E5E5]">{item.progress}%</span>
                    </div>
                    <Progress
                      value={item.progress}
                      className="h-1.5 bg-[#1A2035]"
                      indicatorClassName="bg-[#00E5E5]"
                    />
                  </div>
                )}

                {item.status === "Completed" && item.result && (
                  <div className="text-sm text-gray-300 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                    <span>{item.result.defects} defects detected</span>
                    <Button
                      variant="link"
                      className="text-[#B347FF] p-0 h-auto ml-2"
                      onClick={() => {
                        window.location.href = `/results/${item.id}`
                      }}
                    >
                      View Results
                    </Button>
                  </div>
                )}

                {item.status === "Failed" && item.error && (
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
