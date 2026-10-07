function validateAssessment(req, res, next) {
    const { javascript, react, node, sql } = req.body;

    const scores = {
        javascript,
        react,
        node,
        sql
    };

    const hasMissingScore = Object.values(scores).some(
        (score) => score === undefined || score === ""
    );

    if (hasMissingScore) {
        return res.status(400).json({
            success: false,
            message: "All skill scores are required."
        });
    }

    const hasInvalidScore = Object.values(scores).some(
        (score) => typeof score !== "number" || score < 0 || score > 100
    );

    if (hasInvalidScore) {
        return res.status(400).json({
            success: false,
            message: "Skill scores must be numbers between 0 and 100."
        });
    }

    next();
}

export default validateAssessment;