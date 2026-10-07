export function getSkillStatus(score) {
    if (score >= 75) {
        return "Strong";
    }

    if (score >= 50) {
        return "Good";
    }

    return "Needs Improvement";
}

export function calculateOverallScore(assessment) {
    return (
        assessment.javascript +
        assessment.react +
        assessment.node +
        assessment.sql
    ) / 4;
}

export function createAssessment(scores) {
    return {
        javascript: Number(scores.javascript),
        react: Number(scores.react),
        node: Number(scores.node),
        sql: Number(scores.sql)
    };
}

export function calculateSkillGap(required, current) {
    return Math.max(0, required - current);
}

export function getSkillPriority(gap) {
    if (gap >= 30) {
        return "High";
    }

    if (gap >= 10) {
        return "Medium";
    }

    return "Low";
}

export function calculatePriorityScore(gap, importance) {
    return gap * importance;
}

export function getPriorityReason(gap, importance) {
    if (gap === 0) {
        return "You already meet the required skill level.";
    }

    if (gap >= 30 && importance >= 4) {
        return "High priority because the skill has a large gap and strong importance for your target role.";
    }

    if (gap >= 30) {
        return "High priority because the skill has a large gap.";
    }

    if (importance >= 4) {
        return "Important for your target role and still needs improvement.";
    }

    return "Lower priority because the current gap is relatively small.";
}

export function analyzeSkill(required, current, skillName, importance) {
    const gap = calculateSkillGap(required, current);
    const status = getSkillStatus(current);
    const priority = getSkillPriority(gap);
    const priorityScore = calculatePriorityScore(gap, importance);
    const recommendation = getSkillRecommendation(skillName, gap);
    const priorityReason = getPriorityReason(gap, importance);

    return {
        score: current,
        required,
        importance,
        gap,
        priorityScore,
        status,
        priority,
        recommendation,
        priorityReason
    };
}

export function getSkillRecommendation(skillName, gap) {
    if (gap === 0) {
        return `${skillName} is at the required level. Focus on maintaining and applying this skill.`;
    }

    if (gap >= 30) {
        return `Prioritize ${skillName}. Build the fundamentals first and practice with projects.`;
    }

    return `Improve ${skillName} with focused practice and progressively harder projects.`;
}

export function rankSkills(skillAnalysis) {
    const skills = [
        {
            name: "JavaScript",
            ...skillAnalysis.javascript
        },
        {
            name: "React",
            ...skillAnalysis.react
        },
        {
            name: "Node.js",
            ...skillAnalysis.node
        },
        {
            name: "SQL",
            ...skillAnalysis.sql
        }
    ];

    return skills.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function validateAssessment(scores) {
    const values = Object.values(scores);

    const hasEmptyValue = values.some(
        (score) => score === ""
    );

    if (hasEmptyValue) {
        return "Please enter a score for every skill.";
    }

    const hasInvalidValue = values.some(
        (score) => Number(score) < 0 || Number(score) > 100
    );

    if (hasInvalidValue) {
        return "Scores must be between 0 and 100.";
    }

    return null;
}

export function calculateRoadmapProgress(roadmapSkills) {
    if (roadmapSkills.length === 0) {
        return 0;
    }

    const completedSkills = roadmapSkills.filter(
        (skill) => skill.status === "Completed"
    ).length;

    return Math.round(
        (completedSkills / roadmapSkills.length) * 100
    );
}