import { useSkillPath } from "../context/SkillPathContext.jsx";

function Roadmap() {
    const {
        roadmapSkills,
        handleRoadmapStatus
    } = useSkillPath();

    if (roadmapSkills.length === 0) {
        return (
            <main>
                <section className="roadmap">
                    <h2>Roadmap</h2>
                    <p>
                        Complete your assessment to generate your roadmap.
                    </p>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="roadmap">
                <h2>Learning Roadmap</h2>

                {roadmapSkills.map((skill) => (
                    <div className="roadmap-item" key={skill.name}>
                        <h3>{skill.name}</h3>

                        <p>Gap: {skill.gap}</p>
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
            </section>
        </main>
    );
}

export default Roadmap;