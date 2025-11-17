---
title: Keyboard Shortcuts Reference
category: Reference
status: active
last_reviewed: 2025-11-11
owner: frontend_team
related:
  - docs/guides/development/best-practices.md
---

# Global Search Commands - Complete Reference Guide

**Date**: 2025-11-11  
**Purpose**: Complete reference for testing all global search commands

---

## 📋 **HOW TO USE THIS GUIDE**

1. **Copy the example commands** and paste them into the global search bar
2. **Test each command** to verify functionality
3. **Check the status** - ✅ Functional or ❌ Not Implemented
4. **Report any issues** with specific commands

---

## ✅ **FULLY FUNCTIONAL COMMANDS (28 Total)**

### 🏢 **CORE CUSTOMER MANAGEMENT**

#### 1. **Create Customer** ✅
- **Command**: `createCustomer`
- **Examples**:
  - "Create customer John Smith"
  - "Add new customer Jane Doe"
  - "Create customer ABC Company with phone 555-1234"
  - "Add customer Mike Johnson, email mike@example.com"

#### 2. **Delete Customer** ✅
- **Command**: `deleteCustomer`
- **Examples**:
  - "Delete customer John Smith"
  - "Remove customer Jane Doe"
  - "Delete customer ABC Company"
  - "Remove customer Mike Johnson"

#### 3. **Confirm Delete Customer** ✅
- **Command**: `confirmDeleteCustomer`
- **Examples**:
  - "Yes, delete John Smith"
  - "Confirm deletion of Jane Doe"
  - "Yes, remove ABC Company"
  - "Confirm delete Mike Johnson"

#### 4. **Update Customer** ✅
- **Command**: `updateCustomer`
- **Examples**:
  - "Update John Smith's phone to 555-1234"
  - "Change Jane Doe's email to jane@newemail.com"
  - "Update ABC Company's address to 123 Main St"
  - "Change Mike Johnson's phone number to 555-9876"

#### 5. **View Customer Details** ✅
- **Command**: `viewCustomerDetails`
- **Examples**:
  - "View customer John Smith details"
  - "Show customer Jane Doe information"
  - "Display customer ABC Company details"
  - "View customer Mike Johnson profile"

#### 6. **Customer History** ✅
- **Command**: `customerHistory`
- **Examples**:
  - "Show customer John Smith history"
  - "Display customer Jane Doe service history"
  - "View customer ABC Company history"
  - "Show customer Mike Johnson past services"

### 🔍 **SEARCH FUNCTIONALITY**

#### 7. **Search** ✅
- **Command**: `search`
- **Examples**:
  - "Find customers named John"
  - "Search for customers in New York"
  - "Find customer with phone 555-1234"
  - "Search for customers with email @gmail.com"
  - "Find customers in zip code 12345"

#### 8. **Advanced Search** ✅
- **Command**: `advancedSearch`
- **Examples**:
  - "Advanced search for customers in New York"
  - "Find customers with outstanding invoices"
  - "Search for customers with active service plans"
  - "Advanced search for customers created last month"

### 📅 **APPOINTMENT MANAGEMENT**

#### 9. **Schedule Appointment** ✅
- **Command**: `scheduleAppointment`
- **Examples**:
  - "Schedule appointment for John Smith tomorrow"
  - "Book appointment for Jane Doe next Tuesday at 2 PM"
  - "Schedule service for ABC Company on Friday"
  - "Book appointment for Mike Johnson next week"

#### 10. **Update Appointment** ✅
- **Command**: `updateAppointment`
- **Examples**:
  - "Reschedule John Smith's appointment to next week"
  - "Change Jane Doe's appointment to Tuesday at 3 PM"
  - "Update ABC Company's appointment to Friday"
  - "Reschedule Mike Johnson's appointment to next month"

#### 11. **Cancel Appointment** ✅
- **Command**: `cancelAppointment`
- **Examples**:
  - "Cancel John Smith's appointment"
  - "Cancel Jane Doe's appointment for Tuesday"
  - "Cancel ABC Company's appointment"
  - "Cancel Mike Johnson's appointment"

### 🔧 **JOB MANAGEMENT**

#### 12. **Start Job** ✅
- **Command**: `startJob`
- **Examples**:
  - "Start job for John Smith"
  - "Begin job for Jane Doe"
  - "Start service job for ABC Company"
  - "Begin work for Mike Johnson"

#### 13. **Complete Job** ✅
- **Command**: `completeJob`
- **Examples**:
  - "Complete job for John Smith"
  - "Finish job for Jane Doe"
  - "Complete service job for ABC Company"
  - "Finish work for Mike Johnson"

#### 14. **Pause Job** ✅
- **Command**: `pauseJob`
- **Examples**:
  - "Pause job for John Smith"
  - "Pause work for Jane Doe"
  - "Pause service job for ABC Company"
  - "Pause work for Mike Johnson"

