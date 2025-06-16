import { Card, CardContent } from "@/components/ui/card"
import { CircuitBoard, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface StatsProps {
  stats: {
    analyzed: number
    defects: number
    detectionRate: number
    avgProcessingTime: number
  }
}

export function DashboardStats({ stats }: StatsProps) {
  const data = [
    {
      title: "PCBs Analyzed",
      value: stats.analyzed.toLocaleString(),
      change: "+12.5%", // can be calculated in backend later
      icon: <CircuitBoard className="h-5 w-5 text-[#00E5E5]" />,
      trend: "up",
    },
    {
      title: "Defects Detected",
      value: stats.defects.toString(),
      change: "-8.3%",
      icon: <AlertTriangle className="h-5 w-5 text-[#B347FF]" />,
      trend: "down",
    },
    {
      title: "Detection Rate",
      value: `${stats.detectionRate.toFixed(1)}%`,
      change: "+1.2%",
      icon: <CheckCircle className="h-5 w-5 text-[#00E5E5]" />,
      trend: "up",
    },
    {
      title: "Avg. Processing Time",
      value: `${stats.avgProcessingTime.toFixed(1)}s`,
      change: "-0.3s",
      icon: <Clock className="h-5 w-5 text-[#B347FF]" />,
      trend: "down",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {data.map((stat, index) => (
        <Card
          key={index}
          className="bg-[#1A2035] border-[#00E5E5]/20 hover:border-[#B347FF]/30 transition-all duration-300"
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className="p-2 bg-[#0F172A] rounded-md">{stat.icon}</div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1 transform rotate-180" />
              )}
              <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-green-500"}`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

