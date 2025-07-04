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

        const res = await fetch("/api/dashboard", {
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
      <div className="container mx-auto px-4 py-8 flex-1">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-[#B347FF] border-gray-300"></div>
            <p className="ml-4 text-white text-lg">Loading dashboard...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center text-red-500 text-lg">{error}</div>
        )}
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
