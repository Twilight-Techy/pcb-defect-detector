import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { prisma } from "@/lib/prisma"
import { Severity } from "@prisma/client"

export async function POST(req: Request) {
    const contentType = req.headers.get("content-type")

    let imageUrl: string
    let userId: string | null = null

    if (contentType?.includes("multipart/form-data")) {
        const formData = await req.formData()
        const file = formData.get("file") as File
        userId = formData.get("userId") as string

        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        if (!userId) return NextResponse.json({ error: "No user ID provided" }, { status: 401 })

        const blob = await put(file.name, file, {
            access: "public",
            addRandomSuffix: true,
        })

        imageUrl = blob.url
    } else {
        const json = await req.json()
        imageUrl = json.imageUrl
        userId = json.userId

        if (!imageUrl) return NextResponse.json({ error: "Missing image URL or user ID" }, { status: 400 })
        if (!userId) return NextResponse.json({ error: "No user ID provided" }, { status: 401 })
    }

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
    const totalConfidence = predictions.reduce((sum: number, d: any) => sum + parseFloat(d.confidence || "0"), 0)
    const avgConfidence = defectCount > 0 ? totalConfidence / defectCount : 0
    const pcbName = overviewText.pcb_name

    // Use simple rules for analysis severity
    const analysisSeverity =
        avgConfidence >= 0.85
            ? Severity.Critical
            : avgConfidence >= 0.6
                ? Severity.High
                : avgConfidence > 0.3
                    ? Severity.Medium
                    : Severity.Low

    // Match each detection to its metadata
    const defects = defectsDetails.map((pred: any) => {
        // const meta = defectsDetails.find((d: any) => d.class === pred.class) || {}

        const confidence = parseFloat(pred.confidence || "0")

        const severity =
            confidence >= 0.85
                ? Severity.Critical
                : confidence >= 0.6
                    ? Severity.High
                    : confidence > 0.3
                        ? Severity.Medium
                        : Severity.Low

        return {
            name: pred.class,
            location: pred.location,
            description: pred.description,
            severity,
            confidence: typeof pred.confidence === "string" ? parseFloat(pred.confidence) : pred.confidence,
            x: typeof pred.x === "string" ? parseFloat(pred.x) : pred.x,
            y: typeof pred.y === "string" ? parseFloat(pred.y) : pred.y,
            width: typeof pred.width === "string" ? parseFloat(pred.width) : pred.width,
            height: typeof pred.height === "string" ? parseFloat(pred.height) : pred.height,
            repairSteps: Array.isArray(pred.suggestions) ? pred.suggestions : [],
            requiredTools: Array.isArray(pred.tools) ? pred.tools : [],
        }
    })

    const prediction = await prisma.analysis.create({
        data: {
            imageUrl,
            processingTime: inferenceTime,
            rawResponse: result,
            userId,
            pcbName: pcbName,
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
