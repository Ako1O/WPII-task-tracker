import { createTask } from "../services/taskService.js";

export async function addTask(req, res, next) {
  try {
    const { title } = req.body;
    const newTask = await createTask(title);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
}
