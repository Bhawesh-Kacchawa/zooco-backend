import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import remindersRouter from './routes/reminders.js';
import petsRouter from './routes/pets.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  })
);
app.use(express.json());

// --- Health check (useful for deploy platforms + quick manual testing) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/reminders', remindersRouter);
app.use('/api/pets', petsRouter);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🐾 ZOOCO backend running on http://localhost:${PORT}`);
});
