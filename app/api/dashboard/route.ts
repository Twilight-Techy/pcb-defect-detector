import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Fetch all analyses
        const analyses = await prisma.analysis.findMany({
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

        // Get the 5 most recent analyses
        const recentScans = analyses.slice(0, 5).map((analysis) => ({
            id: analysis.id,
            name: analysis.pcbName,
            timestamp: timeAgo(analysis.analyzedAt),
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

// Utility function to format time ago
function timeAgo(date: Date): string {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}
