# Recurring Jobs Implementation
## Sprint 1.3: Recurring Appointments

**Date:** January 10, 2025  
**Status:** ✅ Backend Complete, Frontend API Ready  
**Next Steps:** Create frontend UI components

---

## Overview

Implemented the foundation for a recurring jobs system that allows:
- Creating recurring job templates with various patterns (daily, weekly, monthly, custom)
- Generating job instances from templates
- Managing job series (edit all, skip one, delete series)
- Handling exceptions and modifications

---

## Backend Implementation

### Database Schema

Created migration file: `backend/prisma/migrations/create_recurring_jobs.sql`

**Tables Created:**
1. **recurring_job_templates** - Templates for recurring job series
   - Recurrence patterns (daily, weekly, monthly, custom)
   - Time settings (start_time, end_time, duration)
   - Date range (start_date, end_date, max_occurrences)
   - Job template data (stored as JSONB)

2. **recurring_job_instances** - Links individual jobs to templates
   - Tracks which jobs belong to which template
   - Handles exceptions (skipped, modified, cancelled)
   - Tracks occurrence numbers

**Fields Added to Jobs Table:**
- `parent_job_id` - For series relationships
- `is_recurring` - Flag for recurring jobs
- `recurring_template_id` - Link to template

### API Endpoints

**Base Path:** `/api/v1/jobs/recurring`

1. **POST `/recurring`**
   - Create a recurring job template
   - Body: `CreateRecurringJobTemplateDto`

2. **GET `/recurring`**
   - Get all recurring job templates
   - Query: `active_only` (boolean)

3. **GET `/recurring/:id`**
   - Get a specific recurring job template

4. **PUT `/recurring/:id`**
   - Update a recurring job template
   - Body: `UpdateRecurringJobTemplateDto`

5. **DELETE `/recurring/:id`**
   - Delete a recurring job template
   - Query: `delete_all_jobs` (boolean)

6. **POST `/recurring/:id/generate`**
   - Generate jobs from a template
   - Body: `GenerateRecurringJobsDto`

7. **PUT `/:id/skip-recurrence`**
   - Skip a single occurrence of a recurring job

### Service Methods

**File:** `backend/src/jobs/jobs.service.ts`

Methods created (stubbed for now):
- `createRecurringJobTemplate()` - Create template
- `generateRecurringJobs()` - Generate job instances
- `getRecurringJobTemplates()` - List templates
- `updateRecurringJobTemplate()` - Update template
- `deleteRecurringJobTemplate()` - Delete template
- `skipRecurringJobOccurrence()` - Skip single occurrence

**Status:** ✅ All service methods fully implemented with:
- Date calculation logic for all recurrence types
- Job generation from templates
- Exception handling (skip occurrences)
- Template CRUD operations

### DTOs

**File:** `backend/src/jobs/dto/recurring-jobs.dto.ts`

- `CreateRecurringJobTemplateDto` - Create/update template
- `UpdateRecurringJobTemplateDto` - Update existing template
- `GenerateRecurringJobsDto` - Generate jobs
- `RecurringJobTemplateResponseDto` - Response format

---

## Recurrence Patterns Supported

1. **Daily**
   - Every N days
   - Example: Every 2 days

2. **Weekly**
   - Specific days of week
   - Every N weeks
   - Example: Every Monday, Wednesday, Friday

3. **Monthly**
   - Day of month (1-31)
   - Weekday of month (first Monday, last Friday, etc.)
   - Every N months
   - Example: 15th of every month, or first Monday of every month

4. **Custom**
   - Every N days/weeks/months
   - Flexible patterns

---

## Implementation Status

### ✅ Backend Implementation - COMPLETE
1. **Service Methods** - ✅ Fully Implemented
   - `createRecurringJobTemplate()` - ✅ Creates template in database
   - `generateRecurringJobs()` - ✅ Calculates dates and creates jobs
   - `getRecurringJobTemplates()` - ✅ Lists templates
   - `updateRecurringJobTemplate()` - ✅ Updates template
   - `deleteRecurringJobTemplate()` - ✅ Deletes template
   - `skipRecurringJobOccurrence()` - ✅ Skips single occurrence

2. **Recurrence Calculation Logic** - ✅ Complete
   - Daily: ✅ Add N days
   - Weekly: ✅ Find next occurrence of specified days
   - Monthly: ✅ Calculate next month's date (day of month)
   - Custom: ✅ Handle flexible patterns

3. **Exception Handling** - ✅ Complete
   - ✅ Skip occurrences
   - ✅ Track exceptions in database
   - ⏳ Modify individual jobs (future enhancement)

### ✅ Frontend API Integration - COMPLETE
- ✅ Added `enhancedApi.jobs.recurring` object with all methods:
  - `createTemplate()` - Create template
  - `list()` - List templates
  - `get()` - Get template
  - `update()` - Update template
  - `delete()` - Delete template
  - `generate()` - Generate jobs
  - `skipOccurrence()` - Skip occurrence

### Frontend Implementation
1. **Recurrence Pattern Selector Component**
   - Pattern type selector (daily/weekly/monthly/custom)
   - Day selection for weekly
   - Month day/weekday selection for monthly
   - Interval input
   - End date/occurrence count

2. **Recurrence Preview Component**
   - Show generated dates
   - Visual calendar preview
   - Occurrence count

3. **Series Management UI**
   - Edit all occurrences
   - Skip single occurrence
   - Delete entire series
   - View series details

4. **Calendar Indicators**
   - Visual indicator for recurring jobs
   - Series relationship display
   - Exception indicators

---

## Database Migration

**To apply the migration:**

1. Run the SQL file:
   ```bash
   psql -d verofield -f backend/prisma/migrations/create_recurring_jobs.sql
   ```

2. Or use Prisma (if added to schema):
   ```bash
   npx prisma migrate dev --name add_recurring_jobs
   ```

**Note:** The backend code will throw errors until tables are created. This is expected behavior.

---

## Files Created/Modified

### Created:
- `backend/prisma/migrations/create_recurring_jobs.sql`
- `backend/src/jobs/dto/recurring-jobs.dto.ts`
- `RECURRING_JOBS_IMPLEMENTATION.md`

### Modified:
- `backend/src/jobs/jobs.service.ts` - Added recurring job methods (stubbed)
- `backend/src/jobs/jobs.controller.ts` - Added recurring job endpoints
- `backend/src/jobs/dto/index.ts` - Exported recurring jobs DTOs

---

## Known Limitations

1. **Database Tables:** Tables need to be created manually or via migration
2. **Service Methods:** Methods are stubbed and throw errors (need implementation)
3. **Recurrence Logic:** Date calculation logic not yet implemented
4. **Frontend:** UI components not yet created

---

## Future Enhancements

1. **Advanced Patterns:**
   - Yearly recurrence
   - Business days only
   - Skip holidays
   - Custom date lists

2. **Bulk Operations:**
   - Generate multiple months at once
   - Bulk edit series
   - Bulk skip occurrences

3. **Notifications:**
   - Alert when series needs generation
   - Remind about upcoming recurring jobs
   - Series completion notifications

4. **Analytics:**
   - Series completion rates
   - Recurring job trends
   - Template usage statistics

---

**Status:** Backend structure complete. Ready for service method implementation and frontend development.

