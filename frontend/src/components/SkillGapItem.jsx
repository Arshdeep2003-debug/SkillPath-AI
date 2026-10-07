function SkillGapItem({ skill }) {
    return (
        <div className="gap-item">

            <strong>{skill.name}</strong>

            <span>Current: {skill.score}</span>

            <span>Required: {skill.required}</span>

            <span>Gap: {skill.gap}</span>

            <span>Role Importance: {skill.importance}/5</span>

            <span>Status: {skill.status}</span>

            <span>Priority: {skill.priority}</span>

            <span>Priority Score: {skill.priorityScore}</span>

            <p className="gap-recommendation">
                {skill.recommendation}
            </p>

            <p className="priority-reason">
                {skill.priorityReason}
            </p>

        </div>
    );
}

export default SkillGapItem;