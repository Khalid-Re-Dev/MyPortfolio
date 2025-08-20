import mongoose from "mongoose"

const analyticsSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sessionId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["view", "like", "share", "download"],
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    referrer: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
    duration: {
      type: Number, // in seconds
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for analytics queries
analyticsSchema.index({ projectId: 1, createdAt: -1 })
analyticsSchema.index({ userId: 1, createdAt: -1 })
analyticsSchema.index({ action: 1, createdAt: -1 })
analyticsSchema.index({ createdAt: -1 })

export default mongoose.model("Analytics", analyticsSchema)
