import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ExplainableAI({ id }: { id: string }) {
  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-white">Explainable AI</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="bg-[#0F172A] mb-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
              Technical
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="p-4 bg-[#0F172A] rounded-lg border border-[#00E5E5]/20">
              <p className="text-gray-300 mb-3">
                The AI model has identified 3 defects on this PCB with high confidence. The Grad-CAM visualization
                highlights areas where the model focused its attention to make these determinations.
              </p>
              <p className="text-gray-300">
                The most critical issues are the solder bridge between R12-C15 and the missing microcontroller at U3,
                which would prevent proper functioning of the circuit. The misaligned capacitor at C22 is less critical
                but should be addressed.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="mt-0">
            <div className="p-4 bg-[#0F172A] rounded-lg border border-[#00E5E5]/20">
              <p className="text-gray-300 mb-3">Model: PCBDefectNet-v3 (YOLOv8 architecture)</p>
              <p className="text-gray-300 mb-3">
                The model analyzed 142 features across 5 convolutional layers to identify defect patterns. Grad-CAM
                visualization shows activation in layer 4 where the model detected anomalies in solder joint geometry
                and component placement.
              </p>
              <p className="text-gray-300">
                Confidence scores are calculated using a combination of IoU (Intersection over Union) metrics and class
                probability distributions from the final detection head.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

