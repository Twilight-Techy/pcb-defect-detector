import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentScans } from "@/components/dashboard/recent-scans"
import { Footer } from "@/components/footer"

export default function Dashboard() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        <DashboardStats />
        <RecentScans />
      </div>
      <Footer />
    </main>
  )
}

