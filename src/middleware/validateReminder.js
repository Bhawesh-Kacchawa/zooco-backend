const VALID_CATEGORIES = ['General', 'Lifestyle', 'Health'];

// Validates the reminder payload on create (all fields required)
// and on update (only validates fields that are present).
export function validateReminder(isPartial = false) {
  return (req, res, next) => {
    const body = req.body;
    const errors = {};

    const required = (field, label) => {
      if (!isPartial && (body[field] === undefined || body[field] === null || body[field] === '')) {
        errors[field] = `${label} is required`;
      }
    };

    required('petId', 'Pet');
    required('title', 'Reminder title');
    required('startDate', 'Start date');
    required('startTime', 'Start time');
    required('frequency', 'Frequency');

    if (body.title !== undefined && body.title.length > 100) {
      errors.title = 'Title must be under 100 characters';
    }

    if (body.category !== undefined && !VALID_CATEGORIES.includes(body.category)) {
      errors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
    }

    if (body.startDate !== undefined && isNaN(Date.parse(body.startDate))) {
      errors.startDate = 'Start date must be a valid date';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Validation failed', fields: errors });
    }

    next();
  };
}
