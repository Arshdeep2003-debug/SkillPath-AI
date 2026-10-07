import { useSkillPath } from "../context/SkillPathContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import WelcomeSection from "../components/WelcomeSection.jsx";
import OverviewCards from "../components/OverviewCards.jsx";
import SkillAnalysis from "../components/SkillAnalysis.jsx";
import StudentProfile from "../components/StudentProfile.jsx";

function Dashboard() {
    const {
        skillAnalysis,
        assessmentSummary,
        roadmapProgress
    } = useSkillPath();

    const { user } = useAuth();

    return (
        <main>
            <WelcomeSection
                name={user?.name}
                targetRole={user?.targetRole}
            />

            <OverviewCards
                overallScore={
                    assessmentSummary.overallScore === null
                        ? "—"
                        : `${assessmentSummary.overallScore.toFixed(1)}%`
                }
                skillsAssessed={`${assessmentSummary.skillsAssessed} / 4`}
                roadmapProgress={`${roadmapProgress}%`}
            />

            <div className="dashboard-grid">
                <SkillAnalysis skillAnalysis={skillAnalysis} />

                <StudentProfile
                    name={user?.name}
                    targetRole={user?.targetRole}
                    education="Education not added"
                />
            </div>
        </main>
    );
}

export default Dashboard;