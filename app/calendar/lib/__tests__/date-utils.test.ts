/**
 * Unit tests for date utility functions
 */

import { describe, it, expect } from 'vitest';
import { getWeekDays, getCalendarDays, getHourLabels } from '../date-utils';

describe('date-utils', () => {
  describe('getWeekDays', () => {
    it('should return 7 days', () => {
      const date = new Date(2026, 3, 2); // April 2, 2026 (Thursday)
      const weekDays = getWeekDays(date);

      expect(weekDays).toHaveLength(7);
    });

    it('should mark the selected date as selected', () => {
      const date = new Date(2026, 3, 2);
      const weekDays = getWeekDays(date);

      const selectedDay = weekDays.find(d => d.isSelected);
      expect(selectedDay).toBeDefined();
      expect(selectedDay?.fullDate.toDateString()).toBe(date.toDateString());
    });

    it('should include day names', () => {
      const date = new Date(2026, 3, 2);
      const weekDays = getWeekDays(date);

      weekDays.forEach(day => {
        expect(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).toContain(day.day);
      });
    });

    it('should have sequential dates', () => {
      const date = new Date(2026, 3, 2);
      const weekDays = getWeekDays(date);

      for (let i = 1; i < weekDays.length; i++) {
        const prevDate = weekDays[i - 1].fullDate.getTime();
        const currDate = weekDays[i].fullDate.getTime();
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        expect(diffDays).toBe(1);
      }
    });
  });

  describe('getCalendarDays', () => {
    it('should return correct number of days for a month', () => {
      // April 2026 has 30 days
      const days = getCalendarDays(3, 2026); // Month 3 = April

      const nonNullDays = days.filter(d => d !== null);
      expect(nonNullDays).toHaveLength(30);
    });

    it('should include null padding at start', () => {
      // April 2026 starts on Wednesday (day 3)
      const days = getCalendarDays(3, 2026);

      // First 3 cells should be null
      expect(days[0]).toBeNull();
      expect(days[1]).toBeNull();
      expect(days[2]).toBeNull();
      expect(days[3]).toBe(1); // First day of month
    });

    it('should handle January correctly', () => {
      const days = getCalendarDays(0, 2026); // January

      const nonNullDays = days.filter(d => d !== null);
      expect(nonNullDays).toHaveLength(31); // January has 31 days
    });

    it('should handle February in leap year', () => {
      const days = getCalendarDays(1, 2024); // February 2024 (leap year)

      const nonNullDays = days.filter(d => d !== null);
      expect(nonNullDays).toHaveLength(29);
    });

    it('should handle February in non-leap year', () => {
      const days = getCalendarDays(1, 2026); // February 2026 (not leap year)

      const nonNullDays = days.filter(d => d !== null);
      expect(nonNullDays).toHaveLength(28);
    });

    it('should have sequential day numbers', () => {
      const days = getCalendarDays(3, 2026);
      const nonNullDays = days.filter(d => d !== null) as number[];

      for (let i = 0; i < nonNullDays.length; i++) {
        expect(nonNullDays[i]).toBe(i + 1);
      }
    });
  });

  describe('getHourLabels', () => {
    it('should return 24 hours', () => {
      const hours = getHourLabels();
      expect(hours).toHaveLength(24);
    });

    it('should start with midnight', () => {
      const hours = getHourLabels();
      expect(hours[0]).toBe('12 AM');
    });

    it('should include noon', () => {
      const hours = getHourLabels();
      expect(hours[12]).toBe('12 PM');
    });

    it('should end with 11 PM', () => {
      const hours = getHourLabels();
      expect(hours[23]).toBe('11 PM');
    });

    it('should have correct AM hours', () => {
      const hours = getHourLabels();
      expect(hours[1]).toBe('1 AM');
      expect(hours[11]).toBe('11 AM');
    });

    it('should have correct PM hours', () => {
      const hours = getHourLabels();
      expect(hours[13]).toBe('1 PM');
      expect(hours[23]).toBe('11 PM');
    });

    it('should not repeat any hours', () => {
      const hours = getHourLabels();
      const uniqueHours = new Set(hours);
      expect(uniqueHours.size).toBe(24);
    });
  });
});
