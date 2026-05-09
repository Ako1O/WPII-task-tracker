import { getTaskById as findTask } from "../services/taskService.js";

export async function getTaskById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const task = await findTask(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
}
