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
                    body: JSON.stringify({ jobDescription })
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
            <section className="job-analysis">
                <header className="job-analysis-header">
                    <p className="page-eyebrow">CAREER MATCHING</p>
                    <h1>Job Description Analysis</h1>
                    <p className="page-description">
                        Discover the skills employers need, identify your gaps,
                        and build a focused learning plan for your target role.
                    </p>
                </header>

                <section className="job-input-panel card">
                    <label htmlFor="job-description-input">
                        Paste a job description
                    </label>

                    <p className="job-input-help">
                        Include the job requirements and preferred skills for
                        a more useful analysis.
                    </p>

                    <textarea
                        id="job-description-input"
                        className="job-description-input"
                        rows={9}
                        value={jobDescription}
                        onChange={(event) =>
                            setJobDescription(event.target.value)
                        }
                        placeholder="Paste the full job description here..."
                    />

                    <div className="job-form-footer">
                        <span className="job-input-count">
                            {jobDescription.trim()
                                ? `${jobDescription.trim().length} characters`
                                : "Your job description stays editable"}
                        </span>

                        <button
                            className="job-analyze-button"
                            onClick={handleAnalyze}
                            disabled={loading}
                        >
                            {loading ? "Analyzing..." : "Analyze Job Description"}
                        </button>
                    </div>

                    {error && (
                        <div className="job-error" role="alert">
                            <p>{error}</p>

                            {error.includes("Complete an assessment") && (
                                <button
                                    className="job-secondary-button"
                                    onClick={() => navigate("/assessment")}
                                >
                                    Go to Assessment
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {skills.length > 0 && (
                    <div className="job-results">
                        <section className="job-required-panel card">
                            <div className="job-section-heading">
                                <div>
                                    <p className="page-eyebrow">JOB REQUIREMENTS</p>
                                    <h2>Required Skills</h2>
                                </div>

                                <span className="job-count">
                                    {skills.length} skills found
                                </span>
                            </div>

                            <div className="required-skills-list">
                                {skills.map((skill) => (
                                    <span className="required-skill-chip" key={skill}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="job-section">
                            <div className="job-section-heading">
                                <div>
                                    <p className="page-eyebrow">YOUR CURRENT LEVEL</p>
                                    <h2>Skill Gap Analysis</h2>
                                    <p className="page-description">
                                        Compare your assessed scores with the
                                        requirements for this job.
                                    </p>
                                </div>
                            </div>

                            <div className="job-skill-grid">
                                {rankedSkills.map((skill) => (
                                    <article
                                        className="job-skill-card card"
                                        key={skill.name}
                                    >
                                        <div className="job-skill-card-header">
                                            <h3>{skill.name}</h3>

                                            <span
                                                className={`analysis-status status-${skill.status
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}`}
                                            >
                                                {skill.status}
                                            </span>
                                        </div>

                                        <div className="job-skill-metrics">
                                            <div>
                                                <span>Current score</span>
                                                <strong>
                                                    {skill.score === null
                                                        ? "Not assessed"
                                                        : `${skill.score}%`}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Required</span>
                                                <strong>{skill.required}%</strong>
                                            </div>

                                            <div>
                                                <span>Skill gap</span>
                                                <strong>
                                                    {skill.gap === null
                                                        ? "—"
                                                        : skill.gap}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="job-skill-priority">
                                            <span>Priority</span>
                                            <strong
                                                className={`priority-${skill.priority.toLowerCase()}`}
                                            >
                                                {skill.priority}
                                            </strong>
                                        </div>

                                        <p className="job-skill-recommendation">
                                            {skill.recommendation}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="job-section job-roadmap-section">
                            <div className="job-roadmap-header">
                                <div>
                                    <p className="page-eyebrow">YOUR NEXT STEPS</p>
                                    <h2>Job-Specific Roadmap</h2>
                                    <p className="page-description">
                                        Work through the recommended skills and
                                        track your progress.
                                    </p>
                                </div>

                                <div className="job-progress-summary">
                                    <strong>{roadmapProgress}%</strong>
                                    <span>Completed</span>
                                </div>
                            </div>

                            <div
                                className="job-progress-track"
                                role="progressbar"
                                aria-label="Job roadmap progress"
                                aria-valuenow={roadmapProgress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className="job-progress-fill"
                                    style={{ width: `${roadmapProgress}%` }}
                                />
                            </div>

                            <div className="job-roadmap-list">
                                {roadmap.map((skill) => (
                                    <article
                                        className="job-roadmap-card card"
                                        key={skill.name}
                                    >
                                        <div className="job-roadmap-card-header">
                                            <div>
                                                <h3>{skill.name}</h3>
                                                <p>
                                                    Gap:{" "}
                                                    {skill.gap === null
                                                        ? "Not assessed"
                                                        : skill.gap}
                                                </p>
                                            </div>

                                            <span
                                                className={`roadmap-status status-${skill.status
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}`}
                                            >
                                                {skill.status}
                                            </span>
                                        </div>

                                        <div className="job-skill-priority">
                                            <span>Priority</span>
                                            <strong
                                                className={`priority-${skill.priority.toLowerCase()}`}
                                            >
                                                {skill.priority}
                                            </strong>
                                        </div>

                                        <p className="job-skill-recommendation">
                                            {skill.recommendation}
                                        </p>

                                        <button
                                            className="roadmap-action"
                                            onClick={() =>
                                                handleRoadmapStatus(skill.name)
                                            }
                                            disabled={skill.status === "Completed"}
                                        >
                                            {skill.status === "Not Started" &&
                                                "Start learning"}
                                            {skill.status === "In Progress" &&
                                                "Mark as completed"}
                                            {skill.status === "Completed" &&
                                                "Completed"}
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </section>
        </main>
    );
}

export default JobDescription;