# Week 2-3: Payment Processing UI - Routes Reference

**Last Updated:** 2025-11-16  
**Phase:** Week 2-3 - Payment Processing UI

---

## Overview

This document provides a complete reference for all routes to the new payment processing features implemented in Week 2-3.

---

## Main Routes

### 1. Billing Dashboard
**Route:** `/billing`  
**Component:** `frontend/src/routes/Billing.tsx`  
**Access:** Admin, Owner (requires `invoices:view` permission)

**Description:** Main billing dashboard with multiple tabs for managing invoices, payments, AR, and analytics.

**Available Tabs:**
- **Invoice Management** (`invoices`) - Manage invoices
- **AR Management** (`ar`) - Accounts Receivable management
- **Payment Tracking** (`payments`) - Payment tracking and reconciliation
- **Overdue Alerts** (`overdue`) - Overdue invoice alerts
- **Customer Billing** (`customers`) - Customer billing management (Coming Soon)
- **Analytics** (`analytics`) - Billing analytics and reports
- **Recurring Payments** (`recurring`) - Recurring payment management
- **Settings** (`settings`) - Billing settings (Coming Soon)

---

### 2. Customer Payment Portal
**Route:** `/billing/:customerId`  
**Component:** `frontend/src/components/billing/CustomerPaymentPortal.tsx`  
**Access:** Admin, Owner (requires `invoices:view` permission)

**Description:** Customer-facing payment portal where customers can view invoices, make payments, manage payment methods, and view payment history.

**URL Pattern:** `/billing/{customerId}`

**Example:**
- `/billing/123` - Payment portal for customer with ID 123
- `/billing/abc-def-456` - Payment portal for customer with ID abc-def-456

**Features Available:**
- View invoices
- Make payments
- View payment history
- Manage payment methods

---

## Customer Payment Portal Tabs

The Customer Payment Portal (`/billing/:customerId`) has 4 main tabs:

### Tab 1: Invoices
**Tab ID:** `invoices` (default)  
**Component:** `InvoiceList`  
**Features:**
- List of all invoices for the customer
- Filter by status (All, Pending, Paid, Overdue)
- Sort by date, amount, status
- Click invoice to view details
- "Pay Now" button for unpaid invoices

**New Components Used:**
- `InvoiceList` - Displays list of invoices
- `InvoiceDetail` - Shows detailed invoice information (modal)

---

### Tab 2: Make Payment
**Tab ID:** `payment`  
**Component:** `PaymentForm`  
**Features:**
- Payment form for selected invoice
- Select existing payment method or add new card
- Stripe Elements integration for secure card input
- Payment processing with retry mechanism
- Payment confirmation with receipt download

**New Components Used:**
- `PaymentForm` - Main payment processing form
- `PaymentConfirmation` - Payment success confirmation
- `PaymentMethodSelector` - Select existing payment method
- `SavedPaymentMethods` - Manage saved payment methods

**Flow:**
1. User selects invoice from Invoices tab
2. Clicks "Pay Now" button
3. Payment form opens (either in modal or tab)
4. User selects payment method or enters new card
5. Payment is processed
6. Payment confirmation is shown
7. Receipt can be downloaded

---

### Tab 3: Payment History
**Tab ID:** `history`  
**Component:** `CustomerPaymentHistory`  
**Features:**
- Complete payment history for the customer
- Filter by date range
- Sort by date, amount, invoice
- View payment details
- Export payment history

**New Components Used:**
- `CustomerPaymentHistory` - Displays payment history with filters

---

### Tab 4: Payment Methods
**Tab ID:** `payment-methods`  
**Component:** `PaymentMethodManager`  
**Features:**
- View saved payment methods
- Add new payment method
- Delete payment method
- Set default payment method
- Payment method validation

**New Components Used:**
- `PaymentMethodManager` - Manages payment methods
- `SavedPaymentMethods` - Displays and manages saved methods

---

## Component Hierarchy

```
/billing
├── Billing.tsx (Main dashboard)
│   ├── InvoiceManagement (Tab: invoices)
│   ├── ARManagement (Tab: ar)
│   ├── PaymentTracking (Tab: payments)
│   ├── OverdueAlerts (Tab: overdue)
│   └── PaymentAnalytics (Tab: analytics)
│
└── /billing/:customerId
    └── CustomerPaymentPortal
        ├── InvoiceList (Tab: invoices)
        │   └── InvoiceDetail (Modal)
        ├── PaymentForm (Tab: payment)
        │   ├── PaymentMethodSelector
        │   ├── SavedPaymentMethods
        │   └── PaymentConfirmation
        ├── CustomerPaymentHistory (Tab: history)
        └── PaymentMethodManager (Tab: payment-methods)
            └── SavedPaymentMethods
```

---

## Navigation Examples

