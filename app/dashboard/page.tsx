"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentScans } from "@/components/dashboard/recent-scans"
import { Footer } from "@/components/footer"

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function getDashboardData() {
      try {
        const userJson = localStorage.getItem("user")
        if (!userJson) throw new Error("User not logged in")

        const user = JSON.parse(userJson)
        const userId = user.id

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`, {
          cache: "no-store",
          headers: {
            "x-user-id": userId,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const data = await res.json()
        setStats(data.stats)
        setScans(data.scans)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    getDashboardData()
  }, [])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {loading && <p className="text-white">Loading dashboard...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && stats && (
          <>
            <DashboardHeader stats={stats} scans={scans} />
            <DashboardStats stats={stats} />
            <RecentScans scans={scans} />
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
