// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash)
        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Store in localStorage on client; no session mechanism here.
        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
        })
    } catch (err) {
        console.error("Login error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
