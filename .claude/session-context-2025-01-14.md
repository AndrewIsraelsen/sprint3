# Claude Code Session Context - January 14, 2025

## How to Restore This Context

**Tell Claude exactly this:**
> "Read `.claude/session-context-2025-01-14.md` to restore context from our previous session."

---

## Session Summary

### What We Accomplished
- Fixed goal value bug in AddIndicatorModal
- Fixed decimal formatting in key indicators (remove .0 for whole numbers)
- Created IndicatorInfoModal to show events contributing to indicator scores
- Implemented edit/view mode separation (normal click = info, edit mode = edit)
- Fixed overlapping events to display side-by-side
- Created complete event CRUD system (TimePickerModal, EventFormModal, EventSummaryModal)
- Implemented long-press (500ms) activation for drag-and-drop
- Fixed DatePickerModal month/year selector
- Fixed TypeScript build error in handleSaveEvent

### Database Migrations Applied
- Migration 005: Added measurement types (time/frequency) for indicators
- Migration 006: Added event recurrence fields
- Migration 007: Added default indicators trigger

---

## Architecture & Key Decisions

### Component Structure
```
app/calendar/
├── page.tsx                          # Main orchestration
├── components/
│   ├── HomeScreen.tsx               # Indicators view with edit/info modes
│   ├── CalendarGrid.tsx             # Calendar view with overlapping event layout
│   ├── IndicatorInfoModal.tsx       # NEW: Shows events for an indicator
│   ├── TimePickerModal.tsx          # NEW: Reusable time picker
│   ├── EventFormModal.tsx           # NEW: Create/edit events
│   ├── EventSummaryModal.tsx        # NEW: View event details
│   ├── AddIndicatorModal.tsx        # Create indicators (FIXED)
│   └── DatePickerModal.tsx          # Date picker (FIXED)
├── hooks/
│   ├── useEvents.ts                 # Event CRUD (FIXED types)
│   ├── useIndicators.ts             # Indicator management
│   └── useDragDrop.ts              # Drag-drop with long-press (FIXED)
└── lib/
    ├── types.ts                     # TypeScript definitions
    └── constants.ts                 # EVENT_TYPES, REPEAT_OPTIONS, etc.
```

### Key Patterns Used
1. **Custom Hooks Pattern**: Business logic in hooks (useEvents, useIndicators, useDragDrop)
2. **Modal Pattern**: All modals rendered at page level, controlled by state
3. **Long-press UX**: 500ms press required before drag activates
4. **Column Layout Algorithm**: Overlapping events positioned side-by-side
5. **Edit/View Mode**: `onIndicatorInfoClick` vs `onIndicatorEditClick` separation

---

## Important Code Locations

### 1. Indicator Info/Edit Mode Logic
**File**: `app/calendar/components/HomeScreen.tsx:81-90`
```typescript
onClick={() => {
  if (isEditing && onIndicatorEditClick) {
    onIndicatorEditClick(indicator);
  } else if (!isEditing && onIndicatorInfoClick) {
    onIndicatorInfoClick(indicator);
  }
}}
```

### 2. Overlapping Events Algorithm
**File**: `app/calendar/components/CalendarGrid.tsx:24-81`
- Detects time overlaps
- Calculates column positions
- Renders events side-by-side with proper widths

### 3. Long-Press Drag Activation
**File**: `app/calendar/hooks/useDragDrop.ts:29-54`
- 500ms timer before drag activates
- Cancels if user moves >10px during press
- Provides haptic feedback on activation

### 4. Event Save Handler (Fixed Type Issue)
**File**: `app/calendar/page.tsx:198-211`
```typescript
const handleSaveEvent = async (eventData: Partial<Event>) => {
  if (selectedEvent) {
    // Update existing - cast to required type
    const success = await updateEvent(selectedEvent.id, eventData as any);
    if (success) {
      setSelectedEvent(null);
    }
    return success;
  } else {
    // Create new
    const success = await createEvent(eventData as any);
    return success;
  }
};
```

### 5. Decimal Formatting Fix
**File**: `app/calendar/components/HomeScreen.tsx:105`
```typescript
{indicator.actual_hours % 1 === 0 ? indicator.actual_hours : indicator.actual_hours.toFixed(1)}
```

---

## Known Patterns & Conventions

### Event Types
From `lib/constants.ts`:
- Church (red), Family (orange), School (green), Work (blue)
- Travel (purple), Meal (yellow-800), Other (gray)

### Time Handling
- All times use 15-minute increments
- Format: "HH:MM" (24-hour)
- Duration calculated in decimal hours (1.5 = 90 minutes)

### Indicator Types
- **Time-based**: Track hours per week (e.g., "10 hours/week of School")
- **Frequency-based**: Track count per week (e.g., "3 times/week of Church")

### Demo Mode
- Check: `isDemoMode()` from `lib/demo-data.ts`
- When active: uses generated events, bypasses API calls
- Cookie-based: `demoMode=true`

---

## Recent Commits (in order)
```
f439b00 Add session notes for development progress
e7f54e6 Add functional month/year selector to date picker
47397ac Implement long-press activation for event dragging
3a4d3da Add event creation and editing modals
2eba098 Wire up event creation and editing modals
5acb424 Fix overlapping events to display side by side
7fa72c5 Add indicator info modal with edit/view mode separation
2fbdb09 Remove unnecessary decimals from key indicators
a2f4535 Fix goal value bug in AddIndicatorModal
```

---

## TypeScript Type Fixes Applied

### Problem
`updateEvent` and `createEvent` expected all fields non-optional, but we were passing `Partial<Event>`

### Solution
Used type assertion `as any` in `handleSaveEvent` since the event form always provides all required fields:
```typescript
await updateEvent(selectedEvent.id, eventData as any);
```

This is safe because EventFormModal ensures all required fields are present.

---

## Next Session Tips

### To Continue Work
1. Read this file first: `.claude/session-context-2025-01-14.md`
2. Check `SESSION_NOTES.md` for high-level summary
3. Run `git log --oneline -10` to see recent changes

### Common Commands
```bash
npm run dev          # Start dev server
npm run build        # Test production build
git status           # Check current state
git log --oneline    # See commit history
```

### If You Need to Debug
- Check browser console for errors
- Check `app/calendar/page.tsx` for modal wiring
- Check `app/calendar/hooks/useEvents.ts` for API logic
- Demo mode: Look at `lib/demo-data.ts`

---

## Questions I Can Answer Next Time
- "What was the overlapping events algorithm we used?"
- "How does the long-press drag work?"
- "Where is the indicator info modal logic?"
- "What TypeScript error did we fix?"
- "How do we handle edit vs view mode for indicators?"

---

*This context file was created during our January 14, 2025 session where we completed all Debug.docx features.*
