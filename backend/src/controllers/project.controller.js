import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create a new project
const createProject = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const project = await Project.create({
        title,
        description,
        owner: req.user?._id,
    });

    if (!project) {
        throw new ApiError(500, "Something went wrong while creating the project");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});


// get all projects or seach project
const getUserProjects = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query = { owner: req.user._id };
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    // Step 1: Fetch the main list of projects for the current page
    const projects = await Project.find(query)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .sort({ createdAt: -1 })
        .lean(); // Use .lean() for better performance when modifying objects

    // Step 2: Get the total count for pagination
    const totalProjects = await Project.countDocuments(query);

    // Step 3: Loop through each project to get its specific task counts
    for (const project of projects) {
        const taskQuery = { project: project._id };

        // Run count queries for each project
        const [total, todo, inProgress, done] = await Promise.all([
            Task.countDocuments(taskQuery),
            Task.countDocuments({ ...taskQuery, status: 'todo' }),
            Task.countDocuments({ ...taskQuery, status: 'in-progress' }),
            Task.countDocuments({ ...taskQuery, status: 'done' }),
        ]);

        // Attach the counts to the project object
        project.totalTasks = total;
        project.todoTasks = todo;
        project.inProgressTasks = inProgress;
        project.doneTasks = done;
    }

    // --- Structure and send the final response ---
    const totalPages = Math.ceil(totalProjects / limitNum);
    const responseData = {
        projects,
        pagination: {
            totalProjects,
            totalPages,
            currentPage: pageNum,
            hasNextPage: pageNum < totalPages,
        },
    };

    return res.status(200).json(new ApiResponse(200, responseData, "Projects and their task counts retrieved successfully"));
});


// get a single project by its ID
const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Security Check: Ensure the person requesting the project is the owner
    if (project.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this project");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project retrieved successfully"));
});


// update a project's details
const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, description, status } = req.body;

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID");
    }

    if (!title && !description && !status) {
        throw new ApiError(400, "At least one field (title, description, status) is required to update");
    }

    // First, find the project to verify ownership
    const projectToUpdate = await Project.findById(projectId);
    if (!projectToUpdate) {
        throw new ApiError(404, "Project not found");
    }
    if (projectToUpdate.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this project");
    }

    // Now, update the project
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $set: { title, description, status },
        },
        { new: true } // return project after update
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProject, "Project updated successfully"));
});


// delete a project
const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID");
    }

    // First, find the project to verify ownership
    const projectToDelete = await Project.findById(projectId);
    if (!projectToDelete) {
        throw new ApiError(404, "Project not found");
    }
    if (projectToDelete.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this project");
    }

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    // Important: Delete all tasks of this project
    await Task.deleteMany({ project: projectId });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Project and their tasks deleted successfully"));
});


export {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
};