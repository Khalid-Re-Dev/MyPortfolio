import express from "express"
import { body, validationResult } from "express-validator"
import User from "../models/User.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

/**
 * @route   GET /api/users/profile
 * @desc    Get the currently authenticated user's profile
 * @access  Protected (requires valid JWT)
 */
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error while fetching profile." })
  }
})

/**
 * @route   PUT /api/users/profile
 * @desc    Update the currently authenticated user's profile
 * @access  Protected (requires valid JWT)
 */
router.put(
  "/profile",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters."),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email."),
    body("avatar")
      .optional()
      .isURL()
      .withMessage("Avatar must be a valid URL."),
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

      const { name, email, avatar } = req.body
      const user = await User.findById(req.user._id)

      if (!user) {
        return res.status(404).json({ message: "User not found." })
      }

      // Update name if provided
      if (name) {
        user.name = name
      }

      // Update email if provided and different from current
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email, _id: { $ne: user._id } })
        if (existingUser) {
          return res.status(409).json({ message: "Email is already in use by another account." })
        }
        user.email = email
      }

      // Update avatar if provided
      if (avatar !== undefined) {
        user.avatar = avatar
      }

      await user.save()

      res.json({
        message: "Profile updated successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({ message: "Server error while updating profile." })
    }
  },
)

/**
 * @route   GET /api/users/:id
 * @desc    Get a user by their ID (admin only)
 * @access  Protected + Admin
 */
router.get("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID format." })
    }
    console.error("Get user by ID error:", error)
    res.status(500).json({ message: "Server error while fetching user." })
  }
})

/**
 * @route   GET /api/users
 * @desc    List all users (admin only)
 * @access  Protected + Admin
 */
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.json({ users })
  } catch (error) {
    console.error("List users error:", error)
    res.status(500).json({ message: "Server error while fetching users." })
  }
})

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (admin only, cannot delete self)
 * @access  Protected + Admin
 */
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account." })
    }
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }
    res.json({ message: "User deleted successfully." })
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID format." })
    }
    console.error("Delete user error:", error)
    res.status(500).json({ message: "Server error while deleting user." })
  }
})

export default router
