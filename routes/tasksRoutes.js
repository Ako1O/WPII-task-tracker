import express from "express";
import { getTasks } from "../controllers/getTasksController.js";
import { getTaskById } from "../controllers/getTaskByIdController.js";
import { addTask } from "../controllers/addTaskController.js";
import { updateTask } from "../controllers/updateTaskController.js";
import { deleteTask } from "../controllers/deleteTaskController.js";
import { validateTask } from "../middleware/validateTask.js";
import { validateId } from "../middleware/validateId.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", validateId, getTaskById);
router.post("/", validateTask, addTask);
router.put("/:id", validateId, validateTask, updateTask);
router.delete("/:id", validateId, deleteTask);

export default router;
