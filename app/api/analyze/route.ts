import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // adjust path to your Prisma client

export async function POST(req: Request) {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!userId) {
        return NextResponse.json({ error: "No user ID provided" }, { status: 401 })
    }

    const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
    })

    const imageUrl = blob.url

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

    const result = await roboflowRes.json()
    console.log("Roboflow result:", result)

    if (!roboflowRes.ok) {
        return NextResponse.json({ error: result.message || "Roboflow error" }, { status: 500 })
    }

    const output = result.outputs?.[0]
    const rawDefects = result.outputs?.[0]?.pcb_defect_detections?.detections
    const defects = Array.isArray(rawDefects) ? rawDefects : []

    const prediction = await prisma.prediction.create({
        data: {
            imageUrl,
            inferenceTime: output.profiler_trace?.[0]?.duration || 0,
            modelUsed: "pcb-defect-detector",
            rawResponse: result,
            userId,
            defects: {
                create: defects.map((defect: any) => ({
                    className: defect.class,
                    confidence: defect.confidence,
                    x: defect.x,
                    y: defect.y,
                    width: defect.width,
                    height: defect.height,
                })),
            },
        },
    })

    return NextResponse.json({ predictionId: prediction.id })
}
