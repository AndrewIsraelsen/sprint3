/**
 * Time picker modal component
 * Reusable modal for selecting hours and minutes in 15-minute increments
 */

import { useState, useEffect } from 'react';

interface TimePickerModalProps {
  isOpen: boolean;
  initialTime?: string; // Format: "HH:MM"
  onSelect: (time: string) => void;
  onClose: () => void;
  title?: string;
}

export const TimePickerModal = ({
  isOpen,
  initialTime = '09:00',
  onSelect,
  onClose,
  title = 'Select Time',
}: TimePickerModalProps) => {
  const [hours, setHours] = useState('09');
  const [minutes, setMinutes] = useState('00');

  // Parse initial time when modal opens
  useEffect(() => {
    if (isOpen && initialTime) {
      const [h, m] = initialTime.split(':');
      setHours(h);
      setMinutes(m);
    }
  }, [isOpen, initialTime]);

  const handleConfirm = () => {
    onSelect(`${hours}:${minutes}`);
    onClose();
  };

  if (!isOpen) return null;

  // Generate hour options (00-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return hour;
  });

  // Minute options in 30-minute increments
  const minuteOptions = ['00', '30'];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl p-6 mx-4 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-normal text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Time Display */}
        <div className="text-center mb-6">
          <div className="text-5xl font-light text-white">
            {hours}:{minutes}
          </div>
        </div>

        {/* Time Pickers */}
        <div className="flex gap-4 mb-6">
          {/* Hours */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">Hour</label>
            <div className="bg-gray-800 rounded-lg max-h-48 overflow-y-auto">
              {hourOptions.map((hour) => (
                <button
                  key={hour}
                  onClick={() => setHours(hour)}
                  className={`w-full py-2 px-4 text-center transition-colors ${
                    hours === hour
                      ? 'bg-pink-500 text-black font-medium'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">Minute</label>
            <div className="bg-gray-800 rounded-lg">
              {minuteOptions.map((minute) => (
                <button
                  key={minute}
                  onClick={() => setMinutes(minute)}
                  className={`w-full py-2 px-4 text-center transition-colors ${
                    minutes === minute
                      ? 'bg-pink-500 text-black font-medium'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-black font-medium rounded-lg transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
