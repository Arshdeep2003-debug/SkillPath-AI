import AssessmentForm from "../components/AssessmentForm.jsx";
import { useSkillPath } from "../context/SkillPathContext.jsx";

function Assessment() {
    const {
        handleSkillAnalysis,
        handleAssessmentSummary
    } = useSkillPath();

    return (
        <main>
            <AssessmentForm
                onSkillGapsCalculated={handleSkillAnalysis}
                onAssessmentSummary={handleAssessmentSummary}
            />
        </main>
    );
}

export default Assessment;