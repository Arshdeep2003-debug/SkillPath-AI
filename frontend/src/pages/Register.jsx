import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        targetRole: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setSuccess("Account created successfully.");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <main>
            <section className="auth-page">
                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />

                    <input
                        type="text"
                        name="targetRole"
                        placeholder="Target Role"
                        value={formData.targetRole}
                        onChange={handleChange}
                        required
                    />

                    {error && <p>{error}</p>}
                    {success && <p>{success}</p>}

                    <button type="submit">
                        Create Account
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Register;