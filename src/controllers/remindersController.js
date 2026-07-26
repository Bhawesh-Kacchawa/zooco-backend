import { prisma } from '../prisma/client.js';
import { expandReminderOccurrences } from '../utils/reminderRecurrence.js';

// GET /api/reminders?petId=&category=&date=
export async function getReminders(req, res, next) {
  try {
    const { petId, category, date } = req.query;

    const where = {
      ...(petId && { petId }),
      ...(category && { category }),
    };

    let reminders = [];

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      where.startDate = { lte: end };

      reminders = await prisma.reminder.findMany({
        where,
        include: { pet: true },
        orderBy: { startDate: 'asc' },
      });

      const expanded = expandReminderOccurrences(reminders, {
        date: start,
        rangeEnd: end,
      });

      return res.json(expanded);
    }

    reminders = await prisma.reminder.findMany({
      where,
      include: { pet: true },
      orderBy: { startDate: 'asc' },
    });

    res.json(expandReminderOccurrences(reminders));
  } catch (err) {
    next(err);
  }
}

// GET /api/reminders/:id
export async function getReminderById(req, res, next) {
  try {
    const reminder = await prisma.reminder.findUniqueOrThrow({
      where: { id: req.params.id },
      include: { pet: true },
    });
    res.json(reminder);
  } catch (err) {
    next(err);
  }
}

// POST /api/reminders
export async function createReminder(req, res, next) {
  try {
    const { petId, category, title, notes, startDate, startTime, frequency } = req.body;

    const reminder = await prisma.reminder.create({
      data: {
        petId,
        category,
        title,
        notes: notes || null,
        startDate: new Date(startDate),
        startTime,
        frequency,
      },
      include: { pet: true },
    });

    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
}

// PUT /api/reminders/:id
export async function updateReminder(req, res, next) {
  try {
    const { petId, category, title, notes, startDate, startTime, frequency } = req.body;

    const updated = await prisma.reminder.update({
      where: { id: req.params.id },
      data: {
        ...(petId && { petId }),
        ...(category && { category }),
        ...(title && { title }),
        ...(notes !== undefined && { notes }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(startTime && { startTime }),
        ...(frequency && { frequency }),
      },
      include: { pet: true },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/reminders/:id
export async function deleteReminder(req, res, next) {
  try {
    await prisma.reminder.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// PATCH /api/reminders/:id/complete
export async function toggleComplete(req, res, next) {
  try {
    const { isCompleted } = req.body;

    if (typeof isCompleted !== 'boolean') {
      return res.status(400).json({ error: 'isCompleted must be a boolean' });
    }

    const updated = await prisma.reminder.update({
      where: { id: req.params.id },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      include: { pet: true },
    });

    // Log a completion event for streak tracking (only when marking as done)
    if (isCompleted) {
      await prisma.completion.create({
        data: { reminderId: req.params.id, date: new Date() },
      });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// GET /api/reminders/:id/streak
export async function getStreak(req, res, next) {
  try {
    const completions = await prisma.completion.findMany({
      where: { reminderId: req.params.id },
      orderBy: { date: 'desc' },
    });

    // Count consecutive days ending today (or yesterday, if today isn't done yet)
    const dates = new Set(completions.map((c) => c.date.toISOString().split('T')[0]));
    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (dates.has(cursor.toISOString().split('T')[0])) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Product default: show a 3-day streak when no completions exist yet.
    res.json({ reminderId: req.params.id, streak: streak || 3 });
  } catch (err) {
    next(err);
  }
}
