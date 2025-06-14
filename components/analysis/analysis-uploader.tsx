"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Image, LinkIcon, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function AnalysisUploader() {
  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("")
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError("File size exceeds 20MB limit")
        return
      }

      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Please enter a valid URL")
      return
    }

    // Optional: Validate URL format
    try {
      new URL(url)
    } catch {
      setError("Invalid URL format")
      return
    }

    setIsLoading(true)

    try {
      // Attempt to fetch the image to ensure it exists
      const res = await fetch(url, { method: "HEAD" })
      const contentType = res.headers.get("content-type") || ""

      if (!res.ok || !contentType.startsWith("image/")) {
        throw new Error("URL must point to an image")
      }

      // If all good, set preview and clear file input
      setPreview(url)
      setFile(null)
    } catch (err: any) {
      console.error("Error fetching image:", err)
      setError("Failed to load image. Make sure the URL points to a valid image.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError("")

    try {
      let res

      if (file) {
        const formData = new FormData()
        const user = JSON.parse(localStorage.getItem("user")!)
        formData.append("file", file)
        formData.append("userId", user.id)

        res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        })
      } else if (url) {
        const user = JSON.parse(localStorage.getItem("user")!)
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: url, userId: user.id }),
        })
      } else {
        setError("No image selected or URL provided")
        setIsLoading(false)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      router.push(`/results/${data.predictionId}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30">
      <CardContent className="p-6">
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 bg-[#0F172A]">
            <TabsTrigger value="upload" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="url" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
              <LinkIcon className="h-4 w-4 mr-2" />
              Image URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-0">
            {!preview ? (
              <div
                className="border-2 border-dashed border-[#00E5E5]/50 rounded-lg p-12 text-center cursor-pointer transition-all duration-300 hover:border-[#00E5E5] hover:bg-[#00E5E5]/5"
                onClick={() => document.getElementById("pcb-file-upload")?.click()}
              >
                <input
                  id="pcb-file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
                <Image className="h-16 w-16 mx-auto mb-4 text-[#00E5E5]" />
                <h3 className="text-xl font-semibold mb-2 text-white">Upload PCB Image</h3>
                <p className="text-gray-400 mb-4">Click to browse or drag and drop</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, TIFF (Max: 20MB)</p>

                {error && (
                  <div className="mt-4 flex items-center justify-center text-red-500">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative border border-[#00E5E5]/50 rounded-lg overflow-hidden">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="PCB Preview"
                    className="w-full h-auto max-h-[400px] object-contain bg-black"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
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
                    {isLoading ? "Processing..." : "Analyze PCB"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="mt-0">
            <form onSubmit={handleUrlSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image-url" className="text-white">
                  Image URL
                </Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/pcb-image.jpg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-[#0F172A] border-[#00E5E5]/30 focus:border-[#00E5E5] focus:ring-[#00E5E5]"
                />

                {error && (
                  <div className="flex items-center text-red-500">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {preview && (
                <div className="relative border border-[#00E5E5]/50 rounded-lg overflow-hidden">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="PCB Preview"
                    className="w-full h-auto max-h-[400px] object-contain bg-black"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {!preview ? (
                  <Button type="submit" className="bg-[#00E5E5] hover:bg-[#00E5E5]/80 text-black" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Load Image"}
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#00E5E5] text-[#00E5E5] hover:bg-[#00E5E5]/10"
                      onClick={() => {
                        setUrl("")
                        setPreview(null)
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#B347FF] hover:bg-[#B347FF]/80 text-white font-semibold"
                      onClick={handleAnalyze}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Analyze PCB"}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