#### 15. **Resume Job** ✅
- **Command**: `resumeJob`
- **Examples**:
  - "Resume job for John Smith"
  - "Resume work for Jane Doe"
  - "Resume service job for ABC Company"
  - "Resume work for Mike Johnson"

#### 16. **Job Status** ✅
- **Command**: `jobStatus`
- **Examples**:
  - "Check job status for John Smith"
  - "What's the status of Jane Doe's job?"
  - "Check service job status for ABC Company"
  - "What's the status of Mike Johnson's work?"

### 💰 **INVOICE & PAYMENT MANAGEMENT**

#### 17. **Create Invoice** ✅
- **Command**: `createInvoice`
- **Examples**:
  - "Create invoice for John Smith"
  - "Generate invoice for Jane Doe"
  - "Create invoice for ABC Company"
  - "Generate invoice for Mike Johnson"

#### 18. **Record Payment** ✅
- **Command**: `recordPayment`
- **Examples**:
  - "Record payment of $100 from John Smith"
  - "Record $250 payment from Jane Doe"
  - "Record payment of $500 from ABC Company"
  - "Record $150 payment from Mike Johnson"

#### 19. **Send Invoice** ✅
- **Command**: `sendInvoice`
- **Examples**:
  - "Send invoice to John Smith"
  - "Send invoice to Jane Doe"
  - "Send invoice to ABC Company"
  - "Send invoice to Mike Johnson"

#### 20. **Payment History** ✅
- **Command**: `paymentHistory`
- **Examples**:
  - "Show payment history for John Smith"
  - "Display payment history for Jane Doe"
  - "Show payment history for ABC Company"
  - "Display payment history for Mike Johnson"

#### 21. **Outstanding Invoices** ✅
- **Command**: `outstandingInvoices`
- **Examples**:
  - "Show outstanding invoices"
  - "Display unpaid invoices"
  - "Show invoices that need payment"
  - "Display outstanding bills"

#### 22. **Mark Invoice Paid** ✅
- **Command**: `markInvoicePaid`
- **Examples**:
  - "Mark invoice 12345 as paid"
  - "Mark invoice INV-001 as paid"
  - "Mark invoice 67890 as paid"
  - "Mark invoice INV-002 as paid"

### 🛠️ **SERVICE MANAGEMENT**

#### 23. **Add Note** ✅
- **Command**: `addNote`
- **Examples**:
  - "Add note to John Smith: Customer prefers morning appointments"
  - "Add note to Jane Doe: Customer has allergies to certain chemicals"
  - "Add note to ABC Company: Building access through side door"
  - "Add note to Mike Johnson: Customer prefers text notifications"

#### 24. **Assign Technician** ✅
- **Command**: `assignTechnician`
- **Examples**:
  - "Assign technician Mike to John Smith's job"
  - "Assign technician Sarah to Jane Doe's job"
  - "Assign technician Tom to ABC Company's job"
  - "Assign technician Lisa to Mike Johnson's job"

#### 25. **Send Reminder** ✅
- **Command**: `sendReminder`
- **Examples**:
  - "Send reminder to John Smith"
  - "Send appointment reminder to Jane Doe"
  - "Send reminder to ABC Company"
  - "Send service reminder to Mike Johnson"

#### 26. **Create Service Plan** ✅
- **Command**: `createServicePlan`
- **Examples**:
  - "Create service plan for John Smith"
  - "Create monthly service plan for Jane Doe"
  - "Create quarterly service plan for ABC Company"
  - "Create annual service plan for Mike Johnson"

### ⚙️ **SYSTEM COMMANDS**

#### 27. **Show Help** ✅
- **Command**: `showHelp`
- **Examples**:
  - "Show help"
  - "What commands are available?"
  - "Help me with commands"
  - "Show available commands"

#### 28. **Show Reports** ✅
- **Command**: `showReports`
- **Examples**:
  - "Show reports"
  - "Display analytics"
  - "Show dashboard"
  - "Display reports"

---

## ❌ **NOT YET IMPLEMENTED COMMANDS**

See full reference guide for complete list of 43 not-yet-implemented commands including:
- Technician Management
- Equipment Management
- Communication Features
- Management Features
- Reporting & Analytics
- Service Documentation
- User Management
- System Administration
- Advanced Analytics

---

## 🧪 **TESTING CHECKLIST**

### ✅ **Test These Commands First (Fully Functional)**
- [ ] Create customer
- [ ] Search for customers
- [ ] Update customer
- [ ] Delete customer
- [ ] Schedule appointment
- [ ] Start job
- [ ] Complete job
- [ ] Create invoice
- [ ] Record payment
- [ ] Add note
- [ ] Show help

---

**Last Updated:** 2025-11-11  
**Total Commands:** 71 (28 Functional, 43 Not Implemented)

