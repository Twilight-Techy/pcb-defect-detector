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

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Please enter a valid URL")
      return
    }

    // In a real app, we would validate the URL and fetch the image
    // For now, we'll just simulate loading and success
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Use a placeholder image for demo
      setPreview("/placeholder.svg?height=400&width=600")
      setFile(null) // Not a real file, but we're using a URL
    }, 1500)
  }

  const handleAnalyze = () => {
    // In a real app, we would upload the file to the server
    // For now, we'll just navigate to a mock results page
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/results/demo-123")
    }, 2000)
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

