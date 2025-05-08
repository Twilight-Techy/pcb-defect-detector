import { Navbar } from "@/components/navbar"
import { BatchUploader } from "@/components/batch/batch-uploader"
import { BatchQueue } from "@/components/batch/batch-queue"
import { BatchResults } from "@/components/batch/batch-results"
import { Footer } from "@/components/footer"

export default function BatchProcessing() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2 text-[#00E5E5]">Batch Processing</h1>
        <p className="text-gray-400 mb-8">Upload and analyze multiple PCB images simultaneously</p>

        <div className="space-y-8">
          <BatchUploader />
          <BatchQueue />
          <BatchResults />
        </div>
      </div>
      <Footer />
    </main>
  )
}

