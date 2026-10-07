import SkillGapItem from "../components/SkillGapItem.jsx";
import { rankSkills } from "../utils/skillUtils.js";
import { useSkillPath } from "../context/SkillPathContext.jsx";

function SkillGap() {
    const { skillAnalysis } = useSkillPath();

    if (!skillAnalysis) {
        return (
            <main>
                <section className="skill-gap">
                    <h2>Skill Gap Analysis</h2>
                    <p>
                        Complete your assessment to see your skill gaps.
                    </p>
                </section>
            </main>
        );
    }

    const skills = rankSkills(skillAnalysis);

    return (
        <main>
            <section className="skill-gap">
                <h2>Skill Gap Analysis</h2>

                {skills.map((skill) => (
                    <SkillGapItem
                        key={skill.name}
                        skill={skill}
                    />
                ))}
            </section>
        </main>
    );
}

export default SkillGap;