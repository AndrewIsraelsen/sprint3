/**
 * Custom hook for managing calendar events
 * Handles loading, creating, updating, and deleting events
 */

import { useState, useEffect } from 'react';
import { Event } from '../lib/types';
import {
  convertFromTimestamp,
  convertToTimestamp,
  parseTimeToHour,
  calculateEventDuration
} from '../lib/time-utils';
import { generateDemoEvents, isDemoMode } from '../lib/demo-data';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load events from API on mount, or use demo data if in demo mode
   */
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Check if in demo mode
        if (isDemoMode()) {
          setEvents(generateDemoEvents());
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/calendar/events');
        if (!response.ok) return;

        const { events: apiEvents } = await response.json();

        // Convert API events to frontend Event format
        const convertedEvents: Event[] = apiEvents.map((e: any) => {
          const { date: startDate, timeStr: startTime } = convertFromTimestamp(e.start_time);
          const { timeStr: endTime } = convertFromTimestamp(e.end_time);

          return {
            id: e.id,
            type: e.event_type || 'Other',
            color: e.color || 'bg-gray-400',
            time: parseTimeToHour(startTime),
            duration: calculateEventDuration(startTime, endTime),
            title: e.title,
            notes: e.notes || '',
            date: startDate,
            startTime,
            endTime,
            repeat: e.repeat_pattern || 'Does not repeat',
            backup: e.has_backup || false,
            address: e.address || '',
            createdAt: new Date(e.created_at),
            updatedAt: new Date(e.updated_at),
          };
        });

        setEvents(convertedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  /**
   * Create a new event
   */
  const createEvent = async (eventData: {
    type: string;
    color: string;
    title: string;
    notes: string;
    date: Date;
    startTime: string;
    endTime: string;
    repeat: string;
    backup: boolean;
    address: string;
  }): Promise<boolean> => {
    const startTimestamp = convertToTimestamp(eventData.date, eventData.startTime);
    const endTimestamp = convertToTimestamp(eventData.date, eventData.endTime);

    try {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventData.title || eventData.type,
          notes: eventData.notes,
          start_time: startTimestamp,
          end_time: endTimestamp,
          address: eventData.address,
          event_type: eventData.type,
          color: eventData.color,
          repeat_pattern: eventData.repeat,
          has_backup: eventData.backup,
        }),
      });

      if (response.ok) {
        const { event: createdEvent } = await response.json();
        const newEvent: Event = {
          id: createdEvent.id,
          type: eventData.type,
          color: eventData.color,
          time: parseTimeToHour(eventData.startTime),
          duration: calculateEventDuration(eventData.startTime, eventData.endTime),
          title: eventData.title || eventData.type,
          notes: eventData.notes,
          date: eventData.date,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          repeat: eventData.repeat,
          backup: eventData.backup,
          address: eventData.address,
          createdAt: new Date(createdEvent.created_at),
          updatedAt: new Date(createdEvent.updated_at)
        };
        setEvents([...events, newEvent]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create event:', error);
      return false;
    }
  };

  /**
   * Update an existing event
   */
  const updateEvent = async (eventId: string, eventData: {
    type: string;
    color: string;
    title: string;
    notes: string;
    date: Date;
    startTime: string;
    endTime: string;
    repeat: string;
    backup: boolean;
    address: string;
  }): Promise<boolean> => {
    const startTimestamp = convertToTimestamp(eventData.date, eventData.startTime);
    const endTimestamp = convertToTimestamp(eventData.date, eventData.endTime);

    try {
      const response = await fetch(`/api/calendar/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventData.title || eventData.type,
          notes: eventData.notes,
          start_time: startTimestamp,
          end_time: endTimestamp,
          address: eventData.address,
          event_type: eventData.type,
          color: eventData.color,
          repeat_pattern: eventData.repeat,
          has_backup: eventData.backup,
        }),
      });

      if (response.ok) {
        const { event: updatedEvent } = await response.json();
        const updatedEvents = events.map(evt =>
          evt.id === eventId
            ? {
                ...evt,
                type: eventData.type,
                color: eventData.color,
                title: eventData.title || eventData.type,
                notes: eventData.notes,
                date: eventData.date,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                time: parseTimeToHour(eventData.startTime),
                duration: calculateEventDuration(eventData.startTime, eventData.endTime),
                repeat: eventData.repeat,
                backup: eventData.backup,
                address: eventData.address,
                updatedAt: new Date(updatedEvent.updated_at)
              }
            : evt
        );
        setEvents(updatedEvents);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update event:', error);
      return false;
    }
  };

  /**
   * Delete an event
   */
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/calendar/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(evt => evt.id !== eventId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete event:', error);
      return false;
    }
  };

  /**
   * Update event time via drag and drop
   */
  const updateEventTime = async (
    eventId: string,
    date: Date,
    newStartTime: string,
    newEndTime: string
  ): Promise<boolean> => {
    const startTimestamp = convertToTimestamp(date, newStartTime);
    const endTimestamp = convertToTimestamp(date, newEndTime);

    try {
      await fetch(`/api/calendar/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_time: startTimestamp,
          end_time: endTimestamp,
        }),
      });

      const updatedEvents = events.map(evt =>
        evt.id === eventId
          ? {
              ...evt,
              time: parseTimeToHour(newStartTime),
              startTime: newStartTime,
              endTime: newEndTime,
              date: date,
              updatedAt: new Date()
            }
          : evt
      );
      setEvents(updatedEvents);
      return true;
    } catch (error) {
      console.error('Failed to update event time:', error);
      return false;
    }
  };

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventTime,
    setEvents, // Exposed for undo functionality
  };
};
