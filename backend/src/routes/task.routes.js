import { Router } from "express";
import {
    createTask,
    deleteTask,
    getProjectTasks,
    updateTask,
} from "../controllers/task.controller.js";

// Important: { mergeParams: true } allows this router to access params from the parent route means ProjectRoute
const router = Router({ mergeParams: true });


router.route("/").post(createTask);
router.route("/").get(getProjectTasks);
router.route("/:taskId").patch(updateTask);
router.route("/:taskId").delete(deleteTask);

export default router;