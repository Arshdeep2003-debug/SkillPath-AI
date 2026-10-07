import { analyzeSkills } from "../services/skillAnalysisService.js";
import { generateRoadmap } from "../services/roadmapService.js";
import Assessment from "../models/Assessment.js";

export async function submitAssessment(req, res) {
    try {
        const { javascript, react, node, sql, targetRole } = req.body;
        const userId = req.userId;

        const scores = {
            javascript,
            react,
            node,
            sql
        };

        const analysis = analyzeSkills(scores);

        const roadmap = generateRoadmap(analysis.rankedSkills);

        const assessment = await Assessment.create({
            userId,
            targetRole,
            scores,
            overallScore: analysis.overallScore,
            skillAnalysis: analysis.skillAnalysis,
            rankedSkills: analysis.rankedSkills,
            roadmap
        });

        res.status(201).json({
            success: true,
            message: "Assessment saved successfully.",
            data: {
                id: assessment._id,
                overallScore: analysis.overallScore,
                skillAnalysis: analysis.skillAnalysis,
                rankedSkills: analysis.rankedSkills,
                roadmap
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save assessment.",
            error: error.message
        });
    }
}

export async function getAssessments(req, res) {
    try {
        const assessments = await Assessment
            .find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: assessments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch assessments.",
            error: error.message
        });
    }
}

export async function getAssessmentById(req, res) {
    try {
        const assessment = await Assessment.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Assessment not found."
            });
        }

        res.status(200).json({
            success: true,
            data: assessment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch assessment.",
            error: error.message
        });
    }
}

export async function getLatestAssessment(req, res) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required."
            });
        }

        const assessment = await Assessment
            .findOne({ userId: req.userId })
            .sort({ createdAt: -1 });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "No assessment found."
            });
        }

        res.status(200).json({
            success: true,
            data: assessment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch latest assessment.",
            error: error.message
        });
    }
}

export async function updateRoadmapStatus(req, res) {
    try {
        const { id, skillName } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Not Started",
            "In Progress",
            "Completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid roadmap status."
            });
        }

        const assessment = await Assessment.findOne({
            _id: id,
            userId: req.userId
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Assessment not found."
            });
        }

        const skill = assessment.roadmap.find(
            (item) => item.name === skillName
        );

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found in roadmap."
            });
        }

        skill.status = status;

        assessment.markModified("roadmap");

        await assessment.save();

        res.status(200).json({
            success: true,
            message: "Roadmap status updated.",
            data: assessment.roadmap
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update roadmap status.",
            error: error.message
        });
    }
}