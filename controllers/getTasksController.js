import { getAllTasks } from "../services/taskService.js";

export async function getTasks(req, res, next) {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}
