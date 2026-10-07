import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";

import validateAssessment from "../middleware/validateAssessment.js";

import {
    submitAssessment,
    getAssessments,
    getAssessmentById,
    getLatestAssessment,
    updateRoadmapStatus
} from "../controllers/assessmentController.js";

const router = express.Router();

router.get("/", authenticate, getAssessments);

router.get("/latest", authenticate, getLatestAssessment);

router.patch(
    "/:id/roadmap/:skillName",
    authenticate,
    updateRoadmapStatus
);

router.get("/:id", authenticate, getAssessmentById);

router.post(
    "/",
    authenticate,
    validateAssessment,
    submitAssessment
);

export default router;