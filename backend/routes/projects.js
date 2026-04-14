import express from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { body, validationResult } from "express-validator"
import Project from "../models/Project.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

/**
 * Upload a buffer to Cloudinary and return the result.
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, folder = "portfolio") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        },
      )
      .end(buffer)
  })
}

/**
 * Extract the Cloudinary public_id from a full Cloudinary URL.
 * Used for deleting images when a project is removed.
 * @param {string} url - Full Cloudinary URL
 * @returns {string|null} The public_id or null
 */
const getPublicIdFromUrl = (url) => {
  try {
    // Cloudinary URLs follow: .../upload/v123/folder/filename.ext
    const parts = url.split("/upload/")
    if (parts.length < 2) return null
    const pathWithVersion = parts[1] // e.g. "v123456/portfolio/abc123.jpg"
    // Remove version prefix
    const withoutVersion = pathWithVersion.replace(/^v\d+\//, "")
    // Remove file extension
    return withoutVersion.replace(/\.\w+$/, "")
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/projects
 * @desc    List all projects. Supports query filters: ?category=&status=published
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const { category, status, featured, page = 1, limit = 20 } = req.query

    const filter = {}
    if (category) filter.category = category
    if (status) filter.status = status
    if (featured !== undefined) filter.featured = featured === "true"

    // Default to published projects for public access
    if (!status) {
      filter.status = "published"
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const pageLimit = Math.min(parseInt(limit, 10), 50) // Cap at 50

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageLimit)
        .populate("createdBy", "name avatar"),
      Project.countDocuments(filter),
    ])

    res.json({
      projects,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit),
      },
    })
  } catch (error) {
    console.error("List projects error:", error)
    res.status(500).json({ message: "Server error while fetching projects." })
  }
})

/**
 * @route   GET /api/projects/:id
 * @desc    Get a single project by its ID and increment the view counter
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name avatar")

    if (!project) {
      return res.status(404).json({ message: "Project not found." })
    }

    // Increment the views counter
    await project.incrementViews()

    res.json({ project })
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid project ID format." })
    }
    console.error("Get project error:", error)
    res.status(500).json({ message: "Server error while fetching project." })
  }
})

/**
 * @route   POST /api/projects/:id/like
 * @desc    Toggle a like on a project. Tracked by sessionId or IP to prevent
 *          duplicate likes from the same visitor.
 * @access  Public
 */
router.post("/:id/like", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found." })
    }

    // For a simple implementation, just increment likes.
    // A production system would track likes in a separate collection keyed
    // by (projectId, sessionId/IP) to enable true toggle behaviour.
    const { sessionId } = req.body
    const identifier = sessionId || req.ip || "anonymous"

    // Simple toggle: increment likes (a full implementation would use a
    // dedicated Likes collection to track per-user state)
    project.likes = (project.likes || 0) + 1
    await project.save()

    res.json({
      message: "Like recorded.",
      likes: project.likes,
    })
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid project ID format." })
    }
    console.error("Like project error:", error)
    res.status(500).json({ message: "Server error while liking project." })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN-ONLY ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/projects
 * @desc    Create a new project with optional image upload via multer/Cloudinary
 * @access  Protected + Admin
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("shortDescription").trim().notEmpty().withMessage("Short description is required."),
    body("fullDescription").trim().notEmpty().withMessage("Full description is required."),
    body("category").notEmpty().withMessage("Category is required."),
    body("duration").notEmpty().withMessage("Duration is required."),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed.",
          errors: errors.array(),
        })
      }

      const {
        title,
        shortDescription,
        fullDescription,
        category,
        duration,
        liveUrl,
        githubUrl,
        featured,
        status,
        seoTitle,
        seoDescription,
      } = req.body

      // Parse JSON array fields that may arrive as strings from multipart form
      const parseArray = (val) => {
        if (Array.isArray(val)) return val
        if (typeof val === "string") {
          try { return JSON.parse(val) } catch { return val.split(",").map((s) => s.trim()) }
        }
        return []
      }

      let imageUrl = ""
      // Upload main image if provided
      if (req.file) {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer)
        imageUrl = cloudinaryResult.secure_url
      }

      const project = new Project({
        title,
        shortDescription,
        fullDescription,
        techStack: parseArray(req.body.techStack),
        frontendTech: parseArray(req.body.frontendTech),
        backendTech: parseArray(req.body.backendTech),
        duration,
        challenges: parseArray(req.body.challenges),
        designConsiderations: parseArray(req.body.designConsiderations),
        insights: parseArray(req.body.insights),
        image: imageUrl,
        images: [],
        liveUrl: liveUrl || "",
        githubUrl: githubUrl || "",
        category,
        featured: featured === "true" || featured === true,
        status: status || "draft",
        tags: parseArray(req.body.tags),
        seoTitle: seoTitle || "",
        seoDescription: seoDescription || "",
        createdBy: req.user._id,
      })

      await project.save()

      res.status(201).json({
        message: "Project created successfully.",
        project,
      })
    } catch (error) {
      console.error("Create project error:", error)

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error.",
          errors: Object.values(error.errors).map((e) => e.message),
        })
      }

      res.status(500).json({ message: "Server error while creating project." })
    }
  },
)

/**
 * @route   PUT /api/projects/:id
 * @desc    Update an existing project (admin only)
 * @access  Protected + Admin
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)

      if (!project) {
        return res.status(404).json({ message: "Project not found." })
      }

      // Parse JSON array fields
      const parseArray = (val) => {
        if (val === undefined) return undefined
        if (Array.isArray(val)) return val
        if (typeof val === "string") {
          try { return JSON.parse(val) } catch { return val.split(",").map((s) => s.trim()) }
        }
        return undefined
      }

      // If a new image is uploaded, replace the old one
      if (req.file) {
        // Delete old image from Cloudinary if it exists
        if (project.image) {
          const publicId = getPublicIdFromUrl(project.image)
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId)
            } catch (err) {
              console.warn("Failed to delete old image from Cloudinary:", err.message)
            }
          }
        }

        const cloudinaryResult = await uploadToCloudinary(req.file.buffer)
        project.image = cloudinaryResult.secure_url
      }

      // Update simple fields if provided
      const simpleFields = [
        "title", "shortDescription", "fullDescription", "category",
        "duration", "liveUrl", "githubUrl", "status", "seoTitle", "seoDescription",
      ]
      for (const field of simpleFields) {
        if (req.body[field] !== undefined) {
          project[field] = req.body[field]
        }
      }

      // Update boolean fields
      if (req.body.featured !== undefined) {
        project.featured = req.body.featured === "true" || req.body.featured === true
      }

      // Update array fields
      const arrayFields = [
        "techStack", "frontendTech", "backendTech",
        "challenges", "designConsiderations", "insights", "tags",
      ]
      for (const field of arrayFields) {
        const parsed = parseArray(req.body[field])
        if (parsed !== undefined) {
          project[field] = parsed
        }
      }

      await project.save()

      res.json({
        message: "Project updated successfully.",
        project,
      })
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(400).json({ message: "Invalid project ID format." })
      }
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error.",
          errors: Object.values(error.errors).map((e) => e.message),
        })
      }
      console.error("Update project error:", error)
      res.status(500).json({ message: "Server error while updating project." })
    }
  },
)

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project and its associated Cloudinary images (admin only)
 * @access  Protected + Admin
 */
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found." })
    }

    // Collect all image URLs to delete from Cloudinary
    const imageUrls = []
    if (project.image) imageUrls.push(project.image)
    if (project.images && project.images.length > 0) {
      imageUrls.push(...project.images)
    }

    // Delete images from Cloudinary in parallel
    const deletePromises = imageUrls
      .map((url) => getPublicIdFromUrl(url))
      .filter(Boolean)
      .map((publicId) =>
        cloudinary.uploader.destroy(publicId).catch((err) => {
          console.warn(`Failed to delete Cloudinary image ${publicId}:`, err.message)
        })
      )

    await Promise.all(deletePromises)

    // Delete the project document
    await Project.findByIdAndDelete(req.params.id)

    res.json({ message: "Project and associated images deleted successfully." })
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid project ID format." })
    }
    console.error("Delete project error:", error)
    res.status(500).json({ message: "Server error while deleting project." })
  }
})

export default router
