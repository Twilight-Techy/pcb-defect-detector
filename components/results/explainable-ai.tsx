import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExplainableAIProps {
  id: string
  overview: string
  technical: string
}

export function ExplainableAI({ id, overview, technical }: ExplainableAIProps) {

  if (!overview && !technical) {
    return (
      <Card className="bg-[#1A2035] border-[#00E5E5]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-white">Explainable AI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-[#0F172A] rounded-lg border border-[#00E5E5]/20">
            <p className="text-gray-400">No explainable AI data available.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-white">Explainable AI</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="bg-[#0F172A] mb-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:bg-[#00E5E5] data-[state=active]:text-black">
              Technical
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="p-4 bg-[#0F172A] rounded-lg border border-[#00E5E5]/20">
              <p className="text-gray-300 whitespace-pre-line">{overview}</p>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="mt-0">
            <div className="p-4 bg-[#0F172A] rounded-lg border border-[#00E5E5]/20">
              <p className="text-gray-300 whitespace-pre-line">{technical}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


