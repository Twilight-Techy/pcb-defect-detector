import { Navbar } from "@/components/navbar"
import { ResultsHeader } from "@/components/results/results-header"
import { DefectVisualizer } from "@/components/results/defect-visualizer"
import { DefectList } from "@/components/results/defect-list"
import { ExplainableAI } from "@/components/results/explainable-ai"
import { RepairSuggestions } from "@/components/results/repair-suggestions"
import { Footer } from "@/components/footer"

export default function Results({ params }: { params: { id: string } }) {
  // In a real app, we would fetch results data based on the ID
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ResultsHeader id={params.id} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DefectVisualizer id={params.id} />
          <div className="space-y-8">
            <DefectList id={params.id} />
            <ExplainableAI id={params.id} />
          </div>
        </div>
        <RepairSuggestions id={params.id} />
      </div>
      <Footer />
    </main>
  )
}

