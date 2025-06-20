import { Navbar } from "@/components/navbar"
import { ResultsHeader } from "@/components/results/results-header"
import { DefectVisualizer } from "@/components/results/defect-visualizer"
import { DefectList } from "@/components/results/defect-list"
import { ExplainableAI } from "@/components/results/explainable-ai"
import { RepairSuggestions } from "@/components/results/repair-suggestions"
import { Footer } from "@/components/footer"

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Results({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/results/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Results Not Found</h1>
          <p className="mt-4">The results for this ID do not exist or have been deleted.</p>
        </div>
      </main>
    );
  }

  const prediction = await res.json();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ResultsHeader
          id={prediction.id}
          name={prediction.pcbName}
          createdAt={prediction.analyzedAt}
          defectsCount={prediction.numberOfDefects}
          severity={prediction.severity}
          status={prediction.status}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DefectVisualizer
            id={prediction.id}
            imageUrl={prediction.imageUrl}
            labelVisualizationUrl={prediction.labelVisualization}
            dotVisualizationUrl={prediction.dotVisualization}
          />
          <div className="space-y-8">
            <DefectList id={prediction.id} defects={prediction.defects} />
            <ExplainableAI
              id={prediction.id}
              overview={prediction.overview}
              technical={prediction.technical}
            />
          </div>
        </div>
        <RepairSuggestions id={prediction.id} repairs={prediction.defects} />
      </div>
      <Footer />
    </main>
  );
}


