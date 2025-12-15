import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-[#0F172A] py-20">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Glowing orb effect */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#00E5E5] rounded-full filter blur-[150px] opacity-20"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#B347FF] rounded-full filter blur-[150px] opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00E5E5] to-[#B347FF]">
            LASU PCB Defect Detector
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Detect, analyze, and fix PCB defects with advanced AI technology. Our system provides explainable results,
            severity classification, and automated repair suggestions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/analyze">
              <Button className="bg-[#00E5E5] hover:bg-[#00E5E5]/80 text-black font-medium px-8 py-6 text-lg">
                Start Analyzing
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-[#B347FF] text-[#B347FF] hover:bg-[#B347FF]/10 px-8 py-6 text-lg"
              >
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

