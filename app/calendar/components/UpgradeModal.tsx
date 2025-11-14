/**
 * Modal component for displaying subscription upgrade options
 */

import { STRIPE_PRICE_IDS } from '../lib/constants';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProcessing: boolean;
  onUpgrade: (tier: 'basic' | 'premium') => Promise<void>;
}

export const UpgradeModal = ({ isOpen, onClose, isProcessing, onUpgrade }: UpgradeModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-3xl p-6 mx-4 max-w-lg w-full border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-normal">Upgrade to Pro</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Demo Notice */}
        <div className="bg-pink-900 bg-opacity-30 border border-pink-600 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-pink-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-pink-300 mb-1">Demo Version</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                This is currently a demo version of the app. By upgrading, you're investing in future features and supporting continued development. Premium features will be unlocked as we build them!
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="space-y-4 mb-6">
          {/* Basic Plan */}
          <button
            onClick={() => onUpgrade('basic')}
            disabled={isProcessing}
            className="w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-pink-500 rounded-2xl p-5 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-medium">Basic Plan</h3>
                <p className="text-3xl font-light mt-1">$9.99<span className="text-lg text-gray-400">/mo</span></p>
              </div>
              <div className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Popular
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited calendar events</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Basic sync (coming soon)</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Email support</span>
              </li>
            </ul>
          </button>

          {/* Premium Plan */}
          <button
            onClick={() => onUpgrade('premium')}
            disabled={isProcessing}
            className="w-full bg-gradient-to-br from-pink-900 to-purple-900 hover:from-pink-800 hover:to-purple-800 border-2 border-pink-500 rounded-2xl p-5 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-medium">Premium Plan</h3>
                <p className="text-3xl font-light mt-1">$19.99<span className="text-lg text-gray-400">/mo</span></p>
              </div>
              <div className="bg-white text-pink-900 px-4 py-2 rounded-full text-sm font-bold">
                Best Value
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Everything in Basic</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced sync (coming soon)</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Custom event types (coming soon)</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Analytics (coming soon)</span>
              </li>
            </ul>
          </button>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="text-center py-2 text-pink-400">
            <p className="text-sm">Redirecting to checkout...</p>
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full py-3 text-gray-400 hover:text-white transition-colors text-center"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};
