/**
 * Constants used throughout the calendar application
 */

import { EventType } from './types';

/** Available event types with their corresponding colors */
export const EVENT_TYPES: EventType[] = [
  { name: 'Church', color: 'bg-red-500' },
  { name: 'Family', color: 'bg-orange-500' },
  { name: 'School', color: 'bg-green-500' },
  { name: 'Work', color: 'bg-blue-500' },
  { name: 'Travel', color: 'bg-purple-500' },
  { name: 'Meal', color: 'bg-yellow-800' },
  { name: 'Other', color: 'bg-gray-500' },
];

/** Repeat pattern options for events */
export const REPEAT_OPTIONS = [
  'Does not repeat',
  'Daily',
  'Weekly',
  'Monthly',
  'Yearly'
];

/** Month names for date formatting */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/** Abbreviated month names */
export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/** Day names */
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Stripe price IDs for subscription tiers */
export const STRIPE_PRICE_IDS = {
  basic: 'price_1SM0BhJwLJFduW01Rz2WkbfD',
  premium: 'price_1SM0BhJwLJFduW01Sau5RPKC',
};

/** Height of each hour slot in pixels */
export const HOUR_HEIGHT_PX = 64;

/** Drag scroll threshold in pixels from edge */
export const DRAG_SCROLL_THRESHOLD = 100;

/** Day switch threshold in pixels from edge */
export const DAY_SWITCH_THRESHOLD = 96;
