export function validateTask(req, res, next) {
  const { title, completed } = req.body;

  // Title is required for POST, optional for PUT
  if (req.method === "POST") {
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Title is required and must be a non-empty string" });
    }
  }

  // If title is provided in PUT, it must be valid
  if (req.method === "PUT" && title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Title must be a non-empty string" });
    }
  }

  // If completed is provided, it must be boolean
  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be a boolean value" });
  }

  next();
}
