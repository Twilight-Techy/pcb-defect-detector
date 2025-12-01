import { Navbar } from "@/components/navbar"
import { AnalysisUploader } from "@/components/analysis/analysis-uploader"
import { Footer } from "@/components/footer"

export default function Analyze() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8 text-[#00E5E5]">LASU Detect PCB Analysis</h1>
        <AnalysisUploader />
      </div>
      <Footer />
    </main>
  )
}

