// Centralized error handler — every controller forwards errors here via next(err)
export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  // Prisma "record not found" errors
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  // Prisma foreign key constraint errors (e.g. invalid petId)
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Invalid reference — check petId exists' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on the server',
  });
}

// 404 handler for unmatched routes
export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}
