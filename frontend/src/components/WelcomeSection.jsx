function WelcomeSection({ name, targetRole }) {
    return (
        <section className="welcome">
            <h1>Welcome back, {name}</h1>

            <p>
                Track your skills and prepare for your target career.
            </p>

            <span>{targetRole}</span>
        </section>
    );
}

export default WelcomeSection;