import { Router } from 'express';
import * as ctrl from '../controllers/remindersController.js';
import { validateReminder } from '../middleware/validateReminder.js';

const router = Router();

router.get('/', ctrl.getReminders);
router.get('/:id', ctrl.getReminderById);
router.get('/:id/streak', ctrl.getStreak);
router.post('/', validateReminder(false), ctrl.createReminder);
router.put('/:id', validateReminder(true), ctrl.updateReminder);
router.patch('/:id/complete', ctrl.toggleComplete);
router.delete('/:id', ctrl.deleteReminder);

export default router;
