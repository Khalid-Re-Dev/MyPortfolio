import express from "express"
import { body, validationResult } from "express-validator"
import Analytics from "../models/Analytics.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

/**
 * Parse a basic user-agent string to extract device type, browser, and OS.
 * This is a lightweight parser — for production, consider a library like `ua-parser-js`.
 * @param {string} ua - The raw user-agent string
 * @returns {{ device: string, browser: string, os: string }}
 */
const parseUserAgent = (ua = "") => {
  const lowerUA = ua.toLowerCase()

  // Determine device type
  let device = "desktop"
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = "tablet"
  } else if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) {
    device = "mobile"
  }

  // Determine browser
  let browser = "unknown"
  if (/edg\//i.test(ua)) browser = "Edge"
  else if (/opr\//i.test(ua) || /opera/i.test(ua)) browser = "Opera"
  else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) browser = "Chrome"
  else if (/firefox/i.test(ua)) browser = "Firefox"
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari"
  else if (/msie|trident/i.test(ua)) browser = "IE"

  // Determine OS
  let os = "unknown"
  if (/windows/i.test(ua)) os = "Windows"
  else if (/mac os|macintosh/i.test(ua)) os = "macOS"
  else if (/linux/i.test(ua) && !/android/i.test(ua)) os = "Linux"
  else if (/android/i.test(ua)) os = "Android"
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS"

  return { device, browser, os }
}

/**
 * @route   POST /api/analytics/track
 * @desc    Track a page visit or user action (public, no auth needed)
 * @access  Public
 * @body    { projectId?, action, sessionId, page?, referrer? }
 */
router.post(
  "/track",
  [
    body("action")
      .notEmpty()
      .withMessage("Action is required.")
      .isIn(["view", "like", "share", "download"])
      .withMessage("Action must be one of: view, like, share, download."),
    body("sessionId")
      .notEmpty()
      .withMessage("Session ID is required."),
    body("projectId")
      .optional()
      .isMongoId()
      .withMessage("Project ID must be a valid MongoDB ObjectId."),
    body("referrer")
      .optional()
      .isString(),
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

      const { projectId, action, sessionId, page, referrer } = req.body
      const userAgent = req.headers["user-agent"] || ""
      const ipAddress = req.ip || req.connection?.remoteAddress || "unknown"

      // Parse user-agent for device, browser, and OS info
      const { device, browser, os } = parseUserAgent(userAgent)

      const analyticsData = {
        action,
        sessionId,
        page: page || "home",
        userAgent,
        ipAddress,
        referrer: referrer || "",
        device,
        browser,
        os,
      }

      // Only include projectId if provided (schema requires it, so this will
      // fail validation if omitted — see NOTE above)
      if (projectId) {
        analyticsData.projectId = projectId
      }

      const analyticsEntry = new Analytics(analyticsData)
      await analyticsEntry.save()

      res.status(201).json({
        message: "Analytics event tracked successfully.",
        id: analyticsEntry._id,
      })
    } catch (error) {
      console.error("Analytics track error:", error)

      // Surface Mongoose validation errors clearly
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error.",
          errors: Object.values(error.errors).map((e) => e.message),
        })
      }

      res.status(500).json({ message: "Server error while tracking analytics." })
    }
  },
)

/**
 * @route   GET /api/analytics/summary
 * @desc    Get an overall analytics summary (admin only)
 * @access  Protected + Admin
 * @returns {{ totalVisits, uniqueSessions, topPages, topReferrers, deviceBreakdown }}
 */
router.get("/summary", authenticate, authorize("admin"), async (req, res) => {
  try {
    // Total number of tracked events
    const totalVisits = await Analytics.countDocuments()

    // Count of unique session IDs
    const uniqueSessionsResult = await Analytics.distinct("sessionId")
    const uniqueSessions = uniqueSessionsResult.length

    // Top referrers (grouped and counted)
    const topReferrers = await Analytics.aggregate([
      { $match: { referrer: { $exists: true, $ne: "" } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { referrer: "$_id", count: 1, _id: 0 } },
    ])

    // Top pages — grouped by the `page` field
    const topPages = await Analytics.aggregate([
      { $match: { action: "view" } },
      { $group: { _id: "$page", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $project: {
          page: "$_id",
          views: 1,
          _id: 0,
        },
      },
    ])

    // Device type breakdown
    const deviceBreakdown = await Analytics.aggregate([
      { $match: { device: { $exists: true, $ne: null } } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { device: "$_id", count: 1, _id: 0 } },
    ])

    res.json({
      totalVisits,
      uniqueSessions,
      topPages,
      topReferrers,
      deviceBreakdown,
    })
  } catch (error) {
    console.error("Analytics summary error:", error)
    res.status(500).json({ message: "Server error while fetching analytics summary." })
  }
})

/**
 * @route   GET /api/analytics/project/:projectId
 * @desc    Get analytics data for a specific project (admin only)
 * @access  Protected + Admin
 */
router.get("/project/:projectId", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { projectId } = req.params

    // Total events for this project
    const totalEvents = await Analytics.countDocuments({ projectId })

    if (totalEvents === 0) {
      return res.json({
        projectId,
        totalEvents: 0,
        uniqueSessions: 0,
        actionBreakdown: [],
        deviceBreakdown: [],
        browserBreakdown: [],
        recentEvents: [],
      })
    }

    // Unique sessions for this project
    const uniqueSessionsResult = await Analytics.distinct("sessionId", { projectId })
    const uniqueSessions = uniqueSessionsResult.length

    // Action breakdown (views, likes, shares, downloads)
    const actionBreakdown = await Analytics.aggregate([
      { $match: { projectId: { $toObjectId: projectId } } },
      { $group: { _id: "$action", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { action: "$_id", count: 1, _id: 0 } },
    ])

    // Device breakdown for this project
    const deviceBreakdown = await Analytics.aggregate([
      { $match: { projectId: { $toObjectId: projectId }, device: { $exists: true } } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { device: "$_id", count: 1, _id: 0 } },
    ])

    // Browser breakdown for this project
    const browserBreakdown = await Analytics.aggregate([
      { $match: { projectId: { $toObjectId: projectId }, browser: { $exists: true } } },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { browser: "$_id", count: 1, _id: 0 } },
    ])

    // Recent events (last 20)
    const recentEvents = await Analytics.find({ projectId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("action sessionId device browser os referrer createdAt")

    res.json({
      projectId,
      totalEvents,
      uniqueSessions,
      actionBreakdown,
      deviceBreakdown,
      browserBreakdown,
      recentEvents,
    })
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid project ID format." })
    }
    console.error("Project analytics error:", error)
    res.status(500).json({ message: "Server error while fetching project analytics." })
  }
})

export default router
