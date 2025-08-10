import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
            index: true,
        },
        description: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);