"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      })

      const result = await res.json()

      if (!res.ok) {
        const message = result.error || result.message || "Login failed"
        setError(message)
        toast.error(message)
        return
      }

      // Save login state (temporary localStorage for now)
      localStorage.setItem("user", JSON.stringify(result))

      toast.success("Login successful!")
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      const message = "Login failed. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-[#1A2035] border-[#00E5E5]/30">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0F172A] border-[#00E5E5]/30"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                variant="link"
                className="text-xs text-[#B347FF] px-0"
                onClick={() => {
                  // In a real app, this would navigate to a password reset page
                  alert("Password reset functionality would be implemented here")
                }}
              >
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0F172A] border-[#00E5E5]/30"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>

          <Button type="submit" className="w-full bg-[#00E5E5] hover:bg-[#00E5E5]/80 text-black" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#00E5E5]/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1A2035] px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-[#00E5E5]/30 hover:bg-[#00E5E5]/10"
              onClick={() => {
                setIsLoading(true)
                // Simulate Google login
                setTimeout(() => {
                  router.push("/dashboard")
                }, 1500)
              }}
              disabled={isLoading}
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="border-[#00E5E5]/30 hover:bg-[#00E5E5]/10"
              onClick={() => {
                setIsLoading(true)
                // Simulate GitHub login
                setTimeout(() => {
                  router.push("/dashboard")
                }, 1500)
              }}
              disabled={isLoading}
            >
              GitHub
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

