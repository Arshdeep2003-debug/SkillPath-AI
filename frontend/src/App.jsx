import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { SkillPathProvider } from "./context/SkillPathContext.jsx";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Assessment from "./pages/Assessment.jsx";
import SkillGap from "./pages/SkillGap.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Login from "./pages/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Register from "./pages/Register.jsx";
import JobDescription from "./pages/JobDescription.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SkillPathProvider>
                    <div className="app">
                        <Navbar />

                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/assessment"
                                element={
                                    <ProtectedRoute>
                                        <Assessment />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/skill-gap"
                                element={
                                    <ProtectedRoute>
                                        <SkillGap />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/roadmap"
                                element={
                                    <ProtectedRoute>
                                        <Roadmap />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/job-description"
                                element={
                                    <ProtectedRoute>
                                        <JobDescription />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/login"
                                element={<Login />}
                            />

                            <Route
                                path="/register"
                                element={<Register />}
                            />

                            <Route
                                path="*"
                                element={<Navigate to="/login" replace />}
                            />
                        </Routes>
                    </div>
                </SkillPathProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;