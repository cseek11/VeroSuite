# Test Data Update Guide

## Overview
This guide explains how to update your existing customers with better variety for testing the search and filtering features.

## What Gets Updated
The script will update your first 6 customers with:

### **Status Variety:**
- `active` - 3 customers
- `inactive` - 1 customer  
- `pending` - 1 customer
- `suspended` - 1 customer

### **Account Balance Variety:**
- Range: $750.25 to $4,500.00
- Different amounts for testing financial views

### **Creation Date Variety:**
- Spread across 6 months (Jan 2024 - Jun 2024)
- Different dates for testing date filtering and reporting

## How to Run

### Option 1: PowerShell Script (Recommended)
```powershell
# Set your Supabase service role key
$env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Run the update script
.\update-test-data.ps1
```

### Option 2: Manual Node.js
```bash
# Set environment variable
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Run the script
node scripts/update-test-data.js
```

## Getting Your Service Role Key
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "service_role" key (not the anon key)
4. Use this as your `SUPABASE_SERVICE_ROLE_KEY`

## What to Test After Update

### **Search Functionality:**
- **Phone Numbers**: Try searching with digits only (e.g., "4125551234") or formatted (e.g., "(412) 555-1234")
- **Addresses**: Try partial searches like "321 oak" or "pittsburgh"
- **Names**: Try partial name searches

### **Filtering:**
- **Status Filter**: Test filtering by active, inactive, pending, suspended
- **Date Filtering**: Test sorting by creation date
- **Balance Filtering**: Test sorting by account balance

### **Sorting:**
- Test all sort columns (Name, Status, Balance, Created)
- Test ascending/descending order

## Safety
- The script only updates existing customers, it doesn't create new ones
- It preserves all other customer data (email, phone, address, etc.)
- Only updates: status, ar_balance, and created_at fields








