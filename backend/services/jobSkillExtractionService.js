const skillKeywords = {
    javascript: [
        "javascript",
        "js"
    ],
    react: [
        "react",
        "react.js",
        "reactjs"
    ],
    node: [
        "node",
        "node.js",
        "nodejs"
    ],
    express: [
        "express",
        "express.js"
    ],
    mongodb: [
        "mongodb",
        "mongo"
    ],
    sql: [
        "sql",
        "mysql",
        "postgresql",
        "postgres"
    ],
    html: [
        "html",
        "html5"
    ],
    css: [
        "css",
        "css3"
    ],
    python: [
        "python"
    ],
    java: [
        "java"
    ],
    git: [
        "git",
        "github"
    ]
};

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractSkillsFromJobDescription(jobDescription) {
    const text = jobDescription.toLowerCase();

    const extractedSkills = [];

    for (const [skill, keywords] of Object.entries(skillKeywords)) {
        const found = keywords.some((keyword) => {
            const escapedKeyword = escapeRegex(keyword.toLowerCase());

            const pattern = new RegExp(
                `(?<![a-z0-9])${escapedKeyword}(?![a-z0-9])`
            );

            return pattern.test(text);
        });

        if (found) {
            extractedSkills.push(skill);
        }
    }

    return extractedSkills;
}