import { createContext, useContext, useEffect, useState } from "react";

import { calculateRoadmapProgress } from "../utils/skillUtils.js";
import { useAuth } from "./AuthContext.jsx";

const SkillPathContext = createContext();

export function SkillPathProvider({ children }) {
    const { user, loading: authLoading } = useAuth();
    const [skillAnalysis, setSkillAnalysis] = useState(null);

    const [roadmapSkills, setRoadmapSkills] = useState([]);

    const [assessmentSummary, setAssessmentSummary] = useState({
        overallScore: null,
        skillsAssessed: 0
    });

    const [assessmentId, setAssessmentId] = useState(null);

    useEffect(() => {
    if (authLoading) {
        return;
    }

    // Clear previous user's assessment first
    setSkillAnalysis(null);
    setRoadmapSkills([]);

    setAssessmentSummary({
        overallScore: null,
        skillsAssessed: 0
    });

    if (!user) {
        setAssessmentId(null);
        return;
    }

    async function loadLatestAssessment() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/assessment/latest",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // New user has not taken an assessment yet
            if (response.status === 404) {
                setAssessmentId(null);
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to load latest assessment."
                );
            }

            const result = await response.json();
            const latestAssessment = result.data;
            setAssessmentId(latestAssessment._id);

            setSkillAnalysis(
                latestAssessment.skillAnalysis
            );

            setRoadmapSkills(
                latestAssessment.roadmap
            );

            setAssessmentSummary({
                overallScore: latestAssessment.overallScore,
                skillsAssessed: Object.keys(
                    latestAssessment.scores || {}
                ).length
            });
        } catch (error) {
            console.error(
                "Failed to load latest assessment:",
                error.message
            );

            // Keep new user dashboard empty if loading fails
            setSkillAnalysis(null);
            setRoadmapSkills([]);

            setAssessmentSummary({
                overallScore: null,
                skillsAssessed: 0
            });
        }
    }

    loadLatestAssessment();
}, [user, authLoading]);

    const handleSkillAnalysis = (analysis, roadmap, id) => {
        setSkillAnalysis(analysis);
        setRoadmapSkills(roadmap);
        setAssessmentId(id);
    };

   const handleRoadmapStatus = async (skillName) => {
    let currentAssessmentId = assessmentId;

    try {
        // If the assessment was just created and its ID
        // is not in state yet, get the latest assessment.
        if (!currentAssessmentId) {
            const token = localStorage.getItem("token");

            const latestResponse = await fetch(
                "http://localhost:5000/api/assessment/latest",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!latestResponse.ok) {
                throw new Error(
                    "Could not find the current assessment."
                );
            }

            const latestResult = await latestResponse.json();

            currentAssessmentId = latestResult.data._id;

            setAssessmentId(currentAssessmentId);
        }

        const currentSkill = roadmapSkills.find(
            (skill) => skill.name === skillName
        );

        if (!currentSkill) {
            return;
        }

        let nextStatus;

        if (currentSkill.status === "Not Started") {
            nextStatus = "In Progress";
        } else if (currentSkill.status === "In Progress") {
            nextStatus = "Completed";
        } else {
            return;
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:5000/api/assessment/${currentAssessmentId}/roadmap/${encodeURIComponent(skillName)}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: nextStatus
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        setRoadmapSkills(result.data);
    } catch (error) {
        console.error(
            "Failed to update roadmap status:",
            error.message
        );
    }
};

    const handleAssessmentSummary = (summary) => {
        setAssessmentSummary(summary);
    };

    const roadmapProgress = calculateRoadmapProgress(roadmapSkills);

    const value = {
        assessmentId,
        skillAnalysis,
        roadmapSkills,
        assessmentSummary,
        roadmapProgress,
        handleSkillAnalysis,
        handleRoadmapStatus,
        handleAssessmentSummary
    };

    return (
        <SkillPathContext.Provider value={value}>
            {children}
        </SkillPathContext.Provider>
    );
}

export function useSkillPath() {
    return useContext(SkillPathContext);
}