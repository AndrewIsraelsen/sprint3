import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

export const STRIPE_PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 999, // $9.99 in cents
    priceId: 'price_1SM0BhJwLJFduW01Rz2WkbfD',
    features: [
      'Unlimited calendar events',
      'Basic sync',
      'Email support',
    ],
  },
  premium: {
    name: 'Premium Plan',
    price: 1999, // $19.99 in cents
    priceId: 'price_1SM0BhJwLJFduW01Sau5RPKC',
    features: [
      'Everything in Basic',
      'Advanced sync',
      'Priority support',
      'Custom event types',
      'Analytics',
    ],
  },
}
