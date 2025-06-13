import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, AlertOctagon } from "lucide-react"

export interface Defect {
  id: number
  type: string
  location: string
  severity: string
  confidence: number
  description: string
}

interface DefectListProps {
  id: string
  defects: Defect[]
}

export function DefectList({ id, defects }: DefectListProps) {

  if (!defects || defects.length === 0) {
    return (
      <Card className="bg-[#1A2035] border-[#00E5E5]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-white">Detected Defects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-[#0F172A] rounded-lg border border-[#00E5E5]/20">
            <p className="text-gray-400">No defects detected.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <AlertOctagon className="h-5 w-5 text-red-500" />
      case "Moderate":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "Minor":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "Moderate":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "Minor":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-white">Detected Defects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {defects.map((defect) => (
            <div
              key={defect.id}
              className="p-4 bg-[#0F172A] rounded-lg border border-[#00E5E5]/20 transition hover:scale-[1.01] hover:border-[#00E5E5]/40"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  {getSeverityIcon(defect.severity)}
                  <h3 className="text-lg font-semibold text-white ml-2">{defect.type}</h3>
                </div>
                <Badge className={getSeverityColor(defect.severity)}>{defect.severity}</Badge>
              </div>

              <div className="mb-2">
                <span className="text-gray-400 text-sm">Location: </span>
                <span className="text-white">{defect.location || "Unknown"}</span>
              </div>

              <div className="mb-3">
                <span className="text-gray-400 text-sm">Description: </span>
                <span className="text-white">{defect.description || "No description available"}</span>
              </div>

              <div className="w-full bg-[#1A2035] rounded-full h-1.5">
                <div
                  className="bg-[#B347FF] h-1.5 rounded-full"
                  style={{ width: `${defect.confidence * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-400 mt-1">
                Confidence: {Math.round(defect.confidence * 100)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
