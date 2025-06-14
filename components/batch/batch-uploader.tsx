"use client"

import type React from "react"

import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { QueueItem } from "./batch-queue"
import { set } from "react-hook-form"

type batchUploaderProps = {
  queueItems: QueueItem[]
  setQueueItems: Dispatch<SetStateAction<QueueItem[]>>
  setBatchResults: Dispatch<SetStateAction<QueueItem[]>>
}

export function BatchUploader({
  queueItems,
  setQueueItems,
  setBatchResults
}: batchUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

      if (newFiles.length === 0) {
        setError("Please upload image files only")
        return
      }

      // Check file sizes
      const oversizedFiles = newFiles.filter((file) => file.size > 20 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        setError(`${oversizedFiles.length} file(s) exceed the 20MB size limit`)
        return
      }

      setFiles((prev) => [...prev, ...newFiles])
      setError("")
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))

      if (newFiles.length === 0) {
        setError("Please upload image files only")
        return
      }

      // Check file sizes
      const oversizedFiles = newFiles.filter((file) => file.size > 20 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        setError(`${oversizedFiles.length} file(s) exceed the 20MB size limit`)
        return
      }

      setFiles((prev) => [...prev, ...newFiles])
      setError("")
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError("")

    const currentUser = JSON.parse(localStorage.getItem("user")!)
    const total = files.length
    const results: { fileName: string; predictionId?: string; error?: string }[] = []

    // Step 1: Add all files to queue as "queued"
    const newQueueItems: QueueItem[] = files.map((file) => ({
      id: `batch-${Date.now()}-${file.name}`,
      name: file.name,
      status: "Queued",
      progress: 0,
    }))
    setQueueItems((prev) => [...prev, ...newQueueItems])

    for (let i = 0; i < total; i++) {
      const file = files[i]
      const fileId = newQueueItems[i].id

      // Update status to "processing"
      setQueueItems((prev) =>
        prev.map((item) =>
          item.id === fileId ? { ...item, status: "Processing", progress: 10 } : item
        )
      )

      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", currentUser.id)

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        })

        const contentType = response.headers.get("Content-Type")
        
        const data = await response.json()

        if (!contentType || contentType.includes("application/json")) {
          throw new Error("Invalid response format!")
        }

        if (!response.ok) {
          const error = (data as any).error || "Upload failed"
          results.push({ fileName: file.name, error })

          setQueueItems((prev) =>
            prev.map((item) =>
              item.id === fileId ? { ...item, status: "Failed", progress: 100, error } : item
            )
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
              timestamp: new Date().toLocaleString(),
            },
          ])
        } else {
          const predictionId = (data as any).predictionId
          results.push({ fileName: file.name, predictionId })

          setQueueItems((prev) =>
            prev.map((item) =>
              item.id === fileId
                ? {
                    ...item,
                    status: "Completed",
                    progress: 100,
                    result: {
                      defects: (data as any).defectCount || 0,
                      severity: (data as any).severity || "Unknown",
                    },
                  }
                : item
            )
          )

          setBatchResults((prev) => [
            ...prev,
            {
              id: data.predictionId,
              name: file.name,
              status: "Completed",
              progress: 100,
              result: {
                defects: (data as any).defectCount || 0,
                severity: (data as any).severity || "Unknown",
              },
              timestamp: new Date().toLocaleString(),
            },
          ])
        }
      } catch (err: any) {
        results.push({ fileName: file.name, error: err.message || "Network error" })

        setQueueItems((prev) =>
          prev.map((item) =>
            item.id === fileId ? { ...item, status: "Failed", progress: 100, error: err.message } : item
          )
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

      setUploadProgress(Math.round(((i + 1) / total) * 100))
    }

    setTimeout(() => {
      setUploading(false)
      setFiles([])
      console.log("Batch results:", results)

      const failed = results.filter((r) => r.error)
      const success = results.filter((r) => r.predictionId)

      if (failed.length === 0) {
        toast.success(`All ${total} images analyzed successfully!`)
      } else {
        toast.warning(`${success.length} succeeded, ${failed.length} failed.`)
        console.table(results)
      }

      // Optional: emit results to <BatchResults /> etc.
    }, 500)
  }

  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-white">Upload PCB Images</CardTitle>
      </CardHeader>
      <CardContent>
        {!uploading ? (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 mb-4 ${
                isDragging
                  ? "border-[#B347FF] bg-[#B347FF]/5"
                  : "border-[#00E5E5]/50 hover:border-[#00E5E5] hover:bg-[#00E5E5]/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("batch-file-upload")?.click()}
            >
              <input
                id="batch-file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileInput}
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-[#00E5E5]" />
              <h3 className="text-lg font-semibold mb-2 text-white">Drag & Drop Multiple PCB Images</h3>
              <p className="text-gray-400 mb-2">or click to browse files</p>
              <p className="text-sm text-gray-500">Supports JPG, PNG, TIFF (Max: 20MB per file)</p>
            </div>

            {error && (
              <div className="flex items-center text-red-500 mb-4 p-2 bg-red-500/10 rounded">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {files.length > 0 && (
              <div className="space-y-4 mb-4">
                <h3 className="text-white font-medium">Selected Files ({files.length})</h3>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#0F172A] p-3 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-[#00E5E5] mr-3" />
                        <div>
                          <p className="text-white text-sm truncate max-w-[200px] md:max-w-md">{file.name}</p>
                          <p className="text-gray-400 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                className="border-[#00E5E5] text-[#00E5E5] hover:bg-[#00E5E5]/10"
                onClick={() => setFiles([])}
                disabled={files.length === 0}
              >
                Clear All
              </Button>
              <Button
                className="bg-[#B347FF] hover:bg-[#B347FF]/80 text-white"
                onClick={handleUpload}
                disabled={files.length === 0}
              >
                Process Batch ({files.length})
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Uploading {files.length} files...</span>
                <span className="text-[#00E5E5]">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2 bg-[#0F172A]" indicatorClassName="bg-[#00E5E5]" />
            </div>
            <p className="text-gray-400 text-sm">
              Please wait while your files are being uploaded and queued for processing.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

