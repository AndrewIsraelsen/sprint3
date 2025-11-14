# Supabase Configuration Guide

## Critical Settings to Fix Email Issues

### 1. Disable Email Confirmation (REQUIRED)

**Location:** Supabase Dashboard > Authentication > Settings > Email Auth

**Settings to change:**
- ✅ **Confirm email**: Set to **OFF** (disabled)
- ✅ **Enable email provider**: Keep ON
- ✅ **Email template**: Can keep default

**Why:** This prevents the "Email not confirmed" error and allows users to log in immediately after signup.

### 2. Remove Email Domain Restrictions

**Location:** Supabase Dashboard > Authentication > Settings > Email Auth

**Settings to verify:**
- ✅ **Allowed email domains**: Should be **EMPTY** or **disabled**
- ❌ Do NOT restrict to specific domains
- ✅ Allow all email formats (@example.com, @test.com, etc.)

**Why:** Restrictive domain validation blocks legitimate test emails and many valid email addresses.

### 3. Apply the Migration

Run the migration to auto-confirm existing users:

```bash
# If using Supabase CLI
supabase db push

# Or apply manually in SQL Editor:
# Copy contents of supabase/migrations/004_disable_email_confirmation.sql
# and run in Supabase Dashboard > SQL Editor
```

This migration will:
- ✅ Confirm all existing unconfirmed users
- ✅ Auto-confirm all new signups via trigger
- ✅ Bypass email verification entirely

### 4. Password Reset Configuration

**Location:** Supabase Dashboard > Authentication > Settings > Email Auth

**Settings:**
- ✅ **Enable password recovery**: ON
- ✅ **Password recovery template**: Use default or customize

### 5. Environment Variables

Verify these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing After Configuration

1. **Test Signup:**
   - Try signing up with any email domain (test@example.com)
   - Should succeed without errors

2. **Test Login:**
   - Use the same credentials immediately
   - Should NOT show "Email not confirmed"
   - Should log in successfully

3. **Test Demo Mode:**
   - Click "Try Demo Mode" on login
   - Should show pre-loaded sample data

## Troubleshooting

### "Email not confirmed" still appears
- Verify "Confirm email" is OFF in dashboard
- Run the migration to confirm existing users
- Clear browser cookies and try again

### Email domain still rejected
- Check "Allowed email domains" is empty
- Try a different email format
- Check Supabase logs for validation errors

### Migration fails
- Ensure you have SUPERUSER privileges
- Run migrations in order (001, 002, 003, 004)
- Check Supabase logs for errors
