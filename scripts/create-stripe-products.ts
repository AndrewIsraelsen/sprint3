import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// This script creates your subscription products in Stripe
// Run with: npx tsx scripts/create-stripe-products.ts

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY not found in .env.local');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

async function createProducts() {
  try {
    console.log('Creating Stripe products...\n');

    // Create Basic Plan
    console.log('📦 Creating Basic Plan...');
    const basicProduct = await stripe.products.create({
      name: 'Live My Gospel - Basic Plan',
      description: 'Unlimited calendar events, basic sync, and email support',
    });

    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 999, // $9.99 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      nickname: 'Basic Monthly',
    });

    console.log(`✅ Basic Plan created!`);
    console.log(`   Product ID: ${basicProduct.id}`);
    console.log(`   Price ID: ${basicPrice.id}\n`);

    // Create Premium Plan
    console.log('📦 Creating Premium Plan...');
    const premiumProduct = await stripe.products.create({
      name: 'Live My Gospel - Premium Plan',
      description: 'Everything in Basic plus advanced sync, priority support, custom event types, and analytics',
    });

    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 1999, // $19.99 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      nickname: 'Premium Monthly',
    });

    console.log(`✅ Premium Plan created!`);
    console.log(`   Product ID: ${premiumProduct.id}`);
    console.log(`   Price ID: ${premiumPrice.id}\n`);

    // Print summary for easy copying
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 COPY THESE PRICE IDs TO YOUR CODE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('1. Update lib/stripe/config.ts:');
    console.log(`   basic.priceId: '${basicPrice.id}'`);
    console.log(`   premium.priceId: '${premiumPrice.id}'\n`);
    console.log('2. Update app/calendar/page.tsx:');
    console.log(`   basic: '${basicPrice.id}'`);
    console.log(`   premium: '${premiumPrice.id}'\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error creating products:', error);
  }
}

createProducts();
