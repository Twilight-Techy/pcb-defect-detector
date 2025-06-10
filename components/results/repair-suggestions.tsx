"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench, Lightbulb, ArrowRight, Download } from "lucide-react"

export function RepairSuggestions({ id }: { id: string }) {
  // Mock repair data - in a real app, this would come from the API
  const repairs = [
    {
      defectId: 1,
      defectType: "Solder Bridge",
      suggestions: [
        "Use a soldering iron with a fine tip and flux to carefully remove the excess solder",
        "Apply desoldering braid to wick away the bridging solder",
        "Clean the area with isopropyl alcohol after repair to remove flux residue",
      ],
      toolsNeeded: ["Fine-tip soldering iron", "Flux", "Desoldering braid", "Isopropyl alcohol"],
      estimatedTime: "5-10 minutes",
    },
    {
      defectId: 2,
      defectType: "Missing Component",
      suggestions: [
        "Verify the BOM (Bill of Materials) to confirm the correct component (U3 - Microcontroller)",
        "Check for the component in the pick-and-place machine's feeders or in inventory",
        "Place and solder the component according to the orientation marked on the PCB",
      ],
      toolsNeeded: ["Tweezers", "Soldering iron", "Solder paste", "Magnifying glass"],
      estimatedTime: "15-20 minutes",
    },
    {
      defectId: 3,
      defectType: "Misalignment",
      suggestions: [
        "Carefully reheat the solder joints of capacitor C22",
        "Use tweezers to adjust the component while the solder is molten",
        "Allow to cool without disturbance to ensure proper alignment",
      ],
      toolsNeeded: ["Soldering iron", "Tweezers", "Magnifying glass"],
      estimatedTime: "3-5 minutes",
    },
  ]

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(repairs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "repair_guide.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30 mb-8">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Wrench className="h-5 w-5 text-[#B347FF] mr-2" />
            Repair Suggestions
          </CardTitle>
          <Button onClick={handleExport} variant="outline" className="border-[#B347FF] text-[#B347FF] hover:bg-[#B347FF]/10">
            <Download className="h-4 w-4 mr-2" />
            Export Repair Guide
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={repairs[0].defectId.toString()}>
          <TabsList className="bg-[#0F172A] mb-4">
            {repairs.map((repair) => (
              <TabsTrigger
                key={repair.defectId}
                value={repair.defectId.toString()}
                className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black"
              >
                {repair.defectType}
              </TabsTrigger>
            ))}
          </TabsList>

          {repairs.map((repair) => (
            <TabsContent key={repair.defectId} value={repair.defectId.toString()} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0F172A] rounded-lg border border-[#00E5E5]/20">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Lightbulb className="h-5 w-5 text-[#B347FF] mr-2" />
                    Repair Steps
                  </h3>
                  <ol className="space-y-3 pl-6 list-decimal">
                    {repair.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-300">
                        {suggestion}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="p-4 bg-[#0F172A] rounded-lg border border-[#00E5E5]/20">
                  <h3 className="text-lg font-semibold text-white mb-3">Required Tools</h3>
                  <ul className="space-y-2">
                    {repair.toolsNeeded.map((tool, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <ArrowRight className="h-4 w-4 text-[#B347FF] mr-2" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-[#00E5E5]/20">
                    <span className="text-gray-400">Estimated repair time: </span>
                    <span className="text-white font-medium">{repair.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

