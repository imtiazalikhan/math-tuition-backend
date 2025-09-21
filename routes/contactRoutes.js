import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Setup transporter (example with Gmail – replace with your email & app password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password (not your main password)
  },
});

// POST - Save contact form
router.post("/", async (req, res) => {
  try {
    const { name, grade, phone } = req.body;
    if (!name || !grade || !phone) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields required" });
    }

    // Save to DB
    const newContact = new Contact({ name, grade, phone });
    await newContact.save();

    // Send Email
    await transporter.sendMail({
      from: `"Math Tuition" <${process.env.EMAIL_USER}>`,
      to: "your-admin-email@gmail.com",
      subject: "New Contact Form Submission",
      text: `New student inquiry:\nName: ${name}\nGrade: ${grade}\nPhone: ${phone}`,
    });

    res.json({ status: "success", message: "Form submitted & email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// GET - All contacts (for admin/future dashboard)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

export default router;
