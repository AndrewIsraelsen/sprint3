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
  goal_hours: number;
  actual_hours: number;
  display_order: number;
  color: string;
};

export type WeekDay = {
  day: string;
  date: number;
  fullDate: Date;
  isSelected: boolean;
};
