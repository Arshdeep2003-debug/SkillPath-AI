import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="navbar">

            <div className="brand">
                <h2>SkillPath</h2>
            </div>

            <nav className="nav-links">
                {user ? (
                    <>
                        <NavLink to="/">Dashboard</NavLink>
                        <NavLink to="/assessment">Assessment</NavLink>
                        <NavLink to="/skill-gap">Skill Gap</NavLink>
                        <NavLink to="/roadmap">Roadmap</NavLink>
                        <NavLink to="/job-description">Job Analysis</NavLink>

                        <button onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </nav>

        </header>
    );
}

export default Navbar;