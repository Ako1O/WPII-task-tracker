import { deleteTask as removeTask } from "../services/taskService.js";

export async function deleteTask(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const deleted = await removeTask(id);

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
}
