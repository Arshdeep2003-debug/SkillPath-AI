import mongoose from "mongoose";

const jobAnalysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        jobDescription: {
            type: String,
            required: true
        },

        extractedSkills: {
            type: [String],
            required: true
        },

        analysis: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        rankedSkills: {
            type: [mongoose.Schema.Types.Mixed],
            required: true
        },

        roadmap: {
            type: [mongoose.Schema.Types.Mixed],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const JobAnalysis = mongoose.model(
    "JobAnalysis",
    jobAnalysisSchema
);

export default JobAnalysis;