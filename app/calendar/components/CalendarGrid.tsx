/**
 * Calendar grid component showing 24-hour day view with events
 */

import { Event } from '../lib/types';
import { getHourLabels } from '../lib/date-utils';
import { calculateEventOffset } from '../lib/time-utils';
import { HOUR_HEIGHT_PX } from '../lib/constants';

interface CalendarGridProps {
  selectedDate: Date;
  events: Event[];
  isDragging: boolean;
  draggedEvent: Event | null;
  dragStartY: number;
  dragCurrentY: number;
  onEventClick: (event: Event) => void;
  onSlotClick: (hourIndex: number) => void;
  onEventDragStart: (event: Event, e: React.MouseEvent | React.TouchEvent) => void;
  onEventDragMove: (e: React.MouseEvent | React.TouchEvent) => void;
  onEventDragEnd: (e: React.MouseEvent | React.TouchEvent) => void;
}

/**
 * Helper to detect if two events overlap in time
 */
const eventsOverlap = (event1: Event, event2: Event): boolean => {
  const start1 = event1.time + calculateEventOffset(event1.startTime);
  const end1 = start1 + event1.duration;
  const start2 = event2.time + calculateEventOffset(event2.startTime);
  const end2 = start2 + event2.duration;

  return start1 < end2 && start2 < end1;
};

/**
 * Calculate column layout for overlapping events
 */
const calculateEventLayout = (events: Event[]) => {
  const layout = new Map<string, { column: number; totalColumns: number }>();
  const sorted = [...events].sort((a, b) => {
    const aStart = a.time + calculateEventOffset(a.startTime);
    const bStart = b.time + calculateEventOffset(b.startTime);
    return aStart - bStart;
  });

  for (const event of sorted) {
    // Find all events that overlap with this one
    const overlapping = sorted.filter(e =>
      e.id !== event.id && eventsOverlap(event, e)
    );

    // Determine which column this event should be in
    const usedColumns = new Set(
      overlapping
        .filter(e => layout.has(e.id))
        .map(e => layout.get(e.id)!.column)
    );

    let column = 0;
    while (usedColumns.has(column)) {
      column++;
    }

    const totalColumns = Math.max(column + 1, ...overlapping.map(e =>
      layout.get(e.id)?.totalColumns || 1
    ));

    layout.set(event.id, { column, totalColumns });

    // Update totalColumns for all overlapping events
    for (const overlap of overlapping) {
      if (layout.has(overlap.id)) {
        const existing = layout.get(overlap.id)!;
        layout.set(overlap.id, { ...existing, totalColumns });
      }
    }
  }

  return layout;
};

export const CalendarGrid = ({
  selectedDate,
  events,
  isDragging,
  draggedEvent,
  dragStartY,
  dragCurrentY,
  onEventClick,
  onSlotClick,
  onEventDragStart,
  onEventDragMove,
  onEventDragEnd,
}: CalendarGridProps) => {
  const hours = getHourLabels();

  // Filter events for selected date
  const dayEvents = events.filter(
    event => event.date.toDateString() === selectedDate.toDateString()
  );

  // Calculate layout for overlapping events
  const eventLayout = calculateEventLayout(dayEvents);

  return (
    <div className="flex-1 overflow-y-auto relative">
      <div className="flex">
        {/* Time column */}
        <div className="w-16 shrink-0 border-r border-gray-800">
          {hours.map((hour, index) => (
            <div key={index} className="h-16 text-xs text-gray-400 pr-2 pt-1 text-right">
              {hour}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="flex-1 relative">
          {/* Hour slots */}
          {hours.map((hour, index) => (
            <button
              key={index}
              onClick={() => onSlotClick(index)}
              className="w-full h-16 border-b border-gray-800 hover:bg-gray-800 transition-colors text-left relative"
            />
          ))}

          {/* Render all events with proper positioning */}
          <div
            onMouseMove={onEventDragMove}
            onMouseUp={onEventDragEnd}
            onTouchMove={onEventDragMove}
            onTouchEnd={onEventDragEnd}
            className="absolute inset-0 pointer-events-none"
          >
            {dayEvents.map(event => {
              const offset = calculateEventOffset(event.startTime);
              const heightInPixels = Math.max(event.duration * HOUR_HEIGHT_PX, 32);
              let topPosition = event.time * HOUR_HEIGHT_PX + offset * HOUR_HEIGHT_PX;

              // If this is the dragged event, apply drag offset
              if (isDragging && draggedEvent?.id === event.id) {
                const dragOffsetY = dragCurrentY - dragStartY;
                topPosition += dragOffsetY;
              }

              // Get layout info for overlapping events
              const layout = eventLayout.get(event.id) || { column: 0, totalColumns: 1 };
              const widthPercent = 100 / layout.totalColumns;
              const leftPercent = (layout.column * widthPercent);

              return (
                <button
                  key={event.id}
                  onMouseDown={(e) => onEventDragStart(event, e)}
                  onTouchStart={(e) => onEventDragStart(event, e)}
                  onClick={(e) => {
                    if (!isDragging) {
                      e.stopPropagation();
                      onEventClick(event);
                    }
                  }}
                  className={`absolute ${event.color} rounded px-2 py-1 text-xs text-black font-medium overflow-hidden flex items-start cursor-move pointer-events-auto ${
                    isDragging && draggedEvent?.id === event.id ? 'opacity-70 z-50' : ''
                  }`}
                  style={{
                    top: `${topPosition}px`,
                    height: `${heightInPixels}px`,
                    left: `calc(${leftPercent}% + 4px)`,
                    width: `calc(${widthPercent}% - 8px)`
                  }}
                >
                  <span className="line-clamp-3">{event.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
