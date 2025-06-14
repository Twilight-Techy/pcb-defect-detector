"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { UploadCloud } from "lucide-react"
import { QueueItem } from "./batch-queue"

type Props = {
  queueItems: QueueItem[]
  setQueueItems: React.Dispatch<React.SetStateAction<QueueItem[]>>
  setBatchResults: React.Dispatch<React.SetStateAction<QueueItem[]>>
}

export function BatchUploader({ queueItems, setQueueItems, setBatchResults }: Props) {
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newQueueItems: QueueItem[] = Array.from(files).map((file) => ({
      id: `batch-${Date.now()}-${file.name}`,
      name: file.name,
      status: "Queued",
      progress: 0,
    }))
    setQueueItems((prev) => [...prev, ...newQueueItems])

    for (const file of files) {
      const formData = new FormData()
      formData.append("image", file)

      const itemId = `batch-${Date.now()}-${file.name}`

      // Set status to processing
      setQueueItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: "Processing", progress: 30 } : item,
        ),
      )

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        const timestamp = new Date().toLocaleString()

        if (!response.ok) {
          setQueueItems((prev) =>
            prev.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    status: "Failed",
                    progress: 100,
                    error: data?.error || "Unknown error",
                  }
                : item,
            ),
          )

          setBatchResults((prev) => [
            ...prev,
            {
              id: `fail-${Date.now()}-${file.name}`,
              name: file.name,
              status: "Failed",
              progress: 100,
              error: data?.error || "Unknown error",
              result: {
                defects: 0,
                severity: "None",
              },
              timestamp,
            },
          ])
        } else {
          const defects = data.defects ?? 0
          const severity = data.severity ?? "None"

          setQueueItems((prev) =>
            prev.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    status: "Completed",
                    progress: 100,
                    result: { defects, severity },
                  }
                : item,
            ),
          )

          setBatchResults((prev) => [
            ...prev,
            {
              id: data.predictionId,
              name: file.name,
              status: "Completed",
              progress: 100,
              result: {
                defects,
                severity,
              },
              timestamp,
            },
          ])
        }
      } catch (err) {
        console.error(err)
        setQueueItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, status: "Failed", progress: 100, error: "Upload error" }
              : item,
          ),
        )

        setBatchResults((prev) => [
          ...prev,
          {
            id: `fail-${Date.now()}-${file.name}`,
            name: file.name,
            status: "Failed",
            progress: 100,
            error: "Upload error",
            result: {
              defects: 0,
              severity: "None",
            },
            timestamp: new Date().toLocaleString(),
          },
        ])
      }
    }
  }

  return (
    <div className="space-y-4">
      <label className="cursor-pointer">
        <input type="file" accept="image/*" multiple hidden onChange={handleUpload} />
        <Button variant="outline" className="border-[#00E5E5] text-[#00E5E5] hover:bg-[#00E5E5]/10">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload PCB Images
        </Button>
      </label>

      {queueItems.length > 0 && (
        <div className="space-y-3">
          {queueItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#1A2035] border border-[#00E5E5]/20 rounded-md px-4 py-2 text-white"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-400 capitalize">{item.status}</div>
              </div>
              <Progress value={item.progress} className="h-2 bg-[#0F172A]" />
              {item.status === "Failed" && item.error && (
                <p className="text-sm text-red-500 mt-1">{item.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
