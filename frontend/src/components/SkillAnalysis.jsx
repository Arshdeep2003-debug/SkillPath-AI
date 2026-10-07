import SkillCard from "./SkillCard.jsx";

function SkillAnalysis({ skillAnalysis }) {
    if (!skillAnalysis) {
        return (
            <section className="skill-analysis">
                <h2>Skill Analysis</h2>
                <p>Complete your assessment to see your skill analysis.</p>
            </section>
        );
    }

    const skills = [
        {
            name: "JavaScript",
            score: skillAnalysis.javascript.score
        },
        {
            name: "React",
            score: skillAnalysis.react.score
        },
        {
            name: "Node.js",
            score: skillAnalysis.node.score
        },
        {
            name: "SQL",
            score: skillAnalysis.sql.score
        }
    ];

    return (
        <section className="skill-analysis">
            <h2>Skill Analysis</h2>

            <div className="skill-grid">
                {skills.map((skill) => (
                    <SkillCard
                        key={skill.name}
                        name={skill.name}
                        score={skill.score}
                    />
                ))}
            </div>
        </section>
    );
}

export default SkillAnalysis;