function SkillCard({ name, score }) {
    return (
        <div className="skill-card">
            <div className="skill-info">
                <span>{name}</span>
                <span>{score}%</span>
            </div>

            <div className="progress">
                <div
                    className="progress-fill"
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
}

export default SkillCard;