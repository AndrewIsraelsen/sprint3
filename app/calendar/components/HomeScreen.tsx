/**
 * Home screen component showing weekly key indicators
 */

import { Indicator } from '../lib/types';

interface HomeScreenProps {
  indicators: Indicator[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onDeleteIndicator: (id: string) => void;
  onAddIndicator: () => void;
  onIndicatorClick?: (indicator: Indicator) => void;
  onLogout?: () => void;
  inDemoMode?: boolean;
}

export const HomeScreen = ({
  indicators,
  isEditing,
  onToggleEdit,
  onDeleteIndicator,
  onAddIndicator,
  onIndicatorClick,
  onLogout,
  inDemoMode,
}: HomeScreenProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-black">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Weekly Key Indicators</h2>
          <div className="flex items-center gap-3">
            {indicators.length > 0 && (
              <button
                onClick={onToggleEdit}
                className="text-pink-500 text-sm font-medium"
              >
                {isEditing ? 'Done' : 'Edit'}
              </button>
            )}
            {!inDemoMode && onLogout && (
              <button
                onClick={onLogout}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {indicators.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-gray-400 text-center mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-base">No key indicators yet</p>
            <p className="text-sm mt-1">Track your weekly goals by adding indicators</p>
          </div>
          <button
            onClick={onAddIndicator}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
          >
            Add Indicator
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {indicators.map((indicator) => (
              <div
                key={indicator.id}
                onClick={() => !isEditing && onIndicatorClick && onIndicatorClick(indicator)}
                className={`bg-gray-900 border border-gray-700 rounded-xl p-3 relative ${
                  !isEditing && onIndicatorClick ? 'cursor-pointer hover:border-pink-500 transition-colors' : ''
                }`}
              >
                {isEditing && (
                  <button
                    onClick={() => onDeleteIndicator(indicator.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${indicator.color} rounded-full`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 mb-1 truncate">
                      {indicator.event_type}
                    </div>
                    <div className="text-2xl font-medium text-white">
                      {indicator.measurement_type === 'time' ? (
                        <>
                          {indicator.actual_hours.toFixed(1)}/{indicator.goal_hours || 0}
                        </>
                      ) : (
                        <>
                          {indicator.actual_frequency || 0}/{indicator.goal_frequency || 0}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
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
            ))}
          </div>

          <button
            onClick={onAddIndicator}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Indicator
          </button>
        </>
      )}
    </div>
  );
};
