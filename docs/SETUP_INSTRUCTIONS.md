# Region Dashboard Setup Instructions

## Database Migration Required

The region dashboard system requires database tables to be created. The migration file is located at:
`backend/prisma/migrations/create_dashboard_regions.sql`

### To Apply the Migration:

**Option 1: Using psql (PostgreSQL CLI)**
```bash
cd backend
psql -U your_username -d your_database_name -f prisma/migrations/create_dashboard_regions.sql
```

**Option 2: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `backend/prisma/migrations/create_dashboard_regions.sql`
4. Paste and execute the SQL

**Option 3: Using Prisma (if configured)**
```bash
cd backend
npx prisma migrate dev --name create_dashboard_regions
# Then manually run the SQL file if Prisma doesn't support custom SQL
```

### Verify Migration

After running the migration, verify the tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'dashboard_%';
```

You should see:
- `dashboard_regions`
- `dashboard_layout_versions`
- `dashboard_region_acls`
- `dashboard_widget_registry`
- `dashboard_migration_logs`
- `dashboard_region_presence`
- `dashboard_layout_audit`

## Backend Server

Make sure your backend server is running:
```bash
cd backend
npm run start:dev
```

The server should be running on `http://localhost:3001`

## Testing the API

Once the migration is applied and the backend is running, test the endpoints:

1. **Get Default Layout:**
   ```bash
   curl -X GET http://localhost:3001/api/dashboard/layouts/default \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **List Regions (after getting layout ID):**
   ```bash
   curl -X GET http://localhost:3001/api/dashboard/layouts/{layoutId}/regions \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **List Versions:**
   ```bash
   curl -X GET http://localhost:3001/api/dashboard/layouts/{layoutId}/versions \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Troubleshooting

### Error: "relation does not exist"
- The migration hasn't been run
- Run the migration SQL file

### Error: "401 Unauthorized"
- Check your authentication token
- Make sure you're logged in
- Verify JWT token is valid

### Error: "Connection refused"
- Backend server isn't running
- Check if port 3001 is available
- Verify backend is listening on correct port

### Error: "RLS policy violation"
- Check that RLS policies are correctly set up
- Verify tenant_id is being passed correctly
- Check user permissions

## Next Steps

After the migration is applied:
1. Restart the backend server
2. Refresh the frontend
3. Navigate to `/region-dashboard`
4. The dashboard should load without API errors





