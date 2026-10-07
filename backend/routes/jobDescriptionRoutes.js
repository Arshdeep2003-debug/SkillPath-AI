import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";

import {
    analyzeJobDescription,
    getLatestJobAnalysis,
    updateJobRoadmapStatus
} from "../controllers/jobDescriptionController.js";

const router = express.Router();

router.get("/latest", authenticate, getLatestJobAnalysis);

router.patch(
    "/:id/roadmap/:skillName",
    authenticate,
    updateJobRoadmapStatus
);

router.post("/", authenticate, analyzeJobDescription);

export default router;