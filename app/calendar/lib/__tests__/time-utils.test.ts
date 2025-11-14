/**
 * Unit tests for time utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  convertToTimestamp,
  convertFromTimestamp,
  parseTimeToHour,
  parseTimeToMinutes,
  calculateEventDuration,
  calculateEventOffset,
  formatTimeFromHour,
  formatHeaderDate,
  getWeekStart,
  getWeekEnd,
} from '../time-utils';

describe('time-utils', () => {
  describe('parseTimeToHour', () => {
    it('should parse AM times correctly', () => {
      expect(parseTimeToHour('12:00 AM')).toBe(0);
      expect(parseTimeToHour('1:00 AM')).toBe(1);
      expect(parseTimeToHour('11:59 AM')).toBe(11);
    });

    it('should parse PM times correctly', () => {
      expect(parseTimeToHour('12:00 PM')).toBe(12);
      expect(parseTimeToHour('1:00 PM')).toBe(13);
      expect(parseTimeToHour('11:59 PM')).toBe(23);
    });

    it('should handle invalid input', () => {
      expect(parseTimeToHour('invalid')).toBe(0);
    });
  });

  describe('parseTimeToMinutes', () => {
    it('should convert time to minutes from midnight', () => {
      expect(parseTimeToMinutes('12:00 AM')).toBe(0);
      expect(parseTimeToMinutes('1:00 AM')).toBe(60);
      expect(parseTimeToMinutes('12:00 PM')).toBe(720);
      expect(parseTimeToMinutes('1:30 PM')).toBe(810);
      expect(parseTimeToMinutes('11:59 PM')).toBe(1439);
    });

    it('should handle minutes correctly', () => {
      expect(parseTimeToMinutes('1:15 AM')).toBe(75);
      expect(parseTimeToMinutes('2:45 PM')).toBe(885);
    });
  });

  describe('calculateEventDuration', () => {
    it('should calculate duration in hours', () => {
      expect(calculateEventDuration('9:00 AM', '10:00 AM')).toBe(1);
      expect(calculateEventDuration('9:00 AM', '11:00 AM')).toBe(2);
      expect(calculateEventDuration('9:30 AM', '10:30 AM')).toBe(1);
    });

    it('should handle cross-meridiem times', () => {
      expect(calculateEventDuration('11:00 AM', '1:00 PM')).toBe(2);
      expect(calculateEventDuration('10:00 AM', '2:00 PM')).toBe(4);
    });

    it('should handle fractional hours', () => {
      expect(calculateEventDuration('9:00 AM', '9:30 AM')).toBe(0.5);
      expect(calculateEventDuration('1:00 PM', '1:45 PM')).toBe(0.75);
    });
  });

  describe('calculateEventOffset', () => {
    it('should calculate minute offset as fraction of hour', () => {
      expect(calculateEventOffset('9:00 AM')).toBe(0);
      expect(calculateEventOffset('9:15 AM')).toBe(0.25);
      expect(calculateEventOffset('9:30 AM')).toBe(0.5);
      expect(calculateEventOffset('9:45 AM')).toBe(0.75);
    });

    it('should handle invalid input', () => {
      expect(calculateEventOffset('invalid')).toBe(0);
    });
  });

  describe('formatTimeFromHour', () => {
    it('should format hours correctly', () => {
      expect(formatTimeFromHour(0)).toBe('12:00 AM');
      expect(formatTimeFromHour(1)).toBe('1:00 AM');
      expect(formatTimeFromHour(12)).toBe('12:00 PM');
      expect(formatTimeFromHour(13)).toBe('1:00 PM');
      expect(formatTimeFromHour(23)).toBe('11:00 PM');
    });

    it('should format with minutes', () => {
      expect(formatTimeFromHour(9, 30)).toBe('9:30 AM');
      expect(formatTimeFromHour(14, 45)).toBe('2:45 PM');
    });

    it('should pad single-digit minutes', () => {
      expect(formatTimeFromHour(9, 5)).toBe('9:05 AM');
    });
  });

  describe('convertToTimestamp and convertFromTimestamp', () => {
    it('should be reversible', () => {
      const date = new Date(2026, 3, 2); // April 2, 2026
      const timeStr = '2:30 PM';

      const timestamp = convertToTimestamp(date, timeStr);
      const { date: resultDate, timeStr: resultTime } = convertFromTimestamp(timestamp);

      expect(resultDate.getFullYear()).toBe(2026);
      expect(resultDate.getMonth()).toBe(3);
      expect(resultDate.getDate()).toBe(2);
      expect(resultTime).toBe(timeStr);
    });

    it('should handle midnight correctly', () => {
      const date = new Date(2026, 3, 2);
      const timeStr = '12:00 AM';

      const timestamp = convertToTimestamp(date, timeStr);
      const { timeStr: resultTime } = convertFromTimestamp(timestamp);

      expect(resultTime).toBe(timeStr);
    });

    it('should handle noon correctly', () => {
      const date = new Date(2026, 3, 2);
      const timeStr = '12:00 PM';

      const timestamp = convertToTimestamp(date, timeStr);
      const { timeStr: resultTime } = convertFromTimestamp(timestamp);

      expect(resultTime).toBe(timeStr);
    });
  });

  describe('formatHeaderDate', () => {
    it('should format date correctly', () => {
      const date = new Date(2026, 0, 15); // Jan 15, 2026
      expect(formatHeaderDate(date)).toBe('Jan 15, 2026');
    });

    it('should handle all months', () => {
      const dates = [
        new Date(2026, 0, 1),   // Jan
        new Date(2026, 5, 15),  // Jun
        new Date(2026, 11, 31), // Dec
      ];

      expect(formatHeaderDate(dates[0])).toBe('Jan 1, 2026');
      expect(formatHeaderDate(dates[1])).toBe('Jun 15, 2026');
      expect(formatHeaderDate(dates[2])).toBe('Dec 31, 2026');
    });
  });

  describe('getWeekStart and getWeekEnd', () => {
    it('should get Monday of the week', () => {
      // Thursday, April 2, 2026 (day 4)
      const thursday = new Date(2026, 3, 2);
      const monday = getWeekStart(thursday);

      expect(monday.getDay()).toBe(1); // Monday
      // Monday should be March 30, 2026 (3 days before April 2)
      expect(monday.getMonth()).toBe(2); // March
      expect(monday.getDate()).toBe(30);
    });

    it('should get Sunday of the week', () => {
      // Wednesday, April 2, 2026
      const wednesday = new Date(2026, 3, 2);
      const sunday = getWeekEnd(wednesday);

      expect(sunday.getDay()).toBe(0); // Sunday
      expect(sunday.getDate()).toBeGreaterThanOrEqual(2);
    });

    it('should span exactly 7 days', () => {
      const date = new Date(2026, 3, 2);
      const start = getWeekStart(date);
      const end = getWeekEnd(date);

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      expect(diffDays).toBe(6); // Monday to Sunday is 6 days difference
    });

    it('should handle edge cases', () => {
      // Sunday should return itself as week end
      const sunday = new Date(2026, 3, 5); // April 5, 2026 (Sunday)
      expect(sunday.getDay()).toBe(0);

      const weekEnd = getWeekEnd(sunday);
      expect(weekEnd.getDay()).toBe(0);

      // Monday should return itself as week start
      const monday = new Date(2026, 3, 6); // April 6, 2026 (Monday)
      expect(monday.getDay()).toBe(1);

      const weekStart = getWeekStart(monday);
      expect(weekStart.getDay()).toBe(1);
    });
  });
});
