/**
 * Modal for adding new key indicators
 */

import { EVENT_TYPES } from '../lib/constants';

interface AddIndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIndicator: (eventType: string) => void;
}

export const AddIndicatorModal = ({
  isOpen,
  onClose,
  onAddIndicator,
}: AddIndicatorModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl p-6 mx-4 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-normal text-white">Add Key Indicator</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          Select an event type to track its weekly hours
        </p>

        <div className="space-y-2">
          {EVENT_TYPES.map((eventType) => (
            <button
              key={eventType.name}
              onClick={() => {
                onAddIndicator(eventType.name);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <div className={`w-8 h-8 ${eventType.color} rounded-full flex-shrink-0`} />
              <span className="text-white text-base">{eventType.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
