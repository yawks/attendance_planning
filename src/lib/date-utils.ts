import { format, getISOWeek, startOfISOWeek, addDays, subWeeks, addWeeks } from 'date-fns';

/**
 * Gets the ISO week number string (e.g., "2025-W36").
 */
export function getWeekId(date: Date = new Date()): string {
  const week = getISOWeek(date);
  const year = date.getFullYear();
  // The logic for ISO week needs to handle cases where the week belongs to the previous or next year.
  if (week === 1 && date.getMonth() === 11) {
    return `${year + 1}-W01`;
  }
  if (week > 50 && date.getMonth() === 0) {
    return `${year - 1}-W${week}`;
  }
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/**
 * Gets an array of Date objects for each day in a given ISO week.
 */
export function getDaysInWeek(weekId: string): Date[] {
  const [year, week] = weekId.split('-W').map(Number);
  // date-fns's startOfISOWeek works well, but we need to construct a date that reliably falls within the target year and week.
  // A simple way is to estimate and then find the start of that week.
  const estimatedDate = new Date(year, 0, 1 + (week - 1) * 7);
  const weekStart = startOfISOWeek(estimatedDate);

  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(weekStart, i));
  }
  return days;
}

/**
 * Formats a Date object into "YYYY-MM-DD".
 */
export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parses a week ID string and returns a Date object representing the start of that week.
 */
export function weekIdToDate(weekId: string): Date {
    const [year, week] = weekId.split('-W').map(Number);
    const estimatedDate = new Date(year, 0, 1 + (week - 1) * 7);
    return startOfISOWeek(estimatedDate);
}

/**
 * Gets the next week's ID.
 */
export function getNextWeekId(weekId: string): string {
    return getWeekId(addWeeks(weekIdToDate(weekId), 1));
}

/**
 * Gets the previous week's ID.
 */
export function getPreviousWeekId(weekId: string): string {
    return getWeekId(subWeeks(weekIdToDate(weekId), 1));
}
