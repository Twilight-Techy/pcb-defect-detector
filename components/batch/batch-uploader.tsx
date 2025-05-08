"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function BatchUploader() {
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

  const handleUpload = () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload")
      return
    }

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          // Wait a moment before resetting the UI
          setTimeout(() => {
            setUploading(false)
            setFiles([])
            // In a real app, we would process the files here and update the queue
          }, 500)

          return 100
        }
        return prev + 5
      })
    }, 200)
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

