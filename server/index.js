import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import taskRoutes from "../routes/tasksRoutes.js";
import { errorHandler } from "../middleware/errorHandler.js";

const app = express();
const PORT = 3000;

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/tasks", taskRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
