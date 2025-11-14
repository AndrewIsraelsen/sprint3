/**
 * Modal for editing existing key indicators
 * Allows users to change goal values, measurement type, event type name, and color
 */

import { useState, useEffect } from 'react';
import { Indicator } from '../lib/types';
import { EVENT_TYPES } from '../lib/constants';

interface EditIndicatorModalProps {
  indicator: Indicator;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: {
    event_type?: string;
    measurement_type?: 'time' | 'frequency';
    goal_hours?: number | null;
    goal_frequency?: number | null;
  }) => Promise<boolean>;
  onDelete: () => void;
}

export const EditIndicatorModal = ({
  indicator,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EditIndicatorModalProps) => {
  const [eventType, setEventType] = useState(indicator.event_type);
  const [measurementType, setMeasurementType] = useState<'time' | 'frequency'>(indicator.measurement_type);
  const [goalValue, setGoalValue] = useState<number>(
    indicator.measurement_type === 'time'
      ? (indicator.goal_hours || 1)
      : (indicator.goal_frequency || 1)
  );
  const [saving, setSaving] = useState(false);

  // Update form when indicator prop changes
  useEffect(() => {
    setEventType(indicator.event_type);
    setMeasurementType(indicator.measurement_type);
    setGoalValue(
      indicator.measurement_type === 'time'
        ? (indicator.goal_hours || 1)
        : (indicator.goal_frequency || 1)
    );
  }, [indicator]);

  const handleSave = async () => {
    setSaving(true);

    const updates: any = {
      event_type: eventType !== indicator.event_type ? eventType : undefined,
      measurement_type: measurementType !== indicator.measurement_type ? measurementType : undefined,
    };

    // Set goal based on measurement type
    if (measurementType === 'time') {
      updates.goal_hours = goalValue;
      updates.goal_frequency = null;
    } else {
      updates.goal_frequency = goalValue;
      updates.goal_hours = null;
    }

    const success = await onSave(updates);
    setSaving(false);

    if (success) {
      onClose();
    }
  };

  const handleMeasurementTypeChange = (newType: 'time' | 'frequency') => {
    setMeasurementType(newType);
    // Reset goal value when switching types
    setGoalValue(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Edit Indicator</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Event Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Event Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.name}
                  onClick={() => setEventType(type.name)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    eventType === type.name
                      ? 'border-pink-500 bg-pink-500 bg-opacity-10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${type.color}`} />
                  <span className="text-sm text-white">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Measurement Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Measurement Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleMeasurementTypeChange('time')}
                className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                  measurementType === 'time'
                    ? 'border-pink-500 bg-pink-500 bg-opacity-10 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="font-medium">Time</div>
                <div className="text-xs opacity-75">Track hours</div>
              </button>
              <button
                onClick={() => handleMeasurementTypeChange('frequency')}
                className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                  measurementType === 'frequency'
                    ? 'border-pink-500 bg-pink-500 bg-opacity-10 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="font-medium">Frequency</div>
                <div className="text-xs opacity-75">Track count</div>
              </button>
            </div>
          </div>

          {/* Goal Value Input */}
          <div>
            <label htmlFor="goalValue" className="block text-sm font-medium text-gray-300 mb-2">
              {measurementType === 'time' ? 'Goal Hours per Week' : 'Goal Count per Week'}
            </label>
            <input
              id="goalValue"
              type="number"
              min="0.5"
              max="168"
              step={measurementType === 'time' ? '0.5' : '1'}
              value={goalValue}
              onChange={(e) => setGoalValue(Number(e.target.value))}
              className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder={measurementType === 'time' ? 'e.g., 10' : 'e.g., 3'}
            />
            <p className="text-xs text-gray-500 mt-1">
              {measurementType === 'time'
                ? 'How many hours per week do you want to spend?'
                : 'How many times per week do you want to do this?'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800">
          <button
            onClick={onDelete}
            disabled={saving}
            className="px-4 py-2 text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-colors disabled:opacity-50"
          >
            Delete
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || goalValue <= 0}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
