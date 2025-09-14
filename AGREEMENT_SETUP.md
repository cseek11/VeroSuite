# Agreement Indicators & Overdue Tracking Setup

This guide will help you set up the customer agreement indicators and overdue tracking system in your VeroField application using a production-ready database design.

## 🏗️ **Recommended Approach: Separate Tables**

For production use, we recommend using **separate tables** for agreements and payments rather than adding columns to the accounts table. This provides:

- ✅ **Better data integrity** - One account can have multiple agreements with different dates
- ✅ **Payment history tracking** - Complete audit trail of all payments
- ✅ **Scalability** - Easy to add new agreement types without schema changes
- ✅ **Business logic support** - Track start/end dates, amounts, and renewal cycles
- ✅ **Reporting capabilities** - Generate detailed analytics and reports

## Step 1: Database Migration

1. **Open your Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to the SQL Editor

2. **Run the Improved Migration Script**
   - Copy and paste the contents of `database_migration_improved.sql` into the SQL editor
   - Execute the script

   This will create:
   - **`agreements` table** - Stores customer service agreements
   - **`payments` table** - Stores payment records with overdue tracking
   - **Automatic triggers** - Calculate overdue days automatically
   - **Helper functions** - Get account agreement summaries

## Step 2: Test the Implementation

1. **Start the Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to Customers Page**
   - Go to your application
   - Navigate to the Customers page

3. **Add Test Data**
   - Click the "Add Test Agreements" button
   - This will create agreements and payments for your existing customer accounts
   - You should see colored indicators appear in the top-right corner of customer cards

## Step 3: Verify the Features

After adding test data, you should see:

### Agreement Indicators
- 🟢 **Green**: Annual Pest Control Agreement
- 🔵 **Blue**: Monthly Pest Control Agreement  
- 🟡 **Yellow**: Annual Termite Renewal
- 🟠 **Orange**: Termite Bait Stations
- 🟣 **Purple**: Active Rat Monitoring

### Overdue Highlighting
- **Red borders** around customer cards for accounts 30+ days past due
- **"Overdue" badges** with tooltips showing exact days past due

### Compact Layout
- Toggle between **Standard** and **Compact** views
- Compact view shows more customers per screen with smaller cards

## Database Schema

### Agreements Table
```sql
agreements (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  account_id UUID NOT NULL,
  agreement_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active',
  monthly_amount DECIMAL(10,2),
  annual_amount DECIMAL(10,2),
  auto_renewal BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Payments Table
```sql
payments (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  account_id UUID NOT NULL,
  agreement_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'pending',
  overdue_days INTEGER DEFAULT 0,
  payment_method TEXT,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Step 4: Production Usage

### Adding Real Agreement Data

To add real agreement data to customers, you can:

1. **Use the API directly:**
   ```javascript
   // Create an agreement
   await crmApi.createAgreement({
     account_id: 'account-uuid',
     agreement_type: 'annual_pest_control',
     start_date: '2024-01-01',
     end_date: '2025-01-01',
     monthly_amount: 150.00,
     annual_amount: 1800.00
   });

   // Create a payment
   await crmApi.createPayment({
     account_id: 'account-uuid',
     amount: 150.00,
     due_date: '2024-02-01'
   });
   ```

2. **Update via Supabase Dashboard:**
   - Go to Table Editor > agreements
   - Add new agreement records
   - Go to Table Editor > payments
   - Add payment records

### Agreement Types Available

- `annual_pest_control` - Annual Pest Control Agreement
- `monthly_pest_control` - Monthly Pest Control Agreement
- `annual_termite_renewal` - Annual Termite Renewal
- `termite_bait_stations` - Termite Bait Stations
- `rat_monitoring` - Active Rat Monitoring

## Features Included

✅ **Agreement Indicators** - Color-coded badges in top-right corner
✅ **Overdue Highlighting** - Red borders and badges for overdue accounts  
✅ **Compact Layout** - Toggle between standard and compact views
✅ **Tooltips** - Hover to see agreement names and overdue details
✅ **Database Persistence** - Data saved to Supabase and survives refreshes
✅ **Type Safety** - Full TypeScript support with proper types
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Automatic Overdue Calculation** - Database triggers update overdue status
✅ **Payment History** - Complete audit trail of all payments
✅ **Agreement Management** - Track start/end dates and renewal cycles

## Advanced Features

### Automatic Overdue Calculation
The database automatically calculates overdue days when payments are created or updated.

### Agreement Summary Function
Use the `get_account_agreement_summary()` function to get comprehensive agreement data for any account.

### Payment Tracking
Track individual payments with due dates, payment methods, and reference numbers.

## Troubleshooting

### No Indicators Showing
- Make sure you've run the improved database migration
- Click "Add Test Agreements" to populate test data
- Check browser console for any errors

### Database Errors
- Ensure you have proper permissions in Supabase
- Verify the migration script ran successfully
- Check that RLS policies are properly configured

### TypeScript Errors
- Make sure all imports are correct
- Verify the types file is in the right location
- Check that agreement types match the database values

## Next Steps

Once the basic system is working, you can:

1. **Add Agreement Management UI** - Forms to add/edit agreements
2. **Implement Payment Tracking** - Automatic overdue calculation
3. **Add Agreement Expiry Notifications** - Alert system for expiring agreements
4. **Create Agreement Reports** - Analytics and reporting features
5. **Add Bulk Operations** - Mass update agreements across multiple customers
6. **Payment Processing Integration** - Connect with payment gateways
7. **Automated Renewal System** - Handle agreement renewals automatically

## Migration from Simple Approach

If you previously used the simple approach (columns in accounts table), you can migrate:

1. Run the improved migration script
2. Use the data migration function to move existing data
3. Update your application to use the new API methods

This approach provides a solid foundation for a production CRM system with proper data modeling and scalability.
