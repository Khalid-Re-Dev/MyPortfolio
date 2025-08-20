import { type NextRequest, NextResponse } from "next/server"

// Mock contact messages storage - In production, this would be stored in a database
const contactMessages: Array<{
  id: string
  name: string
  email: string
  message: string
  timestamp: Date
  read: boolean
}> = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Create new contact message
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      timestamp: new Date(),
      read: false,
    }

    contactMessages.push(newMessage)

    // In production, you would:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to user
    // 4. Integrate with services like EmailJS, SendGrid, etc.

    console.log("New contact message:", newMessage)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // In production, verify JWT and check admin role

    return NextResponse.json({
      messages: contactMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    })
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 })
  }
}
