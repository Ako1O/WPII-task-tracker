import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data/tasks.json");

// Read all tasks from JSON file
async function readTasks() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist yet, return empty array
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

// Write tasks array back to JSON file
async function writeTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// Get all tasks
export async function getAllTasks() {
  return await readTasks();
}

// Get single task by id
export async function getTaskById(id) {
  const tasks = await readTasks();
  return tasks.find((t) => t.id === id) || null;
}

// Create a new task
export async function createTask(title) {
  const tasks = await readTasks();

  // Generate next id (simple increment)
  const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

  const newTask = {
    id: nextId,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  await writeTasks(tasks);
  return newTask;
}

// Update an existing task
export async function updateTask(id, updates) {
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return null;

  // Only allow updating title and completed fields
  if (updates.title !== undefined) {
    tasks[index].title = updates.title.trim();
  }
  if (updates.completed !== undefined) {
    tasks[index].completed = updates.completed;
  }

  await writeTasks(tasks);
  return tasks[index];
}

// Delete a task
export async function deleteTask(id) {
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return false;

  tasks.splice(index, 1);
  await writeTasks(tasks);
  return true;
}
