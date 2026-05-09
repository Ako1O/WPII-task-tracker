export function validateId(req, res, next) {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "ID must be a positive integer" });
  }

  next();
}
