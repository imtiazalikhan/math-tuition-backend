// ✅ Load .env before anything else
import "./loadEnv.js";

import express from "express";
import cors from "cors";
import dbConnect from "./lib/dbConnect.js";
import contactRoutes from "./routes/contactRoutes.js";
import rateLimit from "express-rate-limit";

// Debug print
console.log("✅ MONGO_URI:", process.env.MONGO_URI);
console.log("✅ EMAIL_USER:", process.env.EMAIL_USER);
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

const app = express();
app.use(cors());
app.use(express.json());

// 🚫 Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: "error",
    message: "Too many submissions from this IP. Please try again later.",
  },
});

// 🧠 Connect to DB
dbConnect()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connect error", err));

app.use("/api/contact", limiter, contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
