"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Layers } from "lucide-react"

interface DefectVisualizerProps {
  id: string
  imageUrl: string
  labelVisualizationUrl: string
  dotVisualizationUrl: string
}

export function DefectVisualizer({
  id,
  imageUrl,
  labelVisualizationUrl,
  dotVisualizationUrl,
}: DefectVisualizerProps) {
  const [activeTab, setActiveTab] = useState("original")
  const [zoom, setZoom] = useState(1)
  const [showOverlay, setShowOverlay] = useState(true)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5))
  const handleReset = () => setZoom(1)

  const getImageForTab = () => {
    if (activeTab === "defects") return labelVisualizationUrl
    if (activeTab === "gradcam") return dotVisualizationUrl
    return imageUrl
  }

  const currentImage = getImageForTab()

  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30">
      <CardContent className="p-6">
        <Tabs defaultValue="original" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-[#0F172A]">
              <TabsTrigger value="original" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
                Original
              </TabsTrigger>
              <TabsTrigger value="defects" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
                Defects
              </TabsTrigger>
              <TabsTrigger value="gradcam" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
                Grad-CAM
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#00E5E5]/30 text-[#00E5E5]"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#00E5E5]/30 text-[#00E5E5]"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#00E5E5]/30 text-[#00E5E5]"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-8 w-8 ${
                  showOverlay
                    ? "bg-[#FF5733]/10 border-[#FF5733] text-[#FF5733]"
                    : "border-[#00E5E5]/30 text-[#00E5E5]"
                }`}
                onClick={() => setShowOverlay(!showOverlay)}
                title="Toggle overlay visibility"
              >
                {showOverlay ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="relative bg-black rounded-md overflow-hidden">
            <img
              src={currentImage}
              alt={`${activeTab} visualization`}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                display: showOverlay ? "block" : "none",
              }}
              className="block max-w-full h-auto"
            />

            <div className="absolute bottom-3 right-3 bg-[#0F172A]/80 text-white text-xs px-2 py-1 rounded flex items-center">
              <Layers className="h-3 w-3 mr-1" />
              {activeTab === "original"
                ? "Original Image"
                : activeTab === "defects"
                ? "Bounding Box Visualization"
                : activeTab === "gradcam"
                ? "Grad-CAM Visualization"
                : "Explainable AI"}
              {zoom !== 1 && ` (${zoom}x)`}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
