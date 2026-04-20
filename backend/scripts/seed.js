import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"

dotenv.config()

const seedAdmin = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio")
    console.log("✅ Connected to MongoDB")

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@portfolio.com" })
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists:")
      console.log(`   Email: ${existingAdmin.email}`)
      console.log(`   Role: ${existingAdmin.role}`)
      await mongoose.disconnect()
      process.exit(0)
    }

    // Create admin user
    const admin = new User({
      name: "Khalid Badhawi",
      email: "admin@portfolio.com",
      password: "admin123",
      role: "admin",
      isActive: true,
    })

    await admin.save()

    console.log("✅ Admin user created successfully!")
    console.log("   ┌─────────────────────────────────┐")
    console.log("   │  Email:    admin@portfolio.com   │")
    console.log("   │  Password: admin123              │")
    console.log("   │  Role:     admin                 │")
    console.log("   └─────────────────────────────────┘")

    await mongoose.disconnect()
    console.log("🔌 Disconnected from MongoDB")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seed error:", error.message)
    process.exit(1)
  }
}

seedAdmin()
