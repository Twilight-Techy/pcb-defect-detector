import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Helper to get 30 days ago date
const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

export async function GET(req: Request) {
    const userId = req.headers.get("x-user-id")

    if (!userId) {
        return NextResponse.json(
            { error: "User not authenticated" },
            { status: 401 }
        )
    }

    try {
        // Fetch only analyses from this user in the last 30 days
        const analyses = await prisma.analysis.findMany({
            where: {
                userId, // filter by user
                // analyzedAt: {
                //     gte: thirtyDaysAgo, // only within the last 30 days
                // },
            },
            include: {
                defects: true,
            },
            orderBy: {
                analyzedAt: "desc",
            },
        })

        const totalAnalyses = analyses.length
        const totalDefects = analyses.reduce((sum, a) => sum + a.numberOfDefects, 0)
        const avgProcessingTime =
            totalAnalyses === 0
                ? 0
                : analyses.reduce((sum, a) => sum + a.processingTime, 0) / totalAnalyses

        const detectionRate =
            totalAnalyses === 0
                ? 0
                : (analyses.filter((a) => a.numberOfDefects > 0).length / totalAnalyses) * 100

        const stats = {
            analyzed: totalAnalyses,
            defects: totalDefects,
            detectionRate: Number(detectionRate.toFixed(2)),
            avgProcessingTime: Number(avgProcessingTime.toFixed(2)),
        }

        // Get all analyses
        const recentScans = analyses.map((analysis) => ({
            id: analysis.id,
            name: analysis.pcbName,
            timestamp: analysis.analyzedAt,
            defects: analysis.numberOfDefects,
            severity: analysis.severity,
            status: analysis.status,
        }))

        return NextResponse.json({ stats, scans: recentScans }, { status: 200 })
    } catch (error) {
        console.error("Error fetching dashboard data:", error)
        return NextResponse.json(
            { error: "Failed to load dashboard data" },
            { status: 500 }
        )
    }
}
