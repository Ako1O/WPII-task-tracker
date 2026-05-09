import { updateTask as modifyTask } from "../services/taskService.js";

export async function updateTask(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    const updated = await modifyTask(id, updates);

    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
}
