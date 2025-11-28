"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, CircuitBoard, LayoutDashboard, Upload, Layers, User, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user") // Adjust if using tokens or session
    setIsLoggedIn(false)
    setIsOpen(false)
    router.push("/auth/login") // Optional redirect
  }

  const isAuthPage = pathname?.startsWith("/auth")
  if (isAuthPage) return null

  return (
    <nav className="bg-[#1A2035] border-b border-[#00E5E5]/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/icon-v2.png" alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-white">
              LASU PCB <span className="text-[#00E5E5]">Defect Detector</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link
                  href="/"
                  className={`text-gray-300 hover:text-[#B347FF] transition-colors ${pathname === "/" ? "text-[#B347FF]" : ""}`}
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-gray-300 hover:text-[#B347FF] transition-colors ${pathname === "/dashboard" ? "text-[#B347FF]" : ""}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/analyze"
                  className={`text-gray-300 hover:text-[#B347FF] transition-colors ${pathname === "/analyze" ? "text-[#B347FF]" : ""}`}
                >
                  Analyze
                </Link>
                <Link
                  href="/batch"
                  className={`text-gray-300 hover:text-[#B347FF] transition-colors ${pathname === "/batch" ? "text-[#B347FF]" : ""}`}
                >
                  Batch
                </Link>
                <Button
                  onClick={handleLogout}
                  className="bg-[#FF4F4F] hover:bg-[#FF4F4F]/80 text-white font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button className="bg-[#00E5E5] hover:bg-[#00E5E5]/80 text-black font-medium">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#1A2035] border-b border-[#00E5E5]/20 py-4">
          <div className="container mx-auto px-4 space-y-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/"
                  className={`flex items-center text-gray-300 hover:text-[#B347FF] transition-colors py-2 ${pathname === "/" ? "text-[#B347FF]" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center text-gray-300 hover:text-[#B347FF] transition-colors py-2 ${pathname === "/dashboard" ? "text-[#B347FF]" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
                <Link
                  href="/analyze"
                  className={`flex items-center text-gray-300 hover:text-[#B347FF] transition-colors py-2 ${pathname === "/analyze" ? "text-[#B347FF]" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Analyze
                </Link>
                <Link
                  href="/batch"
                  className={`flex items-center text-gray-300 hover:text-[#B347FF] transition-colors py-2 ${pathname === "/batch" ? "text-[#B347FF]" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Layers className="h-5 w-5 mr-2" />
                  Batch
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-400 hover:text-red-600 transition-colors py-2"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center text-gray-300 hover:text-[#B347FF] transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
