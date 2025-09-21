// loadEnv.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Make sure env loads relative to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
