function toDateOnly(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function expandReminderOccurrences(reminders = [], options = {}) {
  const { date, rangeEnd = new Date() } = options;
  const selectedDate = date ? toDateOnly(date) : null;
  const endDate = rangeEnd ? toDateOnly(rangeEnd) : null;

  return reminders
    .flatMap((reminder) => {
      const startDate = toDateOnly(reminder.startDate);
      const frequency = reminder.frequency?.toLowerCase();

      if (frequency !== 'everyday') {
        const occurrenceDate = selectedDate || startDate;
        if (selectedDate && occurrenceDate.getTime() !== startDate.getTime()) {
          return [];
        }

        return [{
          ...reminder,
          startDate: new Date(occurrenceDate),
        }];
      }

      const start = selectedDate || startDate;
      const end = selectedDate || endDate || startDate;

      if (start < startDate) {
        return [];
      }

      const occurrences = [];
      for (let current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
        occurrences.push({
          ...reminder,
          startDate: new Date(current),
        });
      }

      return occurrences;
    })
    .sort((left, right) => {
      const leftDate = new Date(left.startDate).getTime();
      const rightDate = new Date(right.startDate).getTime();

      if (leftDate !== rightDate) {
        return leftDate - rightDate;
      }

      return (left.startTime || '').localeCompare(right.startTime || '');
    });
}
