import { Router } from "express";
import {
    createProject,
    deleteProject,
    getProjectById,
    getUserProjects,
    updateProject,
} from "../controllers/project.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

import taskRouter from "./task.routes.js";

const router = Router();

// Authentication for all project routes
router.use(authentication);

router.route("/").post(createProject)
router.route("/").get(getUserProjects);

router.route("/:projectId").get(getProjectById)
router.route("/:projectId").patch(updateProject)
router.route("/:projectId").delete(deleteProject);

// --- Nested route for tasks ---
router.use("/:projectId/tasks", taskRouter);

export default router;