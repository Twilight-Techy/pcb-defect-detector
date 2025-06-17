"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function UploadSection() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return
    setIsLoading(true)

    const user = JSON.parse(localStorage.getItem("user")!)
    if (!user || !user.id) {
      toast.error("You must be logged in to analyze a PCB image")
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", user.id)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })
      let data: any = {};
      const contentType = res.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        toast.error(data.error || data.message || "Something went wrong1")
      } else {
        toast.success("Analysis completed successfully!")
        console.log("Redirecting to:", `/results/${data.predictionId}`)
        router.push(`/results/${data.predictionId}`)
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Analysis failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Upload Your <span className="text-[#00E5E5]">PCB Image</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Drag and drop or select a high-resolution image of your PCB for instant AI analysis
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {!preview ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-[#B347FF] bg-[#B347FF]/5"
                  : "border-[#00E5E5]/50 hover:border-[#00E5E5] hover:bg-[#00E5E5]/5"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
              <Upload className="h-16 w-16 mx-auto mb-4 text-[#00E5E5]" />
              <h3 className="text-xl font-semibold mb-2 text-white">Drag & Drop PCB Image</h3>
              <p className="text-gray-400 mb-4">or click to browse files</p>
              <p className="text-sm text-gray-500">Supports JPG, PNG, TIFF (Max: 20MB)</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative border border-[#00E5E5]/50 rounded-lg overflow-hidden">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="PCB Preview"
                  className="w-full h-auto max-h-[400px] object-contain bg-black"
                />
                <div className="absolute top-4 right-4 bg-[#1A2035] rounded-full p-2">
                  <CheckCircle className="h-6 w-6 text-[#B347FF]" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-[#00E5E5] text-[#00E5E5] hover:bg-[#00E5E5]/10"
                  onClick={() => {
                    setFile(null)
                    setPreview(null)
                  }}
                >
                  Choose Different Image
                </Button>
                <Button
                  className="bg-[#B347FF] hover:bg-[#B347FF]/80 text-white font-semibold"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze PCB"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

