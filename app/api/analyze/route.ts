import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    if (!userId) return NextResponse.json({ error: "No user ID provided" }, { status: 401 })

    const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
    })

    const imageUrl = blob.url

    const start = performance.now()

    const roboflowRes = await fetch(
        "https://serverless.roboflow.com/infer/workflows/twilight-techy/pcb-defect-detector",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_key: process.env.ROBOFLOW_API_KEY,
                inputs: {
                    image: { type: "url", value: imageUrl },
                },
            }),
        }
    )

    const inferenceTime = performance.now() - start

    const result = await roboflowRes.json()
    if (!roboflowRes.ok) {
        return NextResponse.json({ error: result.message || "Roboflow error" }, { status: 500 })
    }

    const output = result.outputs?.[0]
    const predictions = output?.pcb_defect_detections?.predictions ?? []
    const defectsDetails = JSON.parse(output?.defects_details?.output || "[]")
    const overviewText = JSON.parse(output?.detection_overview?.output || "{}")

    const defectCount = predictions.length
    const totalConfidence = predictions.reduce((sum: number, d: any) => sum + (d.confidence || 0), 0)
    const avgConfidence = defectCount > 0 ? totalConfidence / defectCount : 0

    // Use simple rules for analysis severity
    const analysisSeverity =
        avgConfidence >= 0.85
            ? "Critical"
            : avgConfidence >= 0.6
                ? "Major"
                : avgConfidence > 0.3
                    ? "Minor"
                    : "Negligible"

    // Match each detection to its metadata
    const defects = predictions.map((pred: any) => {
        const meta = defectsDetails.find((d: any) => d.class === pred.class) || {}

        const severity =
            pred.confidence >= 0.85
                ? "High"
                : pred.confidence >= 0.6
                    ? "Medium"
                    : pred.confidence > 0.3
                        ? "Low"
                        : "Negligible"

        return {
            name: pred.class,
            severity,
            confidence: pred.confidence,
            x: pred.x,
            y: pred.y,
            width: pred.width,
            height: pred.height,
            repairSteps: meta.suggestions ? meta.suggestions.split(". ").filter(Boolean) : [],
            requiredTools: meta.tools ? meta.tools.split(",").map((t: string) => t.trim()) : [],
        }
    })

    const prediction = await prisma.analysis.create({
        data: {
            imageUrl,
            processingTime: inferenceTime,
            rawResponse: result,
            userId,
            pcbName: "PCB Board", // default
            severity: analysisSeverity,
            status: "Completed",
            overview: overviewText.general_overview || "N/A",
            technical: overviewText.technical_overview || "N/A",
            numberOfDefects: defectCount,
            defects: {
                create: defects,
            },
        },
    })

    return NextResponse.json({ predictionId: prediction.id })
}
