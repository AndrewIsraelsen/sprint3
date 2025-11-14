# Fix Supabase CLI Migration Tracking

## The Problem:
The Supabase CLI doesn't know that migrations 001 and 002 were already applied manually, so it tries to re-run them and gets conflicts.

## The Solution (2 steps):

### Step 1: Tell the CLI that 001 and 002 are already applied

1. Go to **Supabase Dashboard** → **SQL Editor** → **New Query**
2. Copy/paste this SQL:

```sql
-- Mark migrations 001 and 002 as applied in the tracking table
INSERT INTO supabase_migrations.schema_migrations (version, statements, name)
VALUES
  ('001', ARRAY[]::text[], '001_calendar_schema'),
  ('002', ARRAY[]::text[], '002_add_calendar_fields')
ON CONFLICT (version) DO NOTHING;
```

3. Click **Run**

### Step 2: Push remaining migrations via CLI

Now the CLI will work! Run these commands in your terminal:

```bash
# Verify the status (should show 001, 002, 003 as applied)
supabase migration list --linked

# Push the new migrations (004, 005, 006, 007)
supabase db push --linked
```

This will apply:
- 004: Email confirmation bypass
- 005: Indicator measurement types
- 006: Event recurrence fields
- 007: Default indicators trigger

## Verification:

After running, check status again:
```bash
supabase migration list --linked
```

All migrations should show as applied (have checkmarks in Remote column).

## Why This Works:

The CLI uses a table called `supabase_migrations.schema_migrations` to track which migrations have been applied. By manually inserting records for 001 and 002, we're telling the CLI "these are already done, skip them."
