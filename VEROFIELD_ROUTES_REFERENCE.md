# VeroField System - Routes & Links Reference

**Project**: VeroField Pest Control Management System  
**Purpose**: Complete reference of all routes, pages, and navigation links for testing and development  
**Last Updated**: January 2025

---

## 📋 **Table of Contents**

1. [Authentication Routes](#authentication-routes)
2. [Main Dashboard Routes](#main-dashboard-routes)
3. [Customer Management Routes](#customer-management-routes)
4. [Work Order Management Routes](#work-order-management-routes)
5. [Job Scheduling Routes](#job-scheduling-routes)
6. [Technician Management Routes](#technician-management-routes)
7. [Service Management Routes](#service-management-routes)
8. [Agreement Management Routes](#agreement-management-routes)
9. [Billing & Invoicing Routes](#billing--invoicing-routes)
10. [Reporting & Analytics Routes](#reporting--analytics-routes)
11. [Settings & Configuration Routes](#settings--configuration-routes)
12. [Mobile Routes](#mobile-routes)
13. [API Endpoints](#api-endpoints)

---

## 🔐 **Authentication Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/login` | User login page | ✅ Active | `LoginPage.tsx` |
| `/register` | User registration page | ✅ Active | `RegisterPage.tsx` |
| `/forgot-password` | Password reset request | ✅ Active | `ForgotPasswordPage.tsx` |
| `/reset-password` | Password reset form | ✅ Active | `ResetPasswordPage.tsx` |
| `/logout` | User logout (redirect) | ✅ Active | Logout handler |

---

## 🏠 **Main Dashboard Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/` | Main dashboard/home | ✅ Active | `DashboardPage.tsx` |
| `/dashboard` | Dashboard overview | ✅ Active | `DashboardPage.tsx` |
| `/dashboard/overview` | Dashboard overview tab | ✅ Active | `DashboardOverview.tsx` |
| `/dashboard/analytics` | Dashboard analytics tab | ✅ Active | `DashboardAnalytics.tsx` |
| `/dashboard/notifications` | Dashboard notifications | ✅ Active | `DashboardNotifications.tsx` |

---

## 👥 **Customer Management Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/customers` | Customer list view | ✅ Active | `CustomersPage.tsx` |
| `/customers/new` | Create new customer | ✅ Active | `CreateCustomerPage.tsx` |
| `/customers/:id` | Customer detail view | ✅ Active | `CustomerDetailPage.tsx` |
| `/customers/:id/edit` | Edit customer | ✅ Active | `EditCustomerPage.tsx` |
| `/customers/:id/history` | Customer service history | ✅ Active | `CustomerHistoryPage.tsx` |
| `/customers/:id/agreements` | Customer agreements | ✅ Active | `CustomerAgreementsPage.tsx` |
| `/customers/:id/billing` | Customer billing info | ✅ Active | `CustomerBillingPage.tsx` |
| `/customers/import` | Bulk customer import | ✅ Active | `CustomerImportPage.tsx` |
| `/customers/export` | Customer data export | ✅ Active | `CustomerExportPage.tsx` |

---

## 📋 **Work Order Management Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/work-orders` | Work orders list | ✅ Active | `WorkOrdersPage.tsx` |
| `/work-orders/new` | Create work order | ✅ Active | `CreateWorkOrderPage.tsx` |
| `/work-orders/:id` | Work order detail | ✅ Active | `WorkOrderDetailPage.tsx` |
| `/work-orders/:id/edit` | Edit work order | ✅ Active | `EditWorkOrderPage.tsx` |
| `/work-orders/:id/assign` | Assign technician | ✅ Active | `WorkOrderAssignmentPage.tsx` |
| `/work-orders/:id/schedule` | Schedule work order | ✅ Active | `WorkOrderSchedulingPage.tsx` |
| `/work-orders/:id/status` | Change work order status | ✅ Active | `WorkOrderStatusPage.tsx` |
| `/work-orders/bulk` | Bulk work order operations | ✅ Active | `BulkWorkOrdersPage.tsx` |
| `/work-orders/templates` | Work order templates | ✅ Active | `WorkOrderTemplatesPage.tsx` |

---

## 📅 **Job Scheduling Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/jobs` | Job scheduler main | ✅ Active | `JobSchedulerPage.tsx` |
| `/jobs/calendar` | Calendar view | ✅ Active | `JobCalendarPage.tsx` |
| `/jobs/week` | Weekly view | ✅ Active | `JobWeekViewPage.tsx` |
| `/jobs/day` | Daily view | ✅ Active | `JobDayViewPage.tsx` |
| `/jobs/:id` | Job detail | ✅ Active | `JobDetailPage.tsx` |
| `/jobs/:id/edit` | Edit job | ✅ Active | `EditJobPage.tsx` |
| `/jobs/assign` | Job assignment | ✅ Active | `JobAssignmentPage.tsx` |
| `/jobs/conflicts` | Schedule conflicts | ✅ Active | `JobConflictsPage.tsx` |
| `/jobs/optimization` | Route optimization | ✅ Active | `JobOptimizationPage.tsx` |

---

## 👨‍🔧 **Technician Management Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/technicians` | Technician management | ✅ Active | `TechnicianManagementPage.tsx` |
| `/technicians/list` | Technician list | ✅ Active | `TechnicianList.tsx` |
| `/technicians/dashboard` | Performance dashboard | ✅ Active | `TechnicianDashboard.tsx` |
| `/technicians/calendar` | Availability calendar | ✅ Active | `TechnicianAvailabilityCalendar.tsx` |
| `/technicians/assignment` | Assignment interface | ✅ Active | `TechnicianAssignmentInterface.tsx` |
| `/technicians/new` | Add technician | ✅ Active | `CreateTechnicianPage.tsx` |
| `/technicians/:id` | Technician profile | ✅ Active | `TechnicianDetailPage.tsx` |
| `/technicians/:id/edit` | Edit technician | ✅ Active | `EditTechnicianPage.tsx` |
| `/technicians/:id/schedule` | Technician schedule | ✅ Active | `TechnicianSchedulePage.tsx` |
| `/technicians/:id/performance` | Performance metrics | ✅ Active | `TechnicianPerformancePage.tsx` |
| `/technicians/:id/jobs` | Technician jobs | ✅ Active | `TechnicianJobsPage.tsx` |
| `/technicians/:id/training` | Training records | ✅ Active | `TechnicianTrainingPage.tsx` |

---

## 🛠️ **Service Management Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/services` | Service catalog | ✅ Active | `ServicesPage.tsx` |
| `/services/new` | Create service | ✅ Active | `CreateServicePage.tsx` |
| `/services/:id` | Service detail | ✅ Active | `ServiceDetailPage.tsx` |
| `/services/:id/edit` | Edit service | ✅ Active | `EditServicePage.tsx` |
| `/services/categories` | Service categories | ✅ Active | `ServiceCategoriesPage.tsx` |
| `/services/pricing` | Service pricing | ✅ Active | `ServicePricingPage.tsx` |
| `/services/templates` | Service templates | ✅ Active | `ServiceTemplatesPage.tsx` |

---

## 📄 **Agreement Management Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/agreements` | Agreements list | 🚧 In Development | `AgreementsPage.tsx` |
| `/agreements/new` | Create agreement | 🚧 In Development | `CreateAgreementPage.tsx` |
| `/agreements/:id` | Agreement detail | 🚧 In Development | `AgreementDetailPage.tsx` |
| `/agreements/:id/edit` | Edit agreement | 🚧 In Development | `EditAgreementPage.tsx` |
| `/agreements/templates` | Agreement templates | 🚧 In Development | `AgreementTemplatesPage.tsx` |
| `/agreements/renewals` | Renewal management | 🚧 In Development | `AgreementRenewalsPage.tsx` |
| `/agreements/signatures` | Digital signatures | 🚧 In Development | `AgreementSignaturesPage.tsx` |

---

## 💰 **Billing & Invoicing Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/billing` | Billing overview | 🚧 In Development | `BillingPage.tsx` |
| `/billing/invoices` | Invoice list | 🚧 In Development | `InvoicesPage.tsx` |
| `/billing/invoices/new` | Create invoice | 🚧 In Development | `CreateInvoicePage.tsx` |
| `/billing/invoices/:id` | Invoice detail | 🚧 In Development | `InvoiceDetailPage.tsx` |
| `/billing/invoices/:id/edit` | Edit invoice | 🚧 In Development | `EditInvoicePage.tsx` |
| `/billing/payments` | Payment tracking | 🚧 In Development | `PaymentsPage.tsx` |
| `/billing/overdue` | Overdue accounts | 🚧 In Development | `OverdueAccountsPage.tsx` |
| `/billing/reports` | Financial reports | 🚧 In Development | `BillingReportsPage.tsx` |

---

## 📊 **Reporting & Analytics Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/reports` | Reports dashboard | 🚧 In Development | `ReportsPage.tsx` |
| `/reports/performance` | Performance reports | 🚧 In Development | `PerformanceReportsPage.tsx` |
| `/reports/financial` | Financial reports | 🚧 In Development | `FinancialReportsPage.tsx` |
| `/reports/customer` | Customer reports | 🚧 In Development | `CustomerReportsPage.tsx` |
| `/reports/technician` | Technician reports | 🚧 In Development | `TechnicianReportsPage.tsx` |
| `/reports/analytics` | Business analytics | 🚧 In Development | `AnalyticsPage.tsx` |
| `/reports/export` | Export reports | 🚧 In Development | `ReportExportPage.tsx` |

---

## ⚙️ **Settings & Configuration Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/settings` | Settings overview | ✅ Active | `SettingsPage.tsx` |
| `/settings/profile` | User profile | ✅ Active | `ProfileSettingsPage.tsx` |
| `/settings/company` | Company settings | ✅ Active | `CompanySettingsPage.tsx` |
| `/settings/users` | User management | ✅ Active | `UserManagementPage.tsx` |
| `/settings/permissions` | Permission management | ✅ Active | `PermissionSettingsPage.tsx` |
| `/settings/integrations` | Third-party integrations | ✅ Active | `IntegrationSettingsPage.tsx` |
| `/settings/notifications` | Notification settings | ✅ Active | `NotificationSettingsPage.tsx` |
| `/settings/backup` | Backup & restore | ✅ Active | `BackupSettingsPage.tsx` |

---

## 📱 **Mobile Routes**

| Route | Description | Status | Components |
|-------|-------------|--------|------------|
| `/mobile` | Mobile dashboard | 🚧 In Development | `MobileDashboardPage.tsx` |
| `/mobile/jobs` | Mobile job list | 🚧 In Development | `MobileJobsPage.tsx` |
| `/mobile/jobs/:id` | Mobile job detail | 🚧 In Development | `MobileJobDetailPage.tsx` |
| `/mobile/customers` | Mobile customer list | 🚧 In Development | `MobileCustomersPage.tsx` |
| `/mobile/customers/:id` | Mobile customer detail | 🚧 In Development | `MobileCustomerDetailPage.tsx` |
| `/mobile/checkin` | Job check-in | 🚧 In Development | `MobileCheckinPage.tsx` |
| `/mobile/checkout` | Job check-out | 🚧 In Development | `MobileCheckoutPage.tsx` |
| `/mobile/offline` | Offline mode | 🚧 In Development | `MobileOfflinePage.tsx` |

---

## 🔌 **API Endpoints**

### **Authentication API**
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/auth/login` | POST | User login | ✅ Active |
| `/api/auth/register` | POST | User registration | ✅ Active |
| `/api/auth/refresh` | POST | Refresh token | ✅ Active |
| `/api/auth/logout` | POST | User logout | ✅ Active |

### **Customer API**
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/v1/crm/accounts` | GET | List customers | ✅ Active |
| `/api/v1/crm/accounts` | POST | Create customer | ✅ Active |
| `/api/v1/crm/accounts/:id` | GET | Get customer | ✅ Active |
| `/api/v1/crm/accounts/:id` | PUT | Update customer | ✅ Active |
| `/api/v1/crm/accounts/:id` | DELETE | Delete customer | ✅ Active |

### **Work Orders API**
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/v1/work-orders` | GET | List work orders | ✅ Active |
| `/api/v1/work-orders` | POST | Create work order | ✅ Active |
| `/api/v1/work-orders/:id` | GET | Get work order | ✅ Active |
| `/api/v1/work-orders/:id` | PUT | Update work order | ✅ Active |
| `/api/v1/work-orders/:id` | DELETE | Delete work order | ✅ Active |
| `/api/v1/work-orders/:id/status` | PUT | Update status | ✅ Active |
| `/api/v1/work-orders/:id/assign` | PUT | Assign technician | ✅ Active |

### **Jobs API**
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/v1/jobs` | GET | List jobs | ✅ Active |
| `/api/v1/jobs` | POST | Create job | ✅ Active |
| `/api/v1/jobs/:id` | GET | Get job | ✅ Active |
| `/api/v1/jobs/:id` | PUT | Update job | ✅ Active |
| `/api/v1/jobs/:id` | DELETE | Delete job | ✅ Active |
| `/api/v1/jobs/technician/:id` | GET | Get technician jobs | ✅ Active |

### **Technicians API**
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/v1/technicians` | GET | List technicians | ✅ Active |
| `/api/v1/technicians` | POST | Create technician | ✅ Active |
| `/api/v1/technicians/:id` | GET | Get technician | ✅ Active |
| `/api/v1/technicians/:id` | PUT | Update technician | ✅ Active |
| `/api/v1/technicians/:id` | DELETE | Delete technician | ✅ Active |

### **Search API**
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/v1/search/global` | GET | Global search | ✅ Active |
| `/api/v1/search/customers` | GET | Customer search | ✅ Active |
| `/api/v1/search/work-orders` | GET | Work order search | ✅ Active |
| `/api/v1/search/jobs` | GET | Job search | ✅ Active |

---

## 🧪 **Testing Quick Links**

### **Core Functionality Testing**
```
✅ Authentication: /login
✅ Dashboard: /dashboard
✅ Customers: /customers
✅ Work Orders: /work-orders
✅ Job Scheduling: /jobs
✅ Technician Management: /technicians
```

### **Advanced Features Testing**
```
✅ Work Order Creation: /work-orders/new
✅ Work Order Detail: /work-orders/[id]
✅ Job Calendar: /jobs/calendar
✅ Technician Assignment: /technicians/assignment
✅ Performance Dashboard: /technicians/dashboard
```

### **API Testing Endpoints**
```
✅ Customer API: /api/v1/crm/accounts
✅ Work Orders API: /api/v1/work-orders
✅ Jobs API: /api/v1/jobs
✅ Technicians API: /api/v1/technicians
✅ Global Search: /api/v1/search/global
```

---

## 📝 **Development Notes**

### **Completed Features (✅)**
- Complete Work Order Management System
- Advanced Job Scheduling Interface
- Comprehensive Technician Management
- Customer Management System
- Authentication & Authorization
- Global Search System
- Real-time Updates
- Mobile-responsive Design

### **In Development (🚧)**
- Agreement Management System
- Billing & Invoicing System
- Mobile Technician Interface
- Route Optimization
- Advanced Reporting
- Communication Hub

### **Planned Features (📋)**
- Advanced Analytics Dashboard
- Third-party Integrations
- Offline Mobile Support
- Automated Workflows
- AI-powered Insights

---

## 🔧 **Quick Navigation Commands**

### **For Testing**
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### **For Development**
```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run type checking
npm run type-check
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Active Development

---

*This document is automatically updated as new routes and features are added to the VeroField system.*






