/**
 * Computes layout for overlapping events in a time slot
 * @param {Array} events - Array of events for a specific time slot
 * @returns {Array} Array of objects with event and layout information
 */
export function computeConflictLayout(events) {
  if (!events || events.length === 0) return [];

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => new Date(a.start) - new Date(b.start));
  
  // Group overlapping events
  const groups = [];
  let currentGroup = [];
  
  for (const event of sortedEvents) {
    if (currentGroup.length === 0) {
      currentGroup = [event];
    } else {
      const lastEvent = currentGroup[currentGroup.length - 1];
      const lastEnd = new Date(lastEvent.end);
      const currentStart = new Date(event.start);
      
      // Check if events overlap
      if (currentStart < lastEnd) {
        currentGroup.push(event);
      } else {
        // No overlap, start new group
        groups.push(currentGroup);
        currentGroup = [event];
      }
    }
  }
  
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  
  // Compute layout for each group
  const result = [];
  for (const group of groups) {
    for (let i = 0; i < group.length; i++) {
      const event = group[i];
      const layout = {
        left: (i / group.length) * 100,
        width: (1 / group.length) * 100,
        zIndex: group.length - i
      };
      result.push({ e: event, layout });
    }
  }
  
  return result;
}

