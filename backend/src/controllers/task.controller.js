import mongoose from "mongoose";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create a task within a specific project
const createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, description, dueDate } = req.body;

    if (!title) {
        throw new ApiError(400, "Task title is required");
    }

    // Verify the project exists and the user owns it
    const project = await Project.findById(projectId);
    if (!project || project.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(404, "Project not found or you don't have permission");
    }

    const task = await Task.create({
        title,
        description,
        dueDate,
        project: projectId,
        owner: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task created successfully"));
});


// get all tasks for a specific project
const getProjectTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const { page = 1, limit = 10, search = '', status } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Verify the project exists and the user owns it
    const project = await Project.findById(projectId);
    if (!project || project.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(404, "Project not found or you don't have permission");
    }

    const query = { project: projectId };

    if (status && ["todo", "in-progress", "done"].includes(status)) {
        query.status = status;
    }

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const skip = (pageNum - 1) * limitNum;

    const [tasks, totalTasks] = await Promise.all([
        Task.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
        Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalTasks / limitNum);

    // Structure the response
    const responseData = {
        tasks,
        pagination: {
            totalTasks,
            totalPages,
            currentPage: pageNum,
            limit: limitNum,
        },
    };

    return res.status(200).json(new ApiResponse(200, responseData, "Tasks retrieved successfully"));
});


// update a task's details
const updateTask = asyncHandler(async (req, res) => {
    console.log(req.params)
    const { taskId } = req.params;
    const { title, description, status, dueDate } = req.body;

    if (!mongoose.isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid task ID");
    }

    // Verify task exists and user owns it
    const taskToUpdate = await Task.findById(taskId);
    if (!taskToUpdate || taskToUpdate.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(404, "Task not found or you don't have permission");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: { title, description, status, dueDate },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});


// delete a task
const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid task ID");
    }

    // Verify task exists and user owns it
    const taskToDelete = await Task.findById(taskId);
    if (!taskToDelete || taskToDelete.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(404, "Task not found or you don't have permission");
    }

    await Task.findByIdAndDelete(taskId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});


export { createTask, getProjectTasks, updateTask, deleteTask };