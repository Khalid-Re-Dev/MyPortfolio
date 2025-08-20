import mongoose from "mongoose"

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    fullDescription: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    techStack: [
      {
        type: String,
        required: true,
      },
    ],
    frontendTech: [
      {
        type: String,
        required: true,
      },
    ],
    backendTech: [
      {
        type: String,
        required: true,
      },
    ],
    duration: {
      type: String,
      required: true,
    },
    challenges: [
      {
        type: String,
        required: true,
      },
    ],
    designConsiderations: [
      {
        type: String,
        required: true,
      },
    ],
    insights: [
      {
        type: String,
        required: true,
      },
    ],
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    liveUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["E-commerce", "Productivity", "Gaming", "Mobile App", "Web App", "Other"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    seoTitle: {
      type: String,
      maxlength: 60,
    },
    seoDescription: {
      type: String,
      maxlength: 160,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
projectSchema.index({ status: 1, featured: -1, createdAt: -1 })
projectSchema.index({ category: 1 })
projectSchema.index({ tags: 1 })
projectSchema.index({ title: "text", shortDescription: "text" })

// Increment views
projectSchema.methods.incrementViews = function () {
  this.views += 1
  return this.save()
}

export default mongoose.model("Project", projectSchema)
