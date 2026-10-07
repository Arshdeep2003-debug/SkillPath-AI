import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jobDescriptionRoutes from "./routes/jobDescriptionRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "SkillPath AI backend is running"
    });
});

app.use("/api/health", healthRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/job-description", jobDescriptionRoutes);

async function startServer() {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();