/**
 * Modal for viewing indicator details and contributing events
 * Shows events from the current week that contribute to the indicator's score
 */

import { Indicator, Event } from '../lib/types';
import { formatHeaderDate } from '../lib/time-utils';

interface IndicatorInfoModalProps {
  indicator: Indicator;
  events: Event[];
  isOpen: boolean;
  onClose: () => void;
}

export const IndicatorInfoModal = ({
  indicator,
  events,
  isOpen,
  onClose,
}: IndicatorInfoModalProps) => {
  if (!isOpen) return null;

  // Filter events for this indicator's event type from the current week
  const contributingEvents = events.filter(event => event.type === indicator.event_type);

  // Calculate totals
  const totalHours = contributingEvents.reduce((sum, event) => sum + event.duration, 0);
  const totalCount = contributingEvents.length;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl p-6 mx-4 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${indicator.color} rounded-full flex-shrink-0`} />
            <div>
              <h2 className="text-xl font-normal text-white">
                {indicator.event_type}
              </h2>
              <p className="text-sm text-gray-400">
                {indicator.measurement_type === 'time' ? 'Time-based' : 'Frequency-based'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Summary */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">This Week</span>
            <span className="text-2xl font-medium text-white">
              {indicator.measurement_type === 'time' ? (
                <>
                  {indicator.actual_hours % 1 === 0 ? indicator.actual_hours : indicator.actual_hours.toFixed(1)}/{indicator.goal_hours || 0}
                </>
              ) : (
                <>
                  {indicator.actual_frequency || 0}/{indicator.goal_frequency || 0}
                </>
              )}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`${indicator.color} h-2 rounded-full transition-all duration-300`}
              style={{
                width: indicator.measurement_type === 'time'
                  ? `${Math.min((indicator.actual_hours / (indicator.goal_hours || 1)) * 100, 100)}%`
                  : `${Math.min(((indicator.actual_frequency || 0) / (indicator.goal_frequency || 1)) * 100, 100)}%`
              }}
            />
          </div>
        </div>

        {/* Contributing Events */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            Contributing Events ({contributingEvents.length})
          </h3>

          {contributingEvents.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-sm">No events this week</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contributingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium mb-1 truncate">
                        {event.title || 'Untitled Event'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatHeaderDate(event.date)} • {event.startTime} - {event.endTime}
                      </div>
                    </div>
                    {indicator.measurement_type === 'time' && (
                      <div className="text-pink-400 font-medium flex-shrink-0">
                        {event.duration % 1 === 0 ? event.duration : event.duration.toFixed(1)}h
                      </div>
                    )}
                  </div>
                  {event.notes && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {event.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
