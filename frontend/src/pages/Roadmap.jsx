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
                    <div className="roadmap-header">
                        <p className="page-eyebrow">YOUR LEARNING PLAN</p>
                        <h1>Learning Roadmap</h1>
                        <p className="page-description">
                            Your personalized path to career readiness.
                        </p>
                    </div>

                    <div className="roadmap-empty card">
                        <h2>Your roadmap starts here</h2>
                        <p>
                            Complete your skill assessment to generate a
                            personalized learning roadmap.
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="roadmap">
                <div className="roadmap-header">
                    <p className="page-eyebrow">YOUR LEARNING PLAN</p>
                    <h1>Learning Roadmap</h1>
                    <p className="page-description">
                        Focus on your biggest skill gaps and track your progress
                        toward your target career.
                    </p>
                </div>

                <div className="roadmap-list">
                    {roadmapSkills.map((skill) => (
                        <article className="roadmap-item card" key={skill.name}>
                            <div className="roadmap-item-header">
                                <div>
                                    <h2>{skill.name}</h2>
                                    <p className="roadmap-gap">
                                        Skill gap: <strong>{skill.gap}</strong>
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

                            <div className="roadmap-priority">
                                <span>Priority</span>
                                <strong
                                    className={`priority-${skill.priority.toLowerCase()}`}
                                >
                                    {skill.priority}
                                </strong>
                            </div>

                            <p className="roadmap-recommendation">
                                {skill.recommendation}
                            </p>

                            <button
                                className="roadmap-action"
                                onClick={() => handleRoadmapStatus(skill.name)}
                                disabled={skill.status === "Completed"}
                            >
                                {skill.status === "Not Started" && "Start learning"}
                                {skill.status === "In Progress" && "Mark as completed"}
                                {skill.status === "Completed" && "Completed"}
                            </button>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Roadmap;