"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench, Lightbulb, ArrowRight, Download } from "lucide-react"

interface RepairSuggestion {
  defectId: number
  defectType: string
  suggestions: string[]
  toolsNeeded: string[]
  estimatedTime: string
}

interface RepairSuggestionsProps {
  id: string
  repairs: RepairSuggestion[]
}

export function RepairSuggestions({ id, repairs }: RepairSuggestionsProps) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(repairs, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "repair_guide.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!repairs || repairs.length === 0) {
    repairs = [
      {
        defectId: 0,
        defectType: "No Repairs Needed",
        suggestions: ["No repairs are required for this PCB."],
        toolsNeeded: [],
        estimatedTime: "N/A",
      },
    ] // Fallback for no repairs 
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
