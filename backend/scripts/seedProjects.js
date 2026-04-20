import mongoose from "mongoose"
import dotenv from "dotenv"
import Project from "../models/Project.js"
import User from "../models/User.js"

dotenv.config()

const projects = [
  {
    title: "Best On Click",
    shortDescription: "A high-performance e-commerce landing page with smooth animations.",
    fullDescription: "Detailed view of the Best On Click project focusing on performance and UX.",
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
    frontendTech: ["React", "Vite"],
    backendTech: ["Node.js"],
    duration: "3 weeks",
    challenges: ["Optimizing animation performance", "Responsive design"],
    designConsiderations: ["Clean UI", "Accessible components"],
    insights: ["Improved load speed by 40%"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    category: "E-commerce",
    status: "published",
    featured: true
  },
  {
    title: "Editopia",
    shortDescription: "Photo editing web application with real-time filters.",
    fullDescription: "Comprehensive photo editing suite built for the web.",
    techStack: ["React", "Canvas API", "SASS"],
    frontendTech: ["React"],
    backendTech: ["Firebase"],
    duration: "1 month",
    challenges: ["Real-time rendering"],
    designConsiderations: ["Dark mode", "Toolbars"],
    insights: ["Active users: 500+"],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800",
    category: "Web App",
    status: "published",
    featured: false
  },
  {
    title: "Level Devil Game",
    shortDescription: "A challenging 2D platformer game built with JavaScript.",
    fullDescription: "Fun and addictive platformer with custom physics engine.",
    techStack: ["JavaScript", "HTML5 Canvas", "Anime.js"],
    frontendTech: ["JS"],
    backendTech: ["None"],
    duration: "2 weeks",
    challenges: ["Collision detection"],
    designConsiderations: ["Retro aesthetics"],
    insights: ["Smooth 60fps gameplay"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
    category: "Gaming",
    status: "published",
    featured: false
  }
]

const seedProjects = async () => {
  try {
    console.log("🔗 Connecting to MongoDB for seeding projects...")
    await mongoose.connect(process.env.MONGODB_URI)
    
    // Get the admin user to associate projects with
    const admin = await User.findOne({ role: "admin" })
    if (!admin) {
      console.log("❌ Error: Admin user not found. Please run 'npm run seed' first.")
      process.exit(1)
    }

    // Clear existing projects to avoid duplicates during seed
    await Project.deleteMany({})
    console.log("🗑️  Cleared old projects")

    const projectsWithAdmin = projects.map(p => ({ ...p, createdBy: admin._id }))
    await Project.insertMany(projectsWithAdmin)

    console.log("✅ Projects seeded successfully!")
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error("❌ Seed error:", error.message)
    process.exit(1)
  }
}

seedProjects()
