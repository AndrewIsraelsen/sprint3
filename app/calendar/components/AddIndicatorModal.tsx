/**
 * Modal for adding new key indicators
 * Allows users to select event type, measurement type, and set goal
 */

import { useState } from 'react';
import { EVENT_TYPES } from '../lib/constants';

interface AddIndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIndicator: (eventType: string, measurementType: 'time' | 'frequency', goalValue: number) => void;
}

export const AddIndicatorModal = ({
  isOpen,
  onClose,
  onAddIndicator,
}: AddIndicatorModalProps) => {
  const [step, setStep] = useState<'type' | 'settings'>(
'type');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [measurementType, setMeasurementType] = useState<'time' | 'frequency'>('time');
  const [goalValue, setGoalValue] = useState<number>(1);

  const handleTypeSelect = (eventType: string) => {
    setSelectedType(eventType);
    setStep('settings');
  };

  const handleBack = () => {
    setStep('type');
    setSelectedType(null);
  };

  const handleAdd = () => {
    if (selectedType && goalValue > 0) {
      onAddIndicator(selectedType, measurementType, goalValue);
      // Reset state
      setStep('type');
      setSelectedType(null);
      setMeasurementType('time');
      setGoalValue(1);
      onClose();
    }
  };

  const handleClose = () => {
    // Reset state on close
    setStep('type');
    setSelectedType(null);
    setMeasurementType('time');
    setGoalValue(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-gray-900 rounded-2xl p-6 mx-4 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-normal text-white">
            {step === 'type' ? 'Add Key Indicator' : 'Set Goal'}
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

        {/* Step 1: Select Event Type */}
        {step === 'type' && (
          <>
            <p className="text-gray-400 text-sm mb-4">
              Select an event type to track
            </p>

            <div className="space-y-2">
              {EVENT_TYPES.map((eventType) => (
                <button
                  key={eventType.name}
                  onClick={() => handleTypeSelect(eventType.name)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  <div className={`w-8 h-8 ${eventType.color} rounded-full flex-shrink-0`} />
                  <span className="text-white text-base">{eventType.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleClose}
              className="w-full mt-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </>
        )}

        {/* Step 2: Configure Measurement & Goal */}
        {step === 'settings' && (
          <>
            {/* Show selected type */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-800 rounded-lg">
              <div className={`w-8 h-8 ${EVENT_TYPES.find(t => t.name === selectedType)?.color} rounded-full`} />
              <span className="text-white font-medium">{selectedType}</span>
            </div>

            {/* Measurement Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Measurement Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMeasurementType('time');
                    setGoalValue(1);
                  }}
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
                  onClick={() => {
                    setMeasurementType('frequency');
                    setGoalValue(1);
                  }}
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
            <div className="mb-6">
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
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                {measurementType === 'time'
                  ? 'How many hours per week do you want to spend?'
                  : 'How many times per week do you want to do this?'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleAdd}
                disabled={goalValue <= 0}
                className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Indicator
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
