import type { Metadata } from "next"
import Link from "next/link"
import { CircuitBoard } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | PCB Defect Detection",
  description: "Login to your PCB Defect Detection account",
}

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-[#0F172A]" />

        {/* Background grid effect */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Glowing orb effect */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#00E5E5] rounded-full filter blur-[150px] opacity-20"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#B347FF] rounded-full filter blur-[150px] opacity-20"></div>

        <div className="relative z-20 flex items-center text-lg font-medium">
          <CircuitBoard className="h-8 w-8 text-[#00E5E5] mr-2" />
          <span className="font-bold text-xl text-white">
            PCB<span className="text-[#B347FF]">Detect</span>
          </span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "This AI-powered PCB defect detection system has revolutionized our quality control process, reducing
              inspection time by 75% while improving accuracy."
            </p>
            <footer className="text-sm">Sarah Chen, Lead Engineer at TechCircuits</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[#00E5E5]">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="underline underline-offset-4 hover:text-[#B347FF]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

