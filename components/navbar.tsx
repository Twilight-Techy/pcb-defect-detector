"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, CircuitBoard, LayoutDashboard, Upload, Layers, User } from "lucide-react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Check if we're on an auth page
  const isAuthPage = pathname?.startsWith("/auth")

  // Don't show navbar on auth pages
  if (isAuthPage) {
    return null
  }

  return (
    <nav className="bg-[#1A2035] border-b border-[#00E5E5]/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <CircuitBoard className="h-8 w-8 text-[#00E5E5]" />
            <span className="font-bold text-xl text-white">
              PCB<span className="text-[#B347FF]">Detect</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
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
            <Link href="/auth/login">
              <Button className="bg-[#00E5E5] hover:bg-[#00E5E5]/80 text-black font-medium">Sign In</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1A2035] border-b border-[#00E5E5]/20 py-4">
          <div className="container mx-auto px-4 space-y-3">
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
            <Link
              href="/auth/login"
              className="flex items-center text-gray-300 hover:text-[#B347FF] transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-5 w-5 mr-2" />
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