### From Billing Dashboard to Customer Portal

```typescript
// Navigate to customer payment portal
navigate(`/billing/${customerId}`);

// Example:
navigate('/billing/123');
```

### From Customer Portal Back to Dashboard

```typescript
// Close customer portal and return to billing dashboard
onClose={() => navigate('/billing')}
```

### Direct Links

```html
<!-- Link to billing dashboard -->
<Link to="/billing">Billing</Link>

<!-- Link to customer payment portal -->
<Link to={`/billing/${customerId}`}>Customer Portal</Link>
```

---

## Route Configuration

### App.tsx Routes

```typescript
// Main billing route
<Route
  path="/billing"
  element={
    <PrivateRoute>
      <RoleProtectedRoute allowedRoles={['admin', 'owner']} requiredPermissions={['invoices:view']}>
        <V4Layout>
          <BillingPage />
        </V4Layout>
      </RoleProtectedRoute>
    </PrivateRoute>
  }
/>

// Customer payment portal route
<Route
  path="/billing/:customerId"
  element={
    <PrivateRoute>
      <RoleProtectedRoute allowedRoles={['admin', 'owner']} requiredPermissions={['invoices:view']}>
        <V4Layout>
          <BillingPage />
        </V4Layout>
      </RoleProtectedRoute>
    </PrivateRoute>
  }
/>
```

---

## Access Control

**Required Roles:**
- `admin`
- `owner`

**Required Permissions:**
- `invoices:view` - Required to access billing routes

**Route Protection:**
- All billing routes are protected by `PrivateRoute`
- Role-based access control via `RoleProtectedRoute`
- Permission-based access control for `invoices:view`

---

## Component Access Patterns

### InvoiceList Component
**Access:** Via `/billing/:customerId` → Invoices tab  
**Features:**
- View all invoices
- Filter and sort
- Click to view details
- Pay now button

### InvoiceDetail Component
**Access:** Via InvoiceList → Click invoice  
**Features:**
- Detailed invoice view
- Payment button
- Download invoice

### PaymentForm Component
**Access:** Via `/billing/:customerId` → Payment tab OR InvoiceList → Pay Now  
**Features:**
- Payment processing
- Stripe integration
- Payment method selection
- Retry mechanism

### PaymentConfirmation Component
**Access:** Via PaymentForm → After successful payment  
**Features:**
- Payment success message
- Transaction details
- Receipt download
- Copy transaction ID

### CustomerPaymentHistory Component
**Access:** Via `/billing/:customerId` → Payment History tab  
**Features:**
- Payment history list
- Date range filtering
- Export functionality

### PaymentMethodManager Component
**Access:** Via `/billing/:customerId` → Payment Methods tab  
**Features:**
- View saved methods
- Add new method
- Delete method
- Set default method

---

## URL Examples

### Billing Dashboard
```
https://app.verofield.com/billing
```

### Customer Payment Portal
```
https://app.verofield.com/billing/123
https://app.verofield.com/billing/abc-def-456
https://app.verofield.com/billing/customer-789
```

### With Tab Navigation (Internal State)
The Customer Payment Portal uses internal tab state, so tabs are not reflected in the URL. The active tab is managed by component state.

---

## Integration Points

### From Other Modules

**From Customer Management:**
```typescript
// Navigate to customer payment portal from customer page
navigate(`/billing/${customer.id}`);
```

**From Invoice Management:**
```typescript
// Navigate to customer payment portal for specific invoice
navigate(`/billing/${invoice.account_id}`);
```

**From Finance Module:**
```typescript
// Link to billing dashboard
<Link to="/billing">View Billing</Link>
```

---

## Testing Routes

### Manual Testing URLs

1. **Billing Dashboard:**
   - Navigate to: `http://localhost:3000/billing`
   - Should see billing dashboard with tabs

2. **Customer Payment Portal:**
   - Navigate to: `http://localhost:3000/billing/1`
   - Should see customer payment portal
   - Replace `1` with actual customer ID

3. **Tab Navigation:**
   - Click tabs in Customer Payment Portal
   - Verify components load correctly

---

## Summary

### Main Routes
- `/billing` - Billing dashboard
- `/billing/:customerId` - Customer payment portal

### New Components Accessible Via Routes
- `InvoiceList` - `/billing/:customerId` (Invoices tab)
- `InvoiceDetail` - Modal from InvoiceList
- `PaymentForm` - `/billing/:customerId` (Payment tab)
- `PaymentConfirmation` - Shown after successful payment
- `CustomerPaymentHistory` - `/billing/:customerId` (History tab)
- `PaymentMethodManager` - `/billing/:customerId` (Payment Methods tab)

### Access Requirements
- Role: `admin` or `owner`
- Permission: `invoices:view`

---

**Document Created:** 2025-11-16  
**Status:** Complete






