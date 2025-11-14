/**
 * Custom hook for managing key indicators
 * Handles loading, creating, and deleting indicators
 */

import { useState, useEffect } from 'react';
import { Indicator, Event } from '../lib/types';
import { EVENT_TYPES } from '../lib/constants';
import { getWeekStart, getWeekEnd } from '../lib/time-utils';
import { generateDemoIndicators, isDemoMode } from '../lib/demo-data';

export const useIndicators = (events: Event[]) => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  /**
   * Calculate weekly hours for a specific event type
   */
  const calculateWeeklyHours = (eventType: string, weekStart: Date, weekEnd: Date): number => {
    const weekEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return event.type === eventType &&
             eventDate >= weekStart &&
             eventDate <= weekEnd;
    });

    return weekEvents.reduce((total, event) => total + event.duration, 0);
  };

  /**
   * Load indicators from API and calculate actual hours, or use demo data
   */
  useEffect(() => {
    const loadIndicators = async () => {
      try {
        // Check if in demo mode
        if (isDemoMode()) {
          setIndicators(generateDemoIndicators());
          return;
        }

        const response = await fetch('/api/key-indicators');
        if (!response.ok) return;

        const { indicators: apiIndicators } = await response.json();

        // Calculate actual hours for each indicator
        const weekStart = getWeekStart(new Date());
        const weekEnd = getWeekEnd(new Date());

        const indicatorsWithHours: Indicator[] = apiIndicators.map((ind: any) => {
          const eventType = EVENT_TYPES.find(et => et.name === ind.event_type);
          return {
            id: ind.id,
            event_type: ind.event_type,
            goal_hours: ind.goal_hours,
            actual_hours: calculateWeeklyHours(ind.event_type, weekStart, weekEnd),
            display_order: ind.display_order,
            color: eventType?.color || 'bg-gray-500'
          };
        });

        setIndicators(indicatorsWithHours);
      } catch (error) {
        console.error('Failed to load indicators:', error);
      }
    };

    // Only load when we have events to calculate from
    if (events.length > 0) {
      loadIndicators();
    }
  }, [events]); // Re-calculate when events change

  /**
   * Create a new indicator
   */
  const createIndicator = async (eventType: string, goalHours: number = 1): Promise<boolean> => {
    try {
      const response = await fetch('/api/key-indicators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          goal_hours: goalHours,
          display_order: indicators.length
        })
      });

      if (response.ok) {
        const { indicator } = await response.json();
        const weekStart = getWeekStart(new Date());
        const weekEnd = getWeekEnd(new Date());
        const eventTypeObj = EVENT_TYPES.find(et => et.name === eventType);

        setIndicators([...indicators, {
          id: indicator.id,
          event_type: indicator.event_type,
          goal_hours: indicator.goal_hours,
          actual_hours: calculateWeeklyHours(indicator.event_type, weekStart, weekEnd),
          display_order: indicator.display_order,
          color: eventTypeObj?.color || 'bg-gray-500'
        }]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create indicator:', error);
      return false;
    }
  };

  /**
   * Delete an indicator
   */
  const deleteIndicator = async (indicatorId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/key-indicators/${indicatorId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setIndicators(indicators.filter(i => i.id !== indicatorId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete indicator:', error);
      return false;
    }
  };

  return {
    indicators,
    createIndicator,
    deleteIndicator,
  };
};
