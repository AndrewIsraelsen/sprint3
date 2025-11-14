/**
 * Demo mode sample data
 * Provides pre-loaded events and indicators for demo users
 */

import { Event, Indicator } from './types';

/**
 * Generate sample events for demo mode
 * Shows a typical day with various activities
 */
export const generateDemoEvents = (): Event[] => {
  const today = new Date();

  return [
    {
      id: 'demo-1',
      type: 'Church',
      color: 'bg-red-500',
      time: 9,
      duration: 2,
      title: 'Sunday Service',
      notes: 'Weekly worship service',
      date: today,
      startTime: '9:00 AM',
      endTime: '11:00 AM',
      repeat: 'Weekly',
      backup: false,
      address: '123 Church Street',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'demo-2',
      type: 'Family',
      color: 'bg-orange-500',
      time: 12,
      duration: 1,
      title: 'Family Lunch',
      notes: 'Sunday family gathering',
      date: today,
      startTime: '12:00 PM',
      endTime: '1:00 PM',
      repeat: 'Weekly',
      backup: false,
      address: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'demo-3',
      type: 'School',
      color: 'bg-green-500',
      time: 14,
      duration: 2,
      title: 'Study Session',
      notes: 'Prepare for upcoming exam',
      date: today,
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      repeat: 'Does not repeat',
      backup: false,
      address: 'Library',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'demo-4',
      type: 'Work',
      color: 'bg-blue-500',
      time: 8,
      duration: 1,
      title: 'Morning Planning',
      notes: 'Review weekly goals',
      date: today,
      startTime: '8:00 AM',
      endTime: '9:00 AM',
      repeat: 'Daily',
      backup: false,
      address: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'demo-5',
      type: 'Meal',
      color: 'bg-yellow-800',
      time: 7,
      duration: 0.5,
      title: 'Breakfast',
      notes: 'Healthy start to the day',
      date: today,
      startTime: '7:00 AM',
      endTime: '7:30 AM',
      repeat: 'Daily',
      backup: false,
      address: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'demo-6',
      type: 'Meal',
      color: 'bg-yellow-800',
      time: 18,
      duration: 1,
      title: 'Dinner',
      notes: 'Family dinner time',
      date: today,
      startTime: '6:00 PM',
      endTime: '7:00 PM',
      repeat: 'Daily',
      backup: false,
      address: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'demo-7',
      type: 'Other',
      color: 'bg-gray-500',
      time: 20,
      duration: 1,
      title: 'Evening Reflection',
      notes: 'Journal and meditation',
      date: today,
      startTime: '8:00 PM',
      endTime: '9:00 PM',
      repeat: 'Daily',
      backup: false,
      address: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

/**
 * Generate sample indicators for demo mode
 */
export const generateDemoIndicators = (): Indicator[] => {
  return [
    {
      id: 'demo-ind-1',
      event_type: 'Church',
      goal_hours: 3,
      actual_hours: 2,
      display_order: 0,
      color: 'bg-red-500',
    },
    {
      id: 'demo-ind-2',
      event_type: 'Family',
      goal_hours: 10,
      actual_hours: 8,
      display_order: 1,
      color: 'bg-orange-500',
    },
    {
      id: 'demo-ind-3',
      event_type: 'School',
      goal_hours: 15,
      actual_hours: 12,
      display_order: 2,
      color: 'bg-green-500',
    },
    {
      id: 'demo-ind-4',
      event_type: 'Work',
      goal_hours: 20,
      actual_hours: 18,
      display_order: 3,
      color: 'bg-blue-500',
    },
  ];
};

/**
 * Check if running in demo mode
 */
export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('demoMode') === 'true';
};

/**
 * Enable demo mode
 */
export const enableDemoMode = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('demoMode', 'true');
};

/**
 * Disable demo mode
 */
export const disableDemoMode = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('demoMode');
};
