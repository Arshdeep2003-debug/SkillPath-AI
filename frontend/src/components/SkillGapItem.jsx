function SkillGapItem({ skill }) {
    const statusClass = skill.status
        .toLowerCase()
        .replace(/\s+/g, "-");

    const priorityClass = skill.priority
        .toLowerCase()
        .replace(/\s+/g, "-");

    return (
        <article className="gap-item card">
            <div className="gap-item-header">
                <div>
                    <h3>{skill.name}</h3>
                    <p className="gap-importance">
                        Role importance: {skill.importance}/5
                    </p>
                </div>

                <span className={`gap-status status-${statusClass}`}>
                    {skill.status}
                </span>
            </div>

            <div className="gap-metrics">
                <div className="gap-metric">
                    <span>Current score</span>
                    <strong>{skill.score}%</strong>
                </div>

                <div className="gap-metric">
                    <span>Required level</span>
                    <strong>{skill.required}%</strong>
                </div>

                <div className="gap-metric">
                    <span>Skill gap</span>
                    <strong>{skill.gap}</strong>
                </div>
            </div>

            <div className="gap-priority">
                <span>Priority</span>
                <strong className={`priority-${priorityClass}`}>
                    {skill.priority}
                </strong>
                <span className="gap-priority-score">
                    Priority score: {skill.priorityScore}
                </span>
            </div>

            <div className="gap-recommendation">
                <h4>Recommended action</h4>
                <p>{skill.recommendation}</p>
            </div>

            <p className="priority-reason">
                {skill.priorityReason}
            </p>
        </article>
    );
}

export default SkillGapItem;