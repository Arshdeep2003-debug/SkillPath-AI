import { API_URL } from "../utils/api.js";

import { useState } from "react";
import { student } from "../data.js";

import {
    createAssessment,
    validateAssessment
} from "../utils/skillUtils.js";

import { targetSkills } from "../data.js";


function AssessmentForm({ onSkillGapsCalculated, onAssessmentSummary }) {

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [javascriptScore, setJavascriptScore] = useState("");
    const [reactScore, setReactScore] = useState("");
    const [nodeScore, setNodeScore] = useState("");
    const [sqlScore, setSqlScore] = useState("");

    const [assessmentResult, setAssessmentResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const scores = {
            javascript: javascriptScore,
            react: reactScore,
            node: nodeScore,
            sql: sqlScore
        };

        const validationError = validateAssessment(scores);

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const assessment = {
                ...createAssessment(scores),
                targetRole: student.targetRole
            };

            const response = await fetch(
                `${API_URL}/api/assessment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(assessment)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Assessment submission failed."
                );
            }

            const { overallScore, skillAnalysis } = result.data;

            setAssessmentResult({
                assessment,
                overallScore,
                skillAnalysis
            });

            onSkillGapsCalculated(
                skillAnalysis,
                result.data.roadmap,
                result.data.id
            );

            onAssessmentSummary({
                overallScore,
                skillsAssessed: 4
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const result = assessmentResult;


    return (
        <section className="assessment card">
            <div className="assessment-header">
                <p className="page-eyebrow">SKILL EVALUATION</p>
                <h2>Skill Assessment</h2>
                <p className="page-description">
                    Rate your current skills from 0 to 100 to identify
                    your strengths and areas for improvement.
                </p>
            </div>

            <form className="assessment-form" onSubmit={handleSubmit}>
                <div className="assessment-fields">
                    <div className="assessment-field">
                        <label htmlFor="javascript-score">JavaScript</label>
                        <input
                            id="javascript-score"
                            type="number"
                            min="0"
                            max="100"
                            value={javascriptScore}
                            onChange={(event) =>
                                setJavascriptScore(event.target.value)
                            }
                            placeholder="Enter score (0–100)"
                            required
                        />
                    </div>

                    <div className="assessment-field">
                        <label htmlFor="react-score">React</label>
                        <input
                            id="react-score"
                            type="number"
                            min="0"
                            max="100"
                            value={reactScore}
                            onChange={(event) =>
                                setReactScore(event.target.value)
                            }
                            placeholder="Enter score (0–100)"
                            required
                        />
                    </div>

                    <div className="assessment-field">
                        <label htmlFor="node-score">Node.js</label>
                        <input
                            id="node-score"
                            type="number"
                            min="0"
                            max="100"
                            value={nodeScore}
                            onChange={(event) =>
                                setNodeScore(event.target.value)
                            }
                            placeholder="Enter score (0–100)"
                            required
                        />
                    </div>

                    <div className="assessment-field">
                        <label htmlFor="sql-score">SQL</label>
                        <input
                            id="sql-score"
                            type="number"
                            min="0"
                            max="100"
                            value={sqlScore}
                            onChange={(event) =>
                                setSqlScore(event.target.value)
                            }
                            placeholder="Enter score (0–100)"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <p className="assessment-error" role="alert">
                        {error}
                    </p>
                )}

                <button
                    className="assessment-submit"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Assessment"}
                </button>
            </form>

            {assessmentResult !== null && (
                <div className="assessment-result">
                    <div className="assessment-result-header">
                        <div>
                            <p className="page-eyebrow">ASSESSMENT COMPLETE</p>
                            <h3>Your Results</h3>
                        </div>

                        <div className="assessment-overall">
                            <span>Overall score</span>
                            <strong>{result.overallScore.toFixed(1)}%</strong>
                        </div>
                    </div>

                    <div className="assessment-result-grid">
                        {[
                            {
                                name: "JavaScript",
                                score: result.assessment.javascript,
                                status: result.skillAnalysis.javascript.status
                            },
                            {
                                name: "React",
                                score: result.assessment.react,
                                status: result.skillAnalysis.react.status
                            },
                            {
                                name: "Node.js",
                                score: result.assessment.node,
                                status: result.skillAnalysis.node.status
                            },
                            {
                                name: "SQL",
                                score: result.assessment.sql,
                                status: result.skillAnalysis.sql.status
                            }
                        ].map((skill) => (
                            <div
                                className="assessment-result-item"
                                key={skill.name}
                            >
                                <div className="assessment-result-item-header">
                                    <span>{skill.name}</span>
                                    <strong>{skill.score}%</strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${skill.score}%` }}
                                    />
                                </div>

                                <span className="assessment-skill-status">
                                    {skill.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );

}

export default AssessmentForm;