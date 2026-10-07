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
                "http://localhost:5000/api/assessment",
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

            <h2>Skill Assessment</h2>


            <form onSubmit={handleSubmit}>

                <label>JavaScript</label>

                <input
                    type="number"
                    value={javascriptScore}
                    onChange={(event) =>
                        setJavascriptScore(event.target.value)
                    }
                    placeholder="0-100"
                />


                <label>React</label>

                <input
                    type="number"
                    value={reactScore}
                    onChange={(event) =>
                        setReactScore(event.target.value)
                    }
                    placeholder="0-100"
                />


                <label>Node.js</label>

                <input
                    type="number"
                    value={nodeScore}
                    onChange={(event) =>
                        setNodeScore(event.target.value)
                    }
                    placeholder="0-100"
                />


                <label>SQL</label>

                <input
                    type="number"
                    value={sqlScore}
                    onChange={(event) =>
                        setSqlScore(event.target.value)
                    }
                    placeholder="0-100"
                />

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Assessment"}
                </button>

            </form>


            {assessmentResult !== null && (
                <div className="assessment-result">

                    <h3>Assessment Submitted</h3>

                    <p>
                        Overall Score:{" "}
                        {result.overallScore.toFixed(1)}%
                    </p>

                    <p>
                        JavaScript:{" "}
                        {result.assessment.javascript}%
                        {" - "}
                        {result.skillAnalysis.javascript.status}
                    </p>

                    <p>
                        React:{" "}
                        {result.assessment.react}%
                        {" - "}
                        {result.skillAnalysis.react.status}
                    </p>

                    <p>
                        Node.js:{" "}
                        {result.assessment.node}%
                        {" - "}
                        {result.skillAnalysis.node.status}
                    </p>

                    <p>
                        SQL:{" "}
                        {result.assessment.sql}%
                        {" - "}
                        {result.skillAnalysis.sql.status}
                    </p>

                </div>
            )}

        </section>

    );

}

export default AssessmentForm;