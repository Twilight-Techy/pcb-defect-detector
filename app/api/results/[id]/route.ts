// app/api/predictions/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    { params }: { params: { id: string } }
) {
    const { id } = params

    try {
        const prediction = await prisma.analysis.findUnique({
            where: { id },
            include: {
                defects: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!prediction) {
            return NextResponse.json({ error: "Prediction not found" }, { status: 404 })
        }

        return NextResponse.json(prediction)
    } catch (error) {
        console.error("Error fetching prediction:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
