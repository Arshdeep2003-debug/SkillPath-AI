function StudentProfile({ name, targetRole, education }) {
    return (
        <section className="student-profile card">

            <h2>Student Profile</h2>

            <p>
                Name: <span>{name}</span>
            </p>

            <p>
                Target Role: <span>{targetRole}</span>
            </p>

            <p>
                Education: <span>{education}</span>
            </p>

        </section>
    );
}

export default StudentProfile;