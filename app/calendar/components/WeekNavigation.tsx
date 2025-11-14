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

  return (
    <div className="flex border-b border-gray-800">
      <div className="w-16 shrink-0"></div>
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
    </div>
  );
};
