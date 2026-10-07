const student = {
    name: "Arshdeep Pratap",
    targetRole: "Full Stack Developer",
    education: "Bachelor of Technology in Computer Science",
    javascript: 80,
    react: 70,
    node: 45,
    sql: 40
};

const targetSkills = {
    javascript: 80,
    react: 80,
    node: 75,
    sql: 70
};

const studentName = document.getElementById("student-name");
const targetRole = document.getElementById("target-role");
const education = document.getElementById("education");

studentName.textContent = student.name;
targetRole.textContent = student.targetRole;
education.textContent = student.education;

console.log(student);
console.log("SkillPath AI is running...");

const profileButton = document.getElementById("profile-btn");
const skillsContent = document.getElementById("skills-content");

const assessmentForm = document.getElementById("assessment-form");
const assessmentResult = document.getElementById("assessment-result");

const overallScoreElement = document.getElementById("overall-score");
const skillAssessedElement = document.getElementById("skills-assessed");

const skillGapResult = document.getElementById("skill-gap-result");
const roadmapResult = document.getElementById("roadmap-result");

const roadmapProgressElement = document.getElementById("roadmap-progress");

function getSkillStatus(score) {
    if (score >= 75) {
        return "Strong";
    }

    if (score >= 50) {
        return "Good";
    }

    return "Needs Improvement";
}

function calculateSkillGap(required, current) {
    return Math.max(0, required - current);
}

function getSkillPriority(gap) {
    if (gap >= 30) {
        return "High";
    }

    if (gap >= 10) {
        return "Medium";
    }

    return "Low";
}

assessmentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const javascriptScore = Number(
        document.getElementById("javascript-score").value
    );

    const reactScore = Number(
        document.getElementById("react-score").value
    );

    const nodeScore = Number(
        document.getElementById("node-score").value
    );

    const sqlScore = Number(
        document.getElementById("sql-score").value
    );

    if (
        javascriptScore < 0 || javascriptScore > 100 ||
        reactScore < 0 || reactScore > 100 ||
        nodeScore < 0 || nodeScore > 100 ||
        sqlScore < 0 || sqlScore > 100
    ) {
        alert("Please enter scores between 0 and 100.");
        return;
    }

    const assessment = {
        javascript: javascriptScore,
        react: reactScore,
        node: nodeScore,
        sql: sqlScore
    };

    const skillGaps = {
        javascript: calculateSkillGap(
            targetSkills.javascript,
            assessment.javascript
        ),

        react: calculateSkillGap(
            targetSkills.react,
            assessment.react
        ),

        node: calculateSkillGap(
            targetSkills.node,
            assessment.node
        ),

        sql: calculateSkillGap(
            targetSkills.sql,
            assessment.sql
        )
    };

    const priorities = {
        javascript: getSkillPriority(skillGaps.javascript),
        react: getSkillPriority(skillGaps.react),
        node: getSkillPriority(skillGaps.node),
        sql: getSkillPriority(skillGaps.sql)
    };

    const javascriptStatus = getSkillStatus(assessment.javascript);
    const reactStatus = getSkillStatus(assessment.react);
    const nodeStatus = getSkillStatus(assessment.node);
    const sqlStatus = getSkillStatus(assessment.sql);

    const skillAnalysis = {
        javascript: {
            score: assessment.javascript,
            gap: skillGaps.javascript,
            status: javascriptStatus,
            priority: priorities.javascript
        },

        react: {
            score: assessment.react,
            gap: skillGaps.react,
            status: reactStatus,
            priority: priorities.react
        },

        node: {
            score: assessment.node,
            gap: skillGaps.node,
            status: nodeStatus,
            priority: priorities.node
        },

        sql: {
            score: assessment.sql,
            gap: skillGaps.sql,
            status: sqlStatus,
            priority: priorities.sql
        }
    };

    const skillRanking = [
        {
            name: "JavaScript",
            gap: skillAnalysis.javascript.gap,
            priority: skillAnalysis.javascript.priority,
            status: "Not Started"
        },
        {
            name: "React",
            gap: skillAnalysis.react.gap,
            priority: skillAnalysis.react.priority,
            status: "Not Started"
        },
        {
            name: "Node.js",
            gap: skillAnalysis.node.gap,
            priority: skillAnalysis.node.priority,
            status: "Not Started"
        },
        {
            name: "SQL",
            gap: skillAnalysis.sql.gap,
            priority: skillAnalysis.sql.priority,
            status: "Not Started"
        }
    ];

    skillRanking.sort((a, b) => b.gap - a.gap);

    roadmapResult.innerHTML = `
    <h3>Recommended Learning Order</h3>

    <ol>
        ${skillRanking.map(skill => `
            <li>
                <strong>${skill.name}</strong>
                - Gap: ${skill.gap}
                - Priority: ${skill.priority}
                -Status: ${skill.status}
                <button class="start-skill" data-skill="${skill.name}">
                    ${skill.status === "Not Started" ? "Start" : "Complete"}
                </button>
            </li>
        `).join("")}
    </ol>
`;

    const startButtons = document.querySelectorAll(".start-skill");
   

    startButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const skillName = button.dataset.skill;

            const skill = skillRanking.find(function (item) {
                return item.name === skillName;
            });

            if (skill.status === "Not Started") {

                skill.status = "In Progress";
                button.textContent = "In Progress";

            } else if (skill.status === "In Progress") {

                skill.status = "Completed";
                button.textContent = "Completed";
                button.disabled = true;

            }

        });

    });
    console.log("Skill Ranking:", skillRanking);

    skillGapResult.innerHTML = `
    <div class="gap-item">
        <span>JavaScript</span>
        <span>Gap: ${skillAnalysis.javascript.gap}</span>
        <span>${skillAnalysis.javascript.priority}</span>
    </div>

    <div class="gap-item">
        <span>React</span>
        <span>Gap: ${skillAnalysis.react.gap}</span>
        <span>${skillAnalysis.react.priority}</span>
    </div>

    <div class="gap-item">
        <span>Node.js</span>
        <span>Gap: ${skillAnalysis.node.gap}</span>
        <span>${skillAnalysis.node.priority}</span>
    </div>

    <div class="gap-item">
        <span>SQL</span>
        <span>Gap: ${skillAnalysis.sql.gap}</span>
        <span>${skillAnalysis.sql.priority}</span>
    </div>
`;

    console.log("Priorities:", priorities);

    console.log("Skill Gaps:", skillGaps);

    console.log("Skill Analysis:", skillAnalysis);

    console.log("JavaScript:", javascriptStatus);
    console.log("React:", reactStatus);
    console.log("Node.js:", nodeStatus);
    console.log("SQL:", sqlStatus);

    const skillsAssessed = Object.keys(assessment).length;

    skillAssessedElement.textContent = `${skillsAssessed} / 4`;

    const overallScore =
        (assessment.javascript +
            assessment.react +
            assessment.node +
            assessment.sql) / 4;

    overallScoreElement.textContent = `${overallScore.toFixed(1)}%`;

    assessmentResult.innerHTML = `
        <h3>Assessment Submitted</h3>

        <p>Overall Score: ${overallScore.toFixed(1)}%</p>

        <p>
        JavaScript: ${assessment.javascript}%
        - ${javascriptStatus}
        - Priority: ${priorities.javascript}
    </p>

    <p>
        React: ${assessment.react}%
        - ${reactStatus}
        - Priority: ${priorities.react}
    </p>

    <p>
        Node.js: ${assessment.node}%
        - ${nodeStatus}
        - Priority: ${priorities.node}
    </p>

    <p>
        SQL: ${assessment.sql}%
        - ${sqlStatus}
        - Priority: ${priorities.sql}
    </p>
    `;
});

profileButton.addEventListener("click", function () {

    console.log("button clicked");

    skillsContent.innerHTML = `
        <h3>My Skills</h3>

        <div class="profile-skill">
            <span>JavaScript</span>
            <span class="skill-score">${student.javascript}%</span>
        </div>

        <div class="profile-skill">
            <span>React</span>
            <span class="skill-score">${student.react}%</span>
        </div>

        <div class="profile-skill">
            <span>Node.js</span>
            <span class="skill-score">${student.node}%</span>
        </div>

        <div class="profile-skill">
            <span>SQL</span>
            <span class="skill-score">${student.sql}%</span>
        </div>
    `;

    skillsContent.classList.toggle("hidden");

    if (skillsContent.classList.contains("hidden")) {
        profileButton.textContent = "View Skills";
    } else {
        profileButton.textContent = "Hide Skills";
    }
});