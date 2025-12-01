"use client"

import { Navbar } from "@/components/navbar"
import { BatchUploader } from "@/components/batch/batch-uploader"
import { BatchQueue, QueueItem } from "@/components/batch/batch-queue"
import { BatchResults } from "@/components/batch/batch-results"
import { Footer } from "@/components/footer"
import { useState } from "react"

export default function BatchProcessing() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [batchResults, setBatchResults] = useState<QueueItem[]>([])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2 text-[#00E5E5]">LASU Detect Batch Processing</h1>
        <p className="text-gray-400 mb-8">Upload and analyze multiple PCB images simultaneously</p>

        <div className="space-y-8">
          <BatchUploader
            queueItems={queueItems}
            setQueueItems={setQueueItems}
            setBatchResults={setBatchResults}
          />
          <BatchQueue queueItems={queueItems} setQueueItems={setQueueItems} />
          <BatchResults results={batchResults.map(r => ({
      ...r,
      status: "Completed", // if not already
    }))} />
        </div>
      </div>
      <Footer />
    </main>
  )
}

