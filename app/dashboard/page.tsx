import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentScans } from "@/components/dashboard/recent-scans"
import { Footer } from "@/components/footer"

async function getDashboardData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data")
  }

  return res.json()
}

export default async function Dashboard() {
  const { stats, scans } = await getDashboardData()

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader stats={stats} scans={scans} />
        <DashboardStats stats={stats} />
        <RecentScans scans={scans} />
      </div>
      <Footer />
    </main>
  )
}

