import { type NextRequest, NextResponse } from "next/server"

// Mock projects data - In production, this would come from a database
const projects = [
  {
    id: "1",
    title: "Best On Click",
    description: "Modern e-commerce platform with advanced filtering and search capabilities",
    longDescription:
      "A comprehensive e-commerce solution built with React and Node.js, featuring real-time inventory management, advanced product filtering, secure payment integration, and responsive design. The platform includes an admin dashboard for managing products, orders, and customer data.",
    techStack: ["React", "Node.js", "MongoDB", "Express", "TailwindCSS", "Stripe"],
    duration: "3 months",
    challenges: [
      "Implementing real-time inventory updates",
      "Optimizing search performance for large product catalogs",
      "Ensuring secure payment processing",
      "Creating responsive design for all devices",
    ],
    image: "/placeholder.svg?height=400&width=600",
    liveUrl: "https://bestonclick.com",
    githubUrl: "https://github.com/username/bestonclick",
    featured: true,
    views: 0,
  },
  {
    id: "2",
    title: "Editopia",
    description: "Collaborative text editor with real-time synchronization",
    longDescription:
      "A powerful collaborative text editor that allows multiple users to edit documents simultaneously with real-time synchronization. Features include version control, comment system, rich text formatting, and document sharing capabilities.",
    techStack: ["React", "Socket.io", "Node.js", "MongoDB", "Quill.js"],
    duration: "2 months",
    challenges: [
      "Implementing real-time collaboration",
      "Handling conflict resolution in simultaneous edits",
      "Optimizing performance for large documents",
      "Creating intuitive user interface",
    ],
    image: "/placeholder.svg?height=400&width=600",
    liveUrl: "https://editopia.app",
    githubUrl: "https://github.com/username/editopia",
    featured: true,
    views: 0,
  },
  {
    id: "3",
    title: "Level Devil Game",
    description: "Interactive web-based puzzle game with progressive difficulty",
    longDescription:
      "An engaging puzzle game built with vanilla JavaScript and Canvas API. Features multiple levels with increasing difficulty, smooth animations, local storage for progress saving, and responsive controls for both desktop and mobile devices.",
    techStack: ["JavaScript", "HTML5 Canvas", "CSS3", "Local Storage"],
    duration: "1 month",
    challenges: [
      "Creating smooth game animations",
      "Implementing collision detection",
      "Optimizing performance for mobile devices",
      "Designing engaging level progression",
    ],
    image: "/placeholder.svg?height=400&width=600",
    liveUrl: "https://leveldevil.game",
    githubUrl: "https://github.com/username/level-devil",
    featured: true,
    views: 0,
  },
  {
    id: "4",
    title: "Food Delivery App",
    description: "Full-stack food delivery application with real-time tracking",
    longDescription:
      "A comprehensive food delivery platform featuring restaurant listings, menu management, order tracking, payment integration, and delivery management. Includes separate interfaces for customers, restaurants, and delivery personnel.",
    techStack: ["React Native", "Node.js", "PostgreSQL", "Redis", "Google Maps API"],
    duration: "4 months",
    challenges: [
      "Implementing real-time order tracking",
      "Integrating multiple payment gateways",
      "Optimizing map performance",
      "Managing complex state across different user roles",
    ],
    image: "/placeholder.svg?height=400&width=600",
    liveUrl: "https://fooddelivery.app",
    githubUrl: "https://github.com/username/food-delivery",
    featured: true,
    views: 0,
  },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ message: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // This would be used by admin to create new projects
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const projectData = await request.json()

    // In production, save to database
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      views: 0,
    }

    projects.push(newProject)

    return NextResponse.json({ project: newProject })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ message: "Failed to create project" }, { status: 500 })
  }
}
