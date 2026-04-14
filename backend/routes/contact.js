import express from "express"
import { body, validationResult } from "express-validator"
import rateLimit from "express-rate-limit"

const router = express.Router()

// Rate limit: max 5 contact form submissions per 15 minutes per IP
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many messages sent. Please try again later." },
})

// Validation rules
const contactValidation = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("subject").trim().isLength({ min: 2, max: 200 }).withMessage("Subject required"),
  body("message").trim().isLength({ min: 10, max: 2000 }).withMessage("Message must be 10-2000 characters"),
]

// POST /api/contact
router.post("/", contactRateLimit, contactValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, subject, message } = req.body

  try {
    // Log the contact submission (replace with email service later)
    console.log("📧 New contact form submission:", {
      name,
      email,
      subject,
      messagePreview: message.substring(0, 50),
    })

    // TODO: Add email service (nodemailer/sendgrid) here

    res.status(200).json({
      message: "Message received successfully. I will get back to you soon!",
      received: true,
    })
  } catch (error) {
    console.error("Contact route error:", error)
    res.status(500).json({ message: "Server error. Please try again." })
  }
})

export default router
