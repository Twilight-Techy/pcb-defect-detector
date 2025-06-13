import { Navbar } from "@/components/navbar"
import { ResultsHeader } from "@/components/results/results-header"
import { DefectVisualizer } from "@/components/results/defect-visualizer"
import { DefectList } from "@/components/results/defect-list"
import { ExplainableAI } from "@/components/results/explainable-ai"
import { RepairSuggestions } from "@/components/results/repair-suggestions"
import { Footer } from "@/components/footer"

export default async function Results({ params }: { params: { id: string } }) {
  // In a real app, we would fetch results data based on the ID
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/results/${params.id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    // Handle error, e.g., redirect to a 404 page or show an error message
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Results Not Found</h1>
          <p className="mt-4">The results for this ID do not exist or have been deleted.</p>
        </div>
      </main>
    )
  }

  const prediction = await res.json()

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ResultsHeader
          id={prediction.id}
          name={"Main Controller PCB"} // you can change this to a prediction-level name field if available
          createdAt={prediction.createdAt}
          defectsCount={prediction.defects.length}
          severity={
            prediction.defects.length > 5
              ? "Critical"
              : prediction.defects.length > 3
              ? "High"
              : prediction.defects.length > 1
              ? "Medium"
              : prediction.defects.length === 0
              ? "Low"
              : "Medium"
          }
          status={"Completed"} // could also be dynamic based on prediction status if available
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DefectVisualizer
            id={params.id}
            imageUrl={prediction.imageUrl}
            defects={prediction.defects}
          />
          <div className="space-y-8">
            <DefectList
              id={params.id}
              defects={prediction.defects}
            />
            <ExplainableAI
              id={params.id}
              overview={prediction.overview}
              technical={prediction.technical}
            />
          </div>
        </div>
        <RepairSuggestions id={params.id} repairs={prediction.repairSuggestions} />
      </div>
      <Footer />
    </main>
  )
}

