import { extractSkillsFromJobDescription } from "../services/jobSkillExtractionService.js";
import { analyzeJobSkills } from "../services/skillAnalysisService.js";
import { generateRoadmap } from "../services/roadmapService.js";
import Assessment from "../models/Assessment.js";
import JobAnalysis from "../models/JobAnalysis.js";

export async function analyzeJobDescription(req, res) {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                success: false,
                message: "Job description is required."
            });
        }

        const extractedSkills =
            extractSkillsFromJobDescription(jobDescription);

        if (extractedSkills.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No supported skills found in the job description."
            });
        }

        const assessment = await Assessment.findOne({
            userId: req.userId
        }).sort({ createdAt: -1 });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Complete an assessment before analyzing a job description."
            });
        }

        const jobAnalysis = analyzeJobSkills(
            extractedSkills,
            assessment.scores
        );

        const roadmap = generateRoadmap(
            jobAnalysis.rankedSkills
        );

        const savedJobAnalysis = await JobAnalysis.create({
            userId: req.userId,
            jobDescription,
            extractedSkills,
            analysis: jobAnalysis.analysis,
            rankedSkills: jobAnalysis.rankedSkills,
            roadmap
        });

        res.status(200).json({
            success: true,
            data: {
                id: savedJobAnalysis._id,
                extractedSkills,
                analysis: jobAnalysis.analysis,
                rankedSkills: jobAnalysis.rankedSkills,
                roadmap
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to analyze job description.",
            error: error.message
        });
    }
}

export async function getLatestJobAnalysis(req, res) {
    try {
        const jobAnalysis = await JobAnalysis.findOne({
            userId: req.userId
        }).sort({ createdAt: -1 });

        if (!jobAnalysis) {
            return res.status(404).json({
                success: false,
                message: "No job analysis found."
            });
        }

        res.status(200).json({
            success: true,
            data: jobAnalysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load latest job analysis.",
            error: error.message
        });
    }
}

export async function updateJobRoadmapStatus(req, res) {
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

        const jobAnalysis = await JobAnalysis.findOne({
            _id: id,
            userId: req.userId
        });

        if (!jobAnalysis) {
            return res.status(404).json({
                success: false,
                message: "Job analysis not found."
            });
        }

        const skill = jobAnalysis.roadmap.find(
            (item) => item.name === skillName
        );

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found in job roadmap."
            });
        }

        skill.status = status;

        jobAnalysis.markModified("roadmap");

        await jobAnalysis.save();

        res.status(200).json({
            success: true,
            message: "Job roadmap status updated.",
            data: jobAnalysis.roadmap
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update job roadmap status.",
            error: error.message
        });
    }
}