function OverviewCards({ overallScore, skillsAssessed, roadmapProgress }) {
    return (
        <section className="overview">

            <div className="card">
                <h3>Overall Score</h3>
                <p>{overallScore}</p>
            </div>

            <div className="card">
                <h3>Skills Assessed</h3>
                <p>{skillsAssessed}</p>
            </div>

            <div className="card">
                <h3>Roadmap Progress</h3>
                <p>{roadmapProgress}</p>
            </div>

        </section>
    );
}

export default OverviewCards;