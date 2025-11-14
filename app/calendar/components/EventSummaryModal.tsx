/**
 * Modal for viewing event details with edit and delete options
 * Displays full event information in read-only mode
 */

import { Event } from '../lib/types';
import { EVENT_TYPES } from '../lib/constants';
import { formatHeaderDate } from '../lib/time-utils';

interface EventSummaryModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const EventSummaryModal = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: EventSummaryModalProps) => {
  if (!isOpen) return null;

  const eventType = EVENT_TYPES.find(t => t.name === event.type);

  const handleDelete = () => {
    if (confirm(`Delete "${event.title}"?`)) {
      onDelete();
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 ${eventType?.color} rounded-full flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-normal text-white truncate">
                {event.title}
              </h2>
              <p className="text-sm text-gray-400">{eventType?.name}</p>
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

        {/* Event Details */}
        <div className="space-y-4">
          {/* Date & Time */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-white">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatHeaderDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {event.startTime} - {event.endTime}
                <span className="text-gray-400 ml-2">
                  ({event.duration % 1 === 0 ? event.duration : event.duration.toFixed(1)}h)
                </span>
              </span>
            </div>
          </div>

          {/* Repeat Pattern */}
          {event.repeat !== 'Does not repeat' && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <div className="text-white">{event.repeat}</div>
                  {event.recurrenceEndDate && (
                    <div className="text-xs text-gray-400 mt-1">
                      Until {formatHeaderDate(event.recurrenceEndDate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Backup Event Badge */}
          {event.backup && (
            <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-yellow-500 font-medium">Backup Event</span>
              </div>
            </div>
          )}

          {/* Location */}
          {event.address && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-white">{event.address}</div>
              </div>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-white whitespace-pre-wrap">{event.notes}</div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-gray-500 text-center pt-2">
            Created {new Date(event.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
          <button
            onClick={handleDelete}
            className="flex-1 py-3 text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            Delete
          </button>
          <button
            onClick={handleEdit}
            className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-black font-medium rounded-lg transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
