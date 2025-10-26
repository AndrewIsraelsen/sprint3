# Stripe Configuration Complete! ✅

## What Was Set Up

Your Stripe subscription products are now live and configured in your code!

### Products Created in Stripe

| Plan | Price | Price ID | Product ID |
|------|-------|----------|------------|
| **Basic Plan** | $9.99/month | `price_1SM0BhJwLJFduW01Rz2WkbfD` | `prod_TIbO2MyeZaQUhf` |
| **Premium Plan** | $19.99/month | `price_1SM0BhJwLJFduW01Sau5RPKC` | `prod_TIbOo038ppGzBH` |

### Files Updated

1. **`lib/stripe/config.ts`** - Central Stripe configuration
   - Basic Plan Price ID: ✅ Updated
   - Premium Plan Price ID: ✅ Updated

2. **`app/calendar/page.tsx`** - Calendar page with upgrade modal
   - Basic Plan Price ID: ✅ Updated
   - Premium Plan Price ID: ✅ Updated

---

## How Payments Work Now

### User Flow
1. User clicks on locked feature (Home, Profile, Location, or Sync tabs)
2. Upgrade modal appears showing Basic ($9.99) and Premium ($19.99) plans
3. User clicks on a plan
4. Redirects to Stripe Checkout page
5. User enters payment details
6. On successful payment:
   - Stripe calls your webhook: `/api/stripe-webhook`
   - Webhook updates user's subscription status in Supabase
   - User gets access to premium features (when you build them)

### Test Mode vs. Production

Currently using **TEST MODE**:
- Test card: `4242 4242 4242 4242` (any future date, any CVC)
- No real money is charged
- All transactions appear in Stripe Dashboard under "Test mode"

To switch to production:
1. Get live Stripe API keys from dashboard
2. Update environment variables in Vercel
3. Run the script again with live keys (optional, or create products in dashboard)
4. No code changes needed!

---

## View Your Products

**Stripe Dashboard:**
- Test Products: https://dashboard.stripe.com/test/products
- Live Products: https://dashboard.stripe.com/products

You can edit pricing, descriptions, and features directly in the Stripe Dashboard.

---

## Testing the Integration

### 1. Test Locally
```bash
npm run dev
# Open http://localhost:3000
# Log in and click any tab except Calendar
# Click on Basic or Premium plan
```

### 2. Use Stripe Test Cards
```
Success: 4242 4242 4242 4242
Decline:  4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### 3. Monitor Webhooks
Check that your webhook is receiving events:
- Dashboard → Developers → Webhooks
- Should show: `checkout.session.completed` events

---

## Subscription Features (When Built)

Once subscribed, users will have access to:

### Basic Plan ($9.99/mo)
- ✅ Unlimited calendar events (already available)
- 🔜 Basic sync (coming soon)
- 🔜 Email support (coming soon)

### Premium Plan ($19.99/mo)
- ✅ Everything in Basic
- 🔜 Advanced sync (coming soon)
- 🔜 Priority support (coming soon)
- 🔜 Custom event types (coming soon)
- 🔜 Analytics (coming soon)

---

## Managing Subscriptions

### Check User's Subscription Status

In your code, you can check:
```typescript
const { data: profile } = await supabase
  .from('user_profiles')
  .select('subscription_status, subscription_tier')
  .eq('id', user.id)
  .single();

if (profile.subscription_status === 'active') {
  // User has active subscription
  // Show premium features based on tier
}
```

### Subscription Statuses
- `free` - No subscription
- `active` - Active subscription
- `canceled` - Canceled (may still have access until period ends)
- `past_due` - Payment failed

---

## Troubleshooting

### "Invalid price ID" error
- Make sure you deployed the latest code
- Check that environment variables are set in Vercel
- Verify Price IDs in Stripe Dashboard

### Webhook not receiving events
- Check webhook URL in Stripe: `https://live-my-gospel-pink.vercel.app/api/stripe-webhook`
- Verify `STRIPE_WEBHOOK_SECRET` is set in Vercel
- Check Vercel logs for errors

### Payment not updating database
- Check webhook logs in Stripe Dashboard
- Verify `user_profiles` table exists in Supabase
- Check Supabase logs for errors

---

## Next Steps

1. **Test the payment flow** - Try subscribing with test card
2. **Build premium features** - Add the "coming soon" features
3. **Add subscription management** - Let users cancel/upgrade
4. **Set up billing portal** - Stripe Customer Portal for self-service
5. **Go live** - Switch to production mode when ready

---

## Useful Commands

**Create new products** (if needed):
```bash
npx tsx scripts/create-stripe-products.ts
```

**View Stripe Dashboard:**
```bash
open https://dashboard.stripe.com/test/products
```

**Monitor webhooks:**
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

---

## Support Resources

- **Stripe Docs:** https://stripe.com/docs
- **Stripe Testing:** https://stripe.com/docs/testing
- **Webhooks Guide:** https://stripe.com/docs/webhooks
- **Customer Portal:** https://stripe.com/docs/billing/subscriptions/customer-portal

---

**All set! Your Stripe integration is ready to accept payments! 🎉**
