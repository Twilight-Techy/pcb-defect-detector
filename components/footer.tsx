import Link from "next/link"
import { CircuitBoard, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1A2035] border-t border-[#00E5E5]/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <CircuitBoard className="h-8 w-8 text-[#00E5E5]" />
              <span className="font-bold text-xl text-white">
                PCB<span className="text-[#B347FF]">Detect</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4">Advanced AI-powered PCB defect detection and analysis system.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00E5E5] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00E5E5] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00E5E5] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#B347FF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#00E5E5]/20 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} PCBDetect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

