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
                  className={`absolute left-1 right-1 ${event.color} rounded px-2 py-1 text-xs text-black font-medium overflow-hidden flex items-start cursor-move pointer-events-auto ${
                    isDragging && draggedEvent?.id === event.id ? 'opacity-70 z-50' : ''
                  }`}
                  style={{
                    top: `${topPosition}px`,
                    height: `${heightInPixels}px`
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
