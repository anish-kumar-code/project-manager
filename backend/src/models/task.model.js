import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo",
        },
        dueDate: {
            type: Date,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Project ID is required"],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Owner ID is required"],
        },
    },
    { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);