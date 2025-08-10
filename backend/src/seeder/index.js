import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Load environment variables
dotenv.config({ path: "config.env", debug: true });

// Load models
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";

const DB_NAME = "projectmanager";

// Connect to DB
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB connected for seeding...");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Function to import data
const importData = async () => {
    try {
        // 1. Clear existing data
        await Task.deleteMany();
        await Project.deleteMany();
        await User.deleteMany();
        console.log("Old data destroyed...");

        const createdUser = await User.create({
            email: "test@example.com",
            fullName: "Test User",
            password: "Test@123",
        });
        console.log("User created...");

        // 3. Create two projects for this user
        const projects = [
            {
                title: "Frontend Development",
                description: "Build the React frontend for the project manager.",
                owner: createdUser._id,
            },
            {
                title: "API Finalization",
                description: "Complete and test all backend API endpoints.",
                owner: createdUser._id,
                status: "completed",
            },
        ];

        const createdProjects = await Project.insertMany(projects);
        console.log("Projects created...");

        // 4. Create three tasks for each project
        const tasks = [
            // Tasks for Project 1
            { title: "Setup React Project", project: createdProjects[0]._id, owner: createdUser._id },
            { title: "Design Login Page", project: createdProjects[0]._id, owner: createdUser._id, status: "in-progress" },
            { title: "Implement State Management", project: createdProjects[0]._id, owner: createdUser._id },
            // Tasks for Project 2
            { title: "Write Seeder Script", project: createdProjects[1]._id, owner: createdUser._id, status: "done" },
            { title: "Add API Documentation", project: createdProjects[1]._id, owner: createdUser._id, status: "in-progress" },
            { title: "Test Authentication Flow", project: createdProjects[1]._id, owner: createdUser._id, status: "done" },
        ];

        await Task.insertMany(tasks);
        console.log("Tasks created...");

        console.log("Data Imported Successfully!");
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Function to destroy data
const destroyData = async () => {
    try {
        await Task.deleteMany();
        await Project.deleteMany();
        await User.deleteMany();

        console.log("Data Destroyed Successfully!");
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Script execution logic
(async () => {
    await connectDB();

    if (process.argv[2] === "-d") {
        await destroyData();
    } else {
        await importData();
    }
})();