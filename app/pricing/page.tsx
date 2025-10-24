'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    name: 'Free',
    price: '$0',
    priceValue: 0,
    tier: 'free',
    priceId: null,
    features: [
      'Basic calendar features',
      'Up to 10 events per month',
      'Community support',
    ],
  },
  {
    name: 'Basic',
    price: '$9.99',
    priceValue: 999,
    tier: 'basic',
    priceId: 'price_basic',
    features: [
      'Unlimited calendar events',
      'Basic sync',
      'Email support',
      'Export functionality',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$19.99',
    priceValue: 1999,
    tier: 'premium',
    priceId: 'price_premium',
    features: [
      'Everything in Basic',
      'Advanced sync',
      'Priority support',
      'Custom event types',
      'Analytics dashboard',
      'Team collaboration',
    ],
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string | null, tier: string) => {
    if (!priceId) return

    setLoading(tier)
    setError(null)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, tier }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setLoading(null)
        return
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe && data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Select the plan that best fits your needs
          </p>
          <div className="mt-4">
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-indigo-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.priceValue > 0 && (
                    <span className="text-gray-600">/month</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId, plan.tier)}
                  disabled={!plan.priceId || loading === plan.tier}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  } ${
                    (!plan.priceId || loading === plan.tier) && 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {loading === plan.tier
                    ? 'Processing...'
                    : plan.priceId
                    ? 'Subscribe'
                    : 'Current Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need help choosing a plan?
          </h2>
          <p className="text-gray-600 mb-4">
            All plans include a 14-day money-back guarantee. Cancel anytime.
          </p>
          <p className="text-gray-600">
            Questions? Contact us at{' '}
            <a href="mailto:support@example.com" className="text-indigo-600 hover:text-indigo-500">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
