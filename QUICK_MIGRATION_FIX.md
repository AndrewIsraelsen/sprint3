# Quick Migration Fix (30 seconds)

## Do this once, then CLI works forever:

### Step 1: Fix the tracking (Dashboard)
1. Go to: https://supabase.com/dashboard/project/pijuguozjwzzkmmzagsp/sql/new
2. Paste this SQL:

```sql
INSERT INTO supabase_migrations.schema_migrations (version, statements, name)
VALUES
  ('001', ARRAY[]::text[], '001_calendar_schema'),
  ('002', ARRAY[]::text[], '002_add_calendar_fields')
ON CONFLICT (version) DO NOTHING;
```

3. Click "Run"

### Step 2: Push new migrations (Terminal)
```bash
supabase db push --linked
```

### Step 3: Done!
CLI will now work for all future migrations.

---

## Alternative: Apply all migrations at once via Dashboard

If you prefer to do everything in Dashboard:

1. Go to: https://supabase.com/dashboard/project/pijuguozjwzzkmmzagsp/sql/new
2. Copy entire SQL from `APPLY_MIGRATIONS_SAFE.md`
3. Click "Run"
4. Done!

Both approaches work - choose whichever you prefer.
