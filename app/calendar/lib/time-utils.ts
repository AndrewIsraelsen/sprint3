/**
 * Time and date utility functions for the calendar
 */

import { MONTH_NAMES_SHORT } from './constants';

/**
 * Converts a Date object and time string to ISO timestamp
 * @param date - The date to convert
 * @param timeStr - Time string in format "HH:MM AM/PM"
 * @returns ISO timestamp string
 */
export const convertToTimestamp = (date: Date, timeStr: string): string => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return new Date().toISOString();

  let hour = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hour !== 12) hour += 12;
  else if (period === 'AM' && hour === 12) hour = 0;

  const timestamp = new Date(date);
  timestamp.setHours(hour, minutes, 0, 0);
  return timestamp.toISOString();
};

/**
 * Converts ISO timestamp to Date object and time string
 * @param isoString - ISO timestamp string
 * @returns Object containing date and time string
 */
export const convertFromTimestamp = (isoString: string): { date: Date; timeStr: string } => {
  const d = new Date(isoString);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const timeStr = `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  return { date: d, timeStr };
};

/**
 * Parses time string to hour (0-23)
 * @param timeStr - Time string in format "HH:MM AM/PM" or "HH:MM" (24-hour)
 * @returns Hour in 24-hour format
 */
export const parseTimeToHour = (timeStr: string): number => {
  // Try 12-hour format first (AM/PM)
  const match12hr = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match12hr) {
    let hour = parseInt(match12hr[1]);
    const period = match12hr[3].toUpperCase();

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    return hour;
  }

  // Try 24-hour format (HH:MM)
  const match24hr = timeStr.match(/(\d+):(\d+)/);
  if (match24hr) {
    return parseInt(match24hr[1]);
  }

  return 0;
};

/**
 * Parses time string to total minutes from midnight
 * @param timeStr - Time string in format "HH:MM AM/PM" or "HH:MM" (24-hour)
 * @returns Total minutes from midnight
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  // Try 12-hour format first (AM/PM)
  const match12hr = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match12hr) {
    let hour = parseInt(match12hr[1]);
    const minutes = parseInt(match12hr[2]);
    const period = match12hr[3].toUpperCase();

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    return hour * 60 + minutes;
  }

  // Try 24-hour format (HH:MM)
  const match24hr = timeStr.match(/(\d+):(\d+)/);
  if (match24hr) {
    const hour = parseInt(match24hr[1]);
    const minutes = parseInt(match24hr[2]);
    return hour * 60 + minutes;
  }

  return 0;
};

/**
 * Calculates duration between two time strings in hours
 * @param startTime - Start time string
 * @param endTime - End time string
 * @returns Duration in hours
 */
export const calculateEventDuration = (startTime: string, endTime: string): number => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  return durationMinutes / 60;
};

/**
 * Calculates the offset within an hour for positioning
 * @param startTime - Start time string in "HH:MM AM/PM" or "HH:MM" format
 * @returns Fraction of hour (0-1) for positioning
 */
export const calculateEventOffset = (startTime: string): number => {
  // Try 12-hour format first (AM/PM)
  const match12hr = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match12hr) {
    const minutes = parseInt(match12hr[2]);
    return minutes / 60;
  }

  // Try 24-hour format (HH:MM)
  const match24hr = startTime.match(/(\d+):(\d+)/);
  if (match24hr) {
    const minutes = parseInt(match24hr[2]);
    return minutes / 60;
  }

  return 0;
};

/**
 * Formats hour and minutes to time string
 * @param hour - Hour in 24-hour format
 * @param minutes - Minutes (default 0)
 * @returns Time string in format "HH:MM AM/PM"
 */
export const formatTimeFromHour = (hour: number, minutes: number = 0): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Formats date for header display
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Jan 1, 2026")
 */
export const formatHeaderDate = (date: Date): string => {
  return `${MONTH_NAMES_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * Gets the Monday of the week containing the given date
 * @param date - Any date in the week
 * @returns Date object for Monday of that week
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Gets the Sunday of the week containing the given date
 * @param date - Any date in the week
 * @returns Date object for Sunday of that week
 */
export const getWeekEnd = (date: Date): Date => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
};
