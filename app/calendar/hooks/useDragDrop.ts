/**
 * Custom hook for handling drag-and-drop event repositioning
 * Manages drag state and calculates new event positions
 */

import { useState } from 'react';
import { Event } from '../lib/types';
import { formatTimeFromHour } from '../lib/time-utils';
import { HOUR_HEIGHT_PX, DRAG_SCROLL_THRESHOLD, DAY_SWITCH_THRESHOLD } from '../lib/constants';

export const useDragDrop = (
  selectedDate: Date,
  setSelectedDate: (date: Date) => void,
  updateEventTime: (eventId: string, date: Date, startTime: string, endTime: string) => Promise<boolean>
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [previousEventState, setPreviousEventState] = useState<Event | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);

  /**
   * Handle start of potential drag operation (long-press detection)
   */
  const handleDragStart = (event: Event, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    setDragStartY(clientY);
    setDragStartX(clientX);
    setDragCurrentY(clientY);
    setDragCurrentX(clientX);
    setPreviousEventState({ ...event });
    setDraggedEvent(event);
    setIsLongPressing(true);

    // Set up long-press timer (500ms)
    const timer = setTimeout(() => {
      setIsDragging(true);
      setIsLongPressing(false);
      // Haptic feedback on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500);

    setLongPressTimer(timer);
  };

  /**
   * Handle drag move with auto-scroll and day switching
   */
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    // If long-pressing, check if user moved too much (cancel long-press)
    if (isLongPressing) {
      const moveThreshold = 10; // pixels
      const deltaY = Math.abs(clientY - dragStartY);
      const deltaX = Math.abs(clientX - dragStartX);
      if (deltaY > moveThreshold || deltaX > moveThreshold) {
        // User moved too much, cancel long-press
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          setLongPressTimer(null);
        }
        setIsLongPressing(false);
        setDraggedEvent(null);
        return;
      }
      return;
    }

    // Only process drag movement if actively dragging
    if (!isDragging || !draggedEvent) return;

    setDragCurrentY(clientY);
    setDragCurrentX(clientX);

    // Auto-scroll when near edges
    const windowHeight = window.innerHeight;
    if (clientY > windowHeight - DRAG_SCROLL_THRESHOLD) {
      window.scrollBy(0, 10);
    } else if (clientY < DRAG_SCROLL_THRESHOLD) {
      window.scrollBy(0, -10);
    }

    // Day switching when near horizontal edges
    const windowWidth = window.innerWidth;
    if (clientX < DAY_SWITCH_THRESHOLD) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    } else if (clientX > windowWidth - DAY_SWITCH_THRESHOLD) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  };

  /**
   * Handle end of drag and save new position
   */
  const handleDragEnd = async (e: React.MouseEvent | React.TouchEvent) => {
    // Clean up long-press timer if it's still active
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // If we were just long-pressing (not actually dragging), this was a click
    if (isLongPressing) {
      setIsLongPressing(false);
      setDraggedEvent(null);
      return;
    }

    // If not actually dragging, do nothing
    if (!isDragging || !draggedEvent) return;

    const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY;

    // Calculate new time based on drag distance (snap to 15-minute intervals)
    const minutesMoved = Math.round(deltaY / HOUR_HEIGHT_PX * 60);
    const startMinutes = draggedEvent.time * 60 + (parseFloat(draggedEvent.startTime.match(/\d+/)?.[0] || '0') % 60);
    const totalMinutes = startMinutes + minutesMoved;

    // Snap to 15-minute intervals and clamp to valid range
    const snappedMinutes = Math.round(totalMinutes / 15) * 15;
    const clampedMinutes = Math.max(0, Math.min(23 * 60 + 45, snappedMinutes));

    const newHour = Math.floor(clampedMinutes / 60);
    const newMinutes = clampedMinutes % 60;
    const newStartTime = formatTimeFromHour(newHour, newMinutes);

    // Calculate end time based on duration
    const durationMinutes = draggedEvent.duration * 60;
    const endTotalMinutes = clampedMinutes + durationMinutes;
    const endHour = Math.floor(endTotalMinutes / 60);
    const endMinutes = endTotalMinutes % 60;
    const newEndTime = formatTimeFromHour(endHour, endMinutes);

    // Update event position
    await updateEventTime(draggedEvent.id, selectedDate, newStartTime, newEndTime);

    setIsDragging(false);
    setDraggedEvent(null);
    setIsLongPressing(false);

    return {
      newStartTime,
      previousState: previousEventState,
    };
  };

  /**
   * Reset drag state
   */
  const resetDrag = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsDragging(false);
    setDraggedEvent(null);
    setPreviousEventState(null);
    setIsLongPressing(false);
  };

  return {
    isDragging,
    isLongPressing,
    draggedEvent,
    dragStartY,
    dragCurrentY,
    dragCurrentX,
    previousEventState,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    resetDrag,
    setPreviousEventState,
  };
};
