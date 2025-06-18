"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Layers } from "lucide-react"

type Defect = {
  id: number
  x: number
  y: number
  width: number
  height: number
  name: string
  confidence: number
}

interface DefectVisualizerProps {
  id: string
  imageUrl: string
  defects: Defect[]
}

export function DefectVisualizer({ id, imageUrl, defects }: DefectVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState("original")
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl || "/placeholder.svg?height=400&width=600"

    img.onload = () => {
      ctx.save()
      ctx.scale(zoom, zoom)
      ctx.drawImage(img, 0, 0, canvas.width / zoom, canvas.height / zoom)

      if (showBoundingBoxes && activeTab !== "gradcam") {
        defects.forEach((defect) => {
          ctx.strokeStyle = "#FF5733"
          ctx.lineWidth = 2 / zoom
          ctx.strokeRect(defect.x / zoom, defect.y / zoom, defect.width / zoom, defect.height / zoom)

          ctx.fillStyle = "#FF5733"
          ctx.font = `${12 / zoom}px sans-serif`
          ctx.fillText(`${defect.name} (${Math.round(defect.confidence * 100)}%)`, defect.x / zoom, defect.y / zoom - 5)
        })
      }

      if (activeTab === "gradcam") {
        defects.forEach((defect) => {
          const gradient = ctx.createRadialGradient(
            defect.x / zoom + defect.width / (2 * zoom),
            defect.y / zoom + defect.height / (2 * zoom),
            0,
            defect.x / zoom + defect.width / (2 * zoom),
            defect.y / zoom + defect.height / (2 * zoom),
            defect.width / zoom,
          )
          gradient.addColorStop(0, "rgba(255, 87, 51, 0.7)")
          gradient.addColorStop(0.7, "rgba(255, 165, 0, 0.5)")
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          ctx.fillStyle = gradient
          ctx.fillRect(
            defect.x / zoom - defect.width / (2 * zoom),
            defect.y / zoom - defect.height / (2 * zoom),
            (defect.width / zoom) * 2,
            (defect.height / zoom) * 2,
          )
        })
      }

      ctx.restore()
    }
  }, [activeTab, showBoundingBoxes, zoom, id, imageUrl, defects])

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5))
  const handleReset = () => setZoom(1)

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
              <Button variant="outline" size="icon" className="h-8 w-8 border-[#00E5E5]/30 text-[#00E5E5]" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 border-[#00E5E5]/30 text-[#00E5E5]" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 border-[#00E5E5]/30 text-[#00E5E5]" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-8 w-8 ${
                  showBoundingBoxes
                    ? "bg-[#FF5733]/10 border-[#FF5733] text-[#FF5733]"
                    : "border-[#00E5E5]/30 text-[#00E5E5]"
                }`}
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              >
                {showBoundingBoxes ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="relative bg-black rounded-md overflow-hidden">
            <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto" />
            <div className="absolute bottom-3 right-3 bg-[#0F172A]/80 text-white text-xs px-2 py-1 rounded flex items-center">
              <Layers className="h-3 w-3 mr-1" />
              {activeTab === "original"
                ? "Original Image"
                : activeTab === "defects"
                ? "Defect Detection"
                : "Explainable AI"}
              {zoom !== 1 && ` (${zoom}x)`}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
