import { Search, AlertTriangle, Lightbulb, Zap, BarChart4, Wrench } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Search className="h-10 w-10 text-[#00E5E5]" />,
      title: "Precise Detection",
      description:
        "Advanced deep learning models identify soldering errors, misaligned components, and shorts with high accuracy.",
    },
    {
      icon: <AlertTriangle className="h-10 w-10 text-[#B347FF]" />,
      title: "Multi-Stage Assessment",
      description: "Classify defects by severity (critical, minor, tolerable) to prioritize repairs efficiently.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-[#00E5E5]" />,
      title: "Explainable AI",
      description: "Grad-CAM visualization shows why the model flagged certain areas, building trust in AI decisions.",
    },
    {
      icon: <Zap className="h-10 w-10 text-[#B347FF]" />,
      title: "Real-time Analysis",
      description: "Get instant results with our optimized processing pipeline for high-resolution PCB images.",
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-[#00E5E5]" />,
      title: "Detailed Reports",
      description: "Comprehensive analytics on defect types, locations, and historical trends for quality improvement.",
    },
    {
      icon: <Wrench className="h-10 w-10 text-[#B347FF]" />,
      title: "Repair Suggestions",
      description: "AI-powered recommendations for fixing detected defects based on type and severity.",
    },
  ]

  return (
    <section className="py-20 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Advanced <span className="text-[#B347FF]">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our PCB defect detection system combines cutting-edge AI with practical engineering solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1A2035] rounded-lg p-6 border border-[#00E5E5]/20 hover:border-[#B347FF]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(179,71,255,0.15)]"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

