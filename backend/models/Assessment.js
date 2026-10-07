import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        
        targetRole: {
            type: String,
            required: true
        },

        scores: {
            javascript: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            },

            react: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            },

            node: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            },

            sql: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            }
        },

        overallScore: {
            type: Number,
            required: true
        },

        skillAnalysis: {
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

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;