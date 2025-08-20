import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock analytics data - In production, this would be stored in a database
const projectViews: Record<string, number> = {}
const userSessions: Array<{
  userId: string
  projectId: string
  timestamp: Date
  userAgent: string
  ip: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 })
    }

    // Increment project view count
    projectViews[projectId] = (projectViews[projectId] || 0) + 1

    // Log user session
    userSessions.push({
      userId: decoded.userId,
      projectId,
      timestamp: new Date(),
      userAgent: request.headers.get("user-agent") || "",
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    })

    // In production, you would also send this data to Google Analytics or Firebase Analytics
    // Example: gtag('event', 'project_view', { project_id: projectId, user_id: decoded.userId })

    return NextResponse.json({
      success: true,
      views: projectViews[projectId],
    })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json({ message: "Failed to track view" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    // Only admin can view analytics
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({
      projectViews,
      totalSessions: userSessions.length,
      recentSessions: userSessions.slice(-10).reverse(),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ message: "Failed to fetch analytics" }, { status: 500 })
  }
}
