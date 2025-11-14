/**
 * Week navigation component showing 7-day week selector
 */

import { getWeekDays } from '../lib/date-utils';

interface WeekNavigationProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const WeekNavigation = ({ selectedDate, onDateSelect }: WeekNavigationProps) => {
  const weekDays = getWeekDays(selectedDate);

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateSelect(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateSelect(newDate);
  };

  return (
    <div className="flex border-b border-gray-800">
      {/* Previous Week Arrow */}
      <div className="w-16 shrink-0 flex items-center justify-center border-r border-gray-800">
        <button
          onClick={handlePrevWeek}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Previous week"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Week Days */}
      <div className="flex flex-1 overflow-x-auto">
        {weekDays.map((day, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(day.fullDate)}
            className={`flex-1 min-w-[60px] text-center py-3 cursor-pointer hover:bg-gray-800 transition-colors ${
              day.isSelected ? 'border-2 border-pink-500' : 'border border-gray-700'
            }`}
          >
            <div className="text-xs text-gray-400">{day.day}</div>
            <div className={`text-2xl ${day.isSelected ? 'text-white' : 'text-gray-300'}`}>
              {day.date}
            </div>
          </button>
        ))}
      </div>

      {/* Next Week Arrow */}
      <div className="w-16 shrink-0 flex items-center justify-center border-l border-gray-800">
        <button
          onClick={handleNextWeek}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Next week"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
