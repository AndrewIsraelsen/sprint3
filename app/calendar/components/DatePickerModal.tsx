/**
 * Date picker modal component for selecting dates
 */

import { useState } from 'react';
import { getCalendarDays } from '../lib/date-utils';
import { formatHeaderDate } from '../lib/time-utils';
import { MONTH_NAMES } from '../lib/constants';

interface DatePickerModalProps {
  isOpen: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export const DatePickerModal = ({
  isOpen,
  selectedDate,
  onDateSelect,
  onClose,
}: DatePickerModalProps) => {
  const [pickerMonth, setPickerMonth] = useState(selectedDate.getMonth());
  const [pickerYear, setPickerYear] = useState(selectedDate.getFullYear());

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(pickerYear - 1);
    } else {
      setPickerMonth(pickerMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(pickerYear + 1);
    } else {
      setPickerMonth(pickerMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(pickerYear, pickerMonth, day);
    onDateSelect(newDate);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-3xl p-6 mx-4 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-gray-300 mb-4">Select date</h2>

        {/* Current Selected Date Display */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
          <span className="text-4xl font-light">{formatHeaderDate(selectedDate)}</span>
          <button className="p-2 hover:bg-gray-700 rounded">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button className="flex items-center gap-2 text-lg hover:bg-gray-700 px-3 py-2 rounded">
            <span>{MONTH_NAMES[pickerMonth]} {pickerYear}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mb-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-sm text-gray-400 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {getCalendarDays(pickerMonth, pickerYear).map((day, index) => (
              <div key={index} className="aspect-square">
                {day ? (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`w-full h-full rounded-full flex items-center justify-center text-lg transition-colors ${
                      day === selectedDate.getDate() &&
                      pickerMonth === selectedDate.getMonth() &&
                      pickerYear === selectedDate.getFullYear()
                        ? 'bg-pink-500 text-white'
                        : 'hover:bg-gray-700 text-white'
                    }`}
                  >
                    {day}
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-pink-500 hover:bg-gray-700 rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
