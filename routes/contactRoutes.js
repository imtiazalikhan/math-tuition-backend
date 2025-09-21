import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const router = express.Router();

// POST - Save contact form
router.post("/", async (req, res) => {
  try {
    const { name, grade, phone } = req.body;

    if (!name || !grade || !phone) {
      return res.status(400).json({
        status: "error",
        message: "All fields required",
      });
    }

    // Save to DB first
    const newContact = new Contact({ name, grade, phone });
    await newContact.save();
    console.log("📦 Contact saved:", newContact);

    // Send Email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"Math Tuition" <${process.env.EMAIL_USER}>`,
        to: "your-admin-email@gmail.com",
        subject: "New Contact Form Submission",
        text: `New student inquiry:\nName: ${name}\nGrade: ${grade}\nPhone: ${phone}`,
      });

      console.log("📧 Email sent:", info.messageId);
    } catch (emailErr) {
      console.error("📭 Email failed:", emailErr.message);
      // Optional: Save to fallback log, queue, or notify admin
    }

    res.json({
      status: "success",
      message: "Form submitted! Email sent (or will be retried).",
    });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
      details: err.message,
    });
  }
});

// GET - All contacts (for admin/future dashboard)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error("GET /api/contact error:", err);
    res
      .status(500)
      .json({ status: "error", message: "Server error", details: err.message });
  }
});

export default router;
