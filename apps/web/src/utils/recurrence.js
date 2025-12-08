/**
 * Utility functions for handling recurring events
 */

/**
 * Computes the date range for the calendar view
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Object} Object with start and end dates
 */
export function computeRange(start, end) {
  return {
    start: new Date(start),
    end: new Date(end)
  };
}

/**
 * Expands a recurring event into multiple instances
 * @param {Object} event - The event object
 * @param {Date} rangeStart - Start of the date range
 * @param {Date} rangeEnd - End of the date range
 * @returns {Array} Array of expanded event instances
 */
export function expandRecurrence(event, rangeStart, rangeEnd) {
  // If no recurrence rule, return the event as-is
  if (!event.recurrence_rule) {
    return [event];
  }

  try {
    // Parse the recurrence rule (simplified implementation)
    const rule = parseRecurrenceRule(event.recurrence_rule);
    if (!rule) {
      return [event];
    }

    const instances = [];
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const duration = eventEnd.getTime() - eventStart.getTime();

    // Generate instances based on the recurrence rule
    let currentDate = new Date(eventStart);
    let count = 0;
    const maxInstances = 100; // Prevent infinite loops

    while (currentDate <= rangeEnd && count < maxInstances) {
      if (currentDate >= rangeStart) {
        const instance = {
          ...event,
          id: `${event.id}_${count}`,
          start: new Date(currentDate),
          end: new Date(currentDate.getTime() + duration),
          isRecurring: true,
          originalEvent: event
        };
        instances.push(instance);
      }

      // Calculate next occurrence
      currentDate = getNextOccurrence(currentDate, rule);
      count++;
    }

    return instances;
  } catch (error) {
    console.warn('Error expanding recurrence:', error);
    return [event];
  }
}

/**
 * Parse a recurrence rule string
 * @param {string} rule - The recurrence rule string
 * @returns {Object|null} Parsed rule object or null if invalid
 */
function parseRecurrenceRule(rule) {
  if (!rule || typeof rule !== 'string') {
    return null;
  }

  // Simple parsing for common recurrence patterns
  // This is a simplified implementation - you might want to use a library like rrule.js for production
  const parts = rule.split(';');
  const parsed = {};

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key && value) {
      parsed[key] = value;
    }
  }

  return parsed;
}

/**
 * Calculate the next occurrence based on the recurrence rule
 * @param {Date} currentDate - Current date
 * @param {Object} rule - Parsed recurrence rule
 * @returns {Date} Next occurrence date
 */
function getNextOccurrence(currentDate, rule) {
  const next = new Date(currentDate);

  if (rule.FREQ === 'DAILY') {
    next.setDate(next.getDate() + (parseInt(rule.INTERVAL) || 1));
  } else if (rule.FREQ === 'WEEKLY') {
    next.setDate(next.getDate() + (7 * (parseInt(rule.INTERVAL) || 1)));
  } else if (rule.FREQ === 'MONTHLY') {
    next.setMonth(next.getMonth() + (parseInt(rule.INTERVAL) || 1));
  } else if (rule.FREQ === 'YEARLY') {
    next.setFullYear(next.getFullYear() + (parseInt(rule.INTERVAL) || 1));
  } else {
    // Default to daily if frequency is not recognized
    next.setDate(next.getDate() + 1);
  }

  return next;
}

