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

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    // Simulate registration
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        const message = result.error || result.message || "Something went wrong. Please try again.";
        toast.error(message);
      } else {
        toast.success("Account created!");
        router.push("/dashboard")
      }
    } catch (err) {
      console.error(err)
      const message = "Registration failed. Please try again."
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0F172A] border-[#00E5E5]/30"
              disabled={isLoading}
            />
          </div>

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0F172A] border-[#00E5E5]/30"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#0F172A] border-[#00E5E5]/30"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm font-normal">
              I agree to the{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-[#B347FF]"
                onClick={(e) => {
                  e.preventDefault()
                  // In a real app, this would navigate to the terms page
                  window.open("/terms", "_blank")
                }}
              >
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-[#B347FF]"
                onClick={(e) => {
                  e.preventDefault()
                  // In a real app, this would navigate to the privacy policy page
                  window.open("/privacy", "_blank")
                }}
              >
                Privacy Policy
              </Button>
            </Label>
          </div>

          <Button type="submit" className="w-full bg-[#00E5E5] hover:bg-[#00E5E5]/80 text-black" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
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
                // Simulate Google signup
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
                // Simulate GitHub signup
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

