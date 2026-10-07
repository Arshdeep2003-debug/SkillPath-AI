function calculateSkillGap(required, current) {
    return Math.max(0, required - current);
}

function getSkillStatus(score) {
    if (score >= 75) return "Strong";
    if (score >= 50) return "Good";
    return "Needs Improvement";
}

function getSkillPriority(gap) {
    if (gap >= 30) return "High";
    if (gap >= 10) return "Medium";
    return "Low";
}

function calculatePriorityScore(gap, importance) {
    return gap * importance;
}

function getSkillRecommendation(skillName, gap) {
    if (gap === 0) {
        return `${skillName} is at the required level. Focus on maintaining and applying this skill.`;
    }

    if (gap >= 30) {
        return `Prioritize ${skillName}. Build the fundamentals first and practice with projects.`;
    }

    return `Improve ${skillName} with focused practice and progressively harder projects.`;
}

function getPriorityReason(gap, importance) {
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

function calculateOverallScore(scores) {
    const values = Object.values(scores);

    return values.reduce(
        (total, score) => total + score,
        0
    ) / values.length;
}

export function analyzeSkills(scores) {
    const targetSkills = {
        javascript: {
            required: 80,
            importance: 5
        },
        react: {
            required: 80,
            importance: 5
        },
        node: {
            required: 75,
            importance: 4
        },
        sql: {
            required: 70,
            importance: 3
        }
    };

    const skillAnalysis = {};

    for (const skill of Object.keys(targetSkills)) {
        const current = scores[skill];
        const required = targetSkills[skill].required;
        const importance = targetSkills[skill].importance;

        const gap = calculateSkillGap(required, current);
        const status = getSkillStatus(current);
        const priority = getSkillPriority(gap);
        const priorityScore = calculatePriorityScore(
            gap,
            importance
        );

        skillAnalysis[skill] = {
            score: current,
            required,
            importance,
            gap,
            priorityScore,
            status,
            priority,
            recommendation: getSkillRecommendation(
                skill,
                gap
            ),
            priorityReason: getPriorityReason(
                gap,
                importance
            )
        };
    }

    const rankedSkills = Object.entries(skillAnalysis)
        .map(([name, data]) => ({
            name,
            ...data
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

    return {
        overallScore: calculateOverallScore(scores),
        skillAnalysis,
        rankedSkills
    };
}

const jobSkillRequirements = {
        javascript: {
            required: 80,
            importance: 5
        },
        react: {
            required: 80,
            importance: 5
        },
        node: {
            required: 75,
            importance: 4
        },
        sql: {
            required: 70,
            importance: 3
        },
        mongodb: {
            required: 70,
            importance: 3
        },
        express: {
            required: 70,
            importance: 3
        },
        html: {
            required: 70,
            importance: 2
        },
        css: {
            required: 70,
            importance: 2
        },
        python: {
            required: 70,
            importance: 3
        },
        java: {
            required: 70,
            importance: 3
        },
        git: {
            required: 60,
            importance: 2
        }
    };

    export function analyzeJobSkills(requiredSkills, currentScores) {
        const analysis = {};

        for (const skill of requiredSkills) {
            const requirement = jobSkillRequirements[skill];

            if (!requirement) {
                continue;
            }

            const current = currentScores[skill];

            if (current === undefined) {
                analysis[skill] = {
                    score: null,
                    required: requirement.required,
                    importance: requirement.importance,
                    gap: null,
                    priorityScore: null,
                    status: "Not Assessed",
                    priority: "Assess First",
                    recommendation: `Assess your ${skill} skill level before creating a learning plan.`,
                    priorityReason: "This skill is required by the job but is not present in your current assessment."
                };

                continue;
            }

            const gap = calculateSkillGap(
                requirement.required,
                current
            );

            const priorityScore = calculatePriorityScore(
                gap,
                requirement.importance
            );

            analysis[skill] = {
                score: current,
                required: requirement.required,
                importance: requirement.importance,
                gap,
                priorityScore,
                status: getSkillStatus(current),
                priority: getSkillPriority(gap),
                recommendation: getSkillRecommendation(
                    skill,
                    gap
                ),
                priorityReason: getPriorityReason(
                    gap,
                    requirement.importance
                )
            };
        }

        const rankedSkills = Object.entries(analysis)
            .map(([name, data]) => ({
                name,
                ...data
            }))
            .sort((a, b) => {
                if (a.priorityScore === null) return -1;
                if (b.priorityScore === null) return 1;

                return b.priorityScore - a.priorityScore;
            });

        return {
            analysis,
            rankedSkills
        };
    }