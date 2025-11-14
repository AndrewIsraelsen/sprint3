/**
 * Date utility functions for calendar calculations
 */

import { WeekDay } from './types';
import { DAY_NAMES } from './constants';

/**
 * Generates array of days for the week containing the selected date
 * Week starts on Wednesday as per app requirements
 * @param selectedDate - The currently selected date
 * @returns Array of WeekDay objects
 */
export const getWeekDays = (selectedDate: Date): WeekDay[] => {
  const days: WeekDay[] = [];
  const currentDate = new Date(selectedDate);
  const dayOfWeek = currentDate.getDay();

  // Go back to the previous Wednesday
  const startDate = new Date(currentDate);
  const daysToSubtract = (dayOfWeek + 4) % 7;
  startDate.setDate(currentDate.getDate() - daysToSubtract);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push({
      day: DAY_NAMES[date.getDay()],
      date: date.getDate(),
      fullDate: new Date(date),
      isSelected: date.toDateString() === selectedDate.toDateString()
    });
  }

  return days;
};

/**
 * Generates calendar days for month view in date picker
 * Includes empty cells for days before month starts
 * @param month - Month index (0-11)
 * @param year - Full year
 * @returns Array of day numbers (null for empty cells)
 */
export const getCalendarDays = (month: number, year: number): (number | null)[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: (number | null)[] = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days in the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
};

/**
 * Generates array of hour labels for the day
 * @returns Array of hour strings (e.g., "12 AM", "1 PM")
 */
export const getHourLabels = (): string[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour} ${period}`;
  });
};
