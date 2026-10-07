import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export async function registerUser(req, res) {
    try {
        const { name, email, password, targetRole } = req.body;

        if (!name || !email || !password || !targetRole) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            targetRole
        });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                targetRole: user.targetRole,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registration failed.",
            error: error.message
        });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                targetRole: user.targetRole,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed.",
            error: error.message
        });
    }
}

export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.userId).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch current user.",
            error: error.message
        });
    }
}