/**
 * Modal for creating and editing events
 * Multi-step form for all event details
 */

import { useState, useEffect } from 'react';
import { Event } from '../lib/types';
import { EVENT_TYPES, REPEAT_OPTIONS } from '../lib/constants';
import { TimePickerModal } from './TimePickerModal';
import { formatHeaderDate } from '../lib/time-utils';

interface EventFormModalProps {
  isOpen: boolean;
  selectedDate: Date;
  initialHour?: number; // For creating events at specific times
  editEvent?: Event | null; // For editing existing events
  onSave: (eventData: Partial<Event>) => Promise<boolean>;
  onClose: () => void;
}

export const EventFormModal = ({
  isOpen,
  selectedDate,
  initialHour = 9,
  editEvent,
  onSave,
  onClose,
}: EventFormModalProps) => {
  // Form state
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState(EVENT_TYPES[0].name);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [repeat, setRepeat] = useState('Does not repeat');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);
  const [backup, setBackup] = useState(false);
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState('');

  // Time picker state
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Step management
  const [step, setStep] = useState<'type' | 'details'>('type');

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editEvent) {
        // Editing existing event
        setTitle(editEvent.title);
        setEventType(editEvent.type);
        setStartTime(editEvent.startTime);
        setEndTime(editEvent.endTime);
        setRepeat(editEvent.repeat);
        setRecurrenceEndDate(editEvent.recurrenceEndDate || null);
        setBackup(editEvent.backup);
        setNotes(editEvent.notes || '');
        setAddress(editEvent.address || '');
        setStep('details');
      } else {
        // Creating new event
        const hour = initialHour.toString().padStart(2, '0');
        const nextHour = ((initialHour + 1) % 24).toString().padStart(2, '0');
        setStartTime(`${hour}:00`);
        setEndTime(`${nextHour}:00`);
      }
    }
  }, [isOpen, editEvent, initialHour]);

  const handleTypeSelect = (type: string) => {
    setEventType(type);
    setStep('details');
  };

  const handleBack = () => {
    if (step === 'details' && !editEvent) {
      setStep('type');
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form
    setTitle('');
    setEventType(EVENT_TYPES[0].name);
    setStartTime('09:00');
    setEndTime('10:00');
    setRepeat('Does not repeat');
    setRecurrenceEndDate(null);
    setBackup(false);
    setNotes('');
    setAddress('');
    setStep('type');
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter an event title');
      return;
    }

    // Calculate duration and time
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startDecimal = startHour + startMin / 60;
    const endDecimal = endHour + endMin / 60;
    let duration = endDecimal - startDecimal;

    // Handle overnight events
    if (duration < 0) {
      duration += 24;
    }

    const eventColor = EVENT_TYPES.find(t => t.name === eventType)?.color || 'bg-gray-500';

    const eventData: Partial<Event> = {
      title: title.trim(),
      type: eventType,
      color: eventColor,
      time: startHour,
      duration,
      startTime,
      endTime,
      repeat,
      recurrenceEndDate,
      backup,
      backupPattern: backup ? 'diagonal' : 'none',
      notes: notes.trim() || undefined,
      address: address.trim() || undefined,
      date: selectedDate,
    };

    const success = await onSave(eventData);
    if (success) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const selectedEventType = EVENT_TYPES.find(t => t.name === eventType);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="bg-gray-900 rounded-2xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-normal text-white">
              {editEvent ? 'Edit Event' : step === 'type' ? 'Select Event Type' : 'Event Details'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step 1: Select Event Type (only when creating) */}
          {step === 'type' && !editEvent && (
            <div className="space-y-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.name}
                  onClick={() => handleTypeSelect(type.name)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  <div className={`w-8 h-8 ${type.color} rounded-full flex-shrink-0`} />
                  <span className="text-white text-base">{type.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Event Details */}
          {step === 'details' && (
            <div className="space-y-4">
              {/* Selected Type Display */}
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <div className={`w-8 h-8 ${selectedEventType?.color} rounded-full`} />
                <span className="text-white font-medium">{eventType}</span>
              </div>

              {/* Date Display */}
              <div className="text-sm text-gray-400">
                {formatHeaderDate(selectedDate)}
              </div>

              {/* Title */}
              <div>
                <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  id="eventTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter event title"
                  autoFocus
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Time
                  </label>
                  <button
                    onClick={() => setShowStartTimePicker(true)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:border-gray-600 transition-colors text-left"
                  >
                    {startTime}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Time
                  </label>
                  <button
                    onClick={() => setShowEndTimePicker(true)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:border-gray-600 transition-colors text-left"
                  >
                    {endTime}
                  </button>
                </div>
              </div>

              {/* Repeat */}
              <div>
                <label htmlFor="repeat" className="block text-sm font-medium text-gray-300 mb-2">
                  Repeat
                </label>
                <select
                  id="repeat"
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {REPEAT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Backup Event Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-white font-medium">Backup Event</div>
                  <div className="text-xs text-gray-400">Mark as backup/tentative</div>
                </div>
                <button
                  onClick={() => setBackup(!backup)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    backup ? 'bg-pink-500' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      backup ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  placeholder="Add notes..."
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                  Location (Optional)
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  {editEvent ? 'Cancel' : 'Back'}
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-black font-medium rounded-lg transition-colors"
                >
                  {editEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Pickers */}
      <TimePickerModal
        isOpen={showStartTimePicker}
        initialTime={startTime}
        title="Select Start Time"
        onSelect={setStartTime}
        onClose={() => setShowStartTimePicker(false)}
      />

      <TimePickerModal
        isOpen={showEndTimePicker}
        initialTime={endTime}
        title="Select End Time"
        onSelect={setEndTime}
        onClose={() => setShowEndTimePicker(false)}
      />
    </>
  );
};
