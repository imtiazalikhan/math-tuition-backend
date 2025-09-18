import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// POST - Save contact form
router.post("/", async (req, res) => {
  try {
    const { name, grade, phone } = req.body;
    if (!name || !grade || !phone) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields required" });
    }
    const newContact = new Contact({ name, grade, phone });
    await newContact.save();
    res.json({ status: "success", message: "Form submitted!" });
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
