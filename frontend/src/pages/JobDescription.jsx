import { API_URL } from "../utils/api.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateRoadmapProgress } from "../utils/skillUtils.js";

function JobDescription() {
    const navigate = useNavigate();

    const [jobDescription, setJobDescription] = useState("");
    const [skills, setSkills] = useState([]);
    const [rankedSkills, setRankedSkills] = useState([]);
    const [roadmap, setRoadmap] = useState([]);
    const [jobAnalysisId, setJobAnalysisId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadLatestJobAnalysis() {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/api/job-description/latest`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 404) {
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to load job analysis.");
                }

                const result = await response.json();
                const data = result.data;
                setJobAnalysisId(data._id);

                setJobDescription(data.jobDescription);
                setSkills(data.extractedSkills);
                setRankedSkills(data.rankedSkills);
                setRoadmap(data.roadmap);
            } catch (error) {
                console.error(
                    "Failed to load latest job analysis:",
                    error.message
                );
            }
        }

        loadLatestJobAnalysis();
    }, []);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            setError("Please enter a job description.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/job-description`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        jobDescription
                    })
                }
            );

            const result = await response.json();

            if (response.status === 404) {
                setError(result.message);
                return;
            }

            if (!response.ok) {
                throw new Error(result.message);
            }

            setSkills(result.data.extractedSkills);
            setRankedSkills(result.data.rankedSkills);
            setRoadmap(result.data.roadmap);
            setJobAnalysisId(result.data.id);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoadmapStatus = async (skillName) => {
        if (!jobAnalysisId) {
            return;
        }

        const currentSkill = roadmap.find(
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

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/job-description/${jobAnalysisId}/roadmap/${encodeURIComponent(skillName)}`,
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

            setRoadmap(result.data);
        } catch (error) {
            console.error(
                "Failed to update job roadmap:",
                error.message
            );
        }
    };

    const roadmapProgress = calculateRoadmapProgress(roadmap);

    return (
        <main>
            <section>
                <h2>Job Description Analysis</h2>

                <textarea
                    rows="12"
                    value={jobDescription}
                    onChange={(event) =>
                        setJobDescription(event.target.value)
                    }
                    placeholder="Paste the job description here..."
                />

                <br />

                <button onClick={handleAnalyze} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze Job Description"}
                </button>

                {error && (
                    <div>
                        <p>{error}</p>

                        {error.includes("Complete an assessment") && (
                            <button onClick={() => navigate("/assessment")}>
                                Go to Assessment
                            </button>
                        )}
                    </div>
                )}

                {skills.length > 0 && (
                    <div>
                        <h3>Required Skills</h3>

                        {skills.map((skill) => (
                            <p key={skill}>{skill}</p>
                        ))}

                        <h3>Skill Gap Analysis</h3>

                        {rankedSkills.map((skill) => (
                            <div key={skill.name}>
                                <h4>{skill.name}</h4>

                                <p>
                                    Current Score:{" "}
                                    {skill.score === null ? "Not Assessed" : skill.score}
                                </p>

                                <p>Required: {skill.required}</p>

                                <p>
                                    Gap:{" "}
                                    {skill.gap === null ? "—" : skill.gap}
                                </p>

                                <p>Status: {skill.status}</p>
                                <p>Priority: {skill.priority}</p>
                                <p>{skill.recommendation}</p>
                            </div>
                        ))}

                        <h3>Job-Specific Roadmap</h3>

                        <p>
                            Roadmap Progress: {roadmapProgress}%
                        </p>

                        {roadmap.map((skill) => (
                            <div key={skill.name}>
                                <h4>{skill.name}</h4>

                                <p>Gap: {skill.gap === null ? "Not Assessed" : skill.gap}</p>
                                <p>Priority: {skill.priority}</p>
                                <p>Status: {skill.status}</p>
                                <p>{skill.recommendation}</p>
                                <button
                                    onClick={() => handleRoadmapStatus(skill.name)}
                                    disabled={skill.status === "Completed"}
                                >
                                    {skill.status === "Not Started" && "Start"}
                                    {skill.status === "In Progress" && "In Progress"}
                                    {skill.status === "Completed" && "Completed"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default JobDescription;