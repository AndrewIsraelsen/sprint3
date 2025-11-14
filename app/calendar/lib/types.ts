/**
 * Type definitions for the calendar application
 */

export type Event = {
  id: string;
  type: string;
  color: string;
  time: number; // hour of the day (0-23)
  duration: number; // in hours
  title: string;
  notes?: string;
  date: Date;
  startTime: string;
  endTime: string;
  repeat: string;
  backup: boolean;
  backupPattern?: 'none' | 'diagonal'; // Visual pattern for backup events
  recurrenceEndDate?: Date | null; // End date for recurring events
  address?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EventType = {
  name: string;
  color: string;
};

export type Indicator = {
  id: string;
  event_type: string;
  measurement_type: 'time' | 'frequency'; // Type of measurement
  goal_hours?: number | null; // For time-based indicators
  goal_frequency?: number | null; // For frequency-based indicators
  actual_hours: number; // Calculated from events (for time-based)
  actual_frequency?: number; // Calculated from events (for frequency-based)
  display_order: number;
  color: string;
};

export type WeekDay = {
  day: string;
  date: number;
  fullDate: Date;
  isSelected: boolean;
};
