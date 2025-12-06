# Work Orders Implementation

This document outlines the complete implementation of Work Orders functionality in the VeroField CRM application.

## Overview

The Work Orders module provides comprehensive work order management capabilities with full CRUD operations, multi-tenant support, and robust validation. It follows the existing codebase patterns and integrates seamlessly with the current architecture.

## Work Order → Job Workflow (Enterprise CRM Pattern)

The relationship between Work Orders and Jobs follows the standard enterprise CRM workflow pattern used by systems like ServiceTitan, Salesforce Field Service, and Jobber.

### Relationship Model

```
Customer (Account)
  └── Location
       └── Work Order (Requirement/Request)
            ├── assigned_to (technician) - responsible party
            ├── status (pending, in-progress, completed, canceled)
            └── Jobs[] (Scheduled Appointments/Executions)
                 ├── technician_id (scheduled technician)
                 ├── scheduled_date, scheduled_start_time, scheduled_end_time
                 ├── status (unassigned, scheduled, in_progress, completed)
                 └── actual_start_time, actual_end_time (execution tracking)
```

### Work Order Entity

**Purpose**: The requirement/request for work to be done
- Tracks: customer, location, description, assigned technician (responsible party)
- Status lifecycle: pending → in-progress → completed/canceled
- Can have multiple jobs (for recurring services, multiple locations, reschedules)

### Job Entity

**Purpose**: The scheduled appointment/execution of work
- Belongs to one work order (many-to-one relationship)
- Has specific scheduled date/time
- Assigned to specific technician for execution
- Tracks actual execution times (check-in/out via actual_start_time, actual_end_time)
- Appears on schedule/calendar
- Links to invoice for billing

### Workflow Steps

1. **Create Work Order** (requirement) → assign to technician
2. **Create Job from Work Order** (scheduled appointment) → appears on schedule
3. **Multiple jobs can be created** from one work order (recurring services, multiple locations, etc.)
4. **Job execution tracked** via actual_start_time/actual_end_time
5. **Job completion** → invoice generation (future enhancement)

### UI Flow

- Work Order Detail page includes "Create Job" button
- Job creation dialog pre-fills data from work order
- Job appears in "Related Jobs" section after creation
- Job appears on schedule/calendar for technician assignment

## Database Schema

### WorkOrder Model

The WorkOrder model has been enhanced with the following fields:

```prisma
model WorkOrder {

    
  id                String    @id @default(uuid()) @db.Uuid
  tenant_id         String    @db.Uuid
  customer_id       String    @db.Uuid
  assigned_to       String?   @db.Uuid
  status            String    @default("pending") @db.VarChar(20)
  priority          String    @default("medium") @db.VarChar(20)
  scheduled_date    DateTime? @db.Timestamptz(6)
  completion_date   DateTime? @db.Timestamptz(6)
  description       String    @db.Text
  notes             String?   @db.Text
  created_at        DateTime  @default(now()) @db.Timestamptz(6)
  updated_at        DateTime  @updatedAt @db.Timestamptz(6)
  
  // Legacy fields for backward compatibility
  account_id        String?   @db.Uuid
  location_id       String?   @db.Uuid
  service_type      String?   @db.VarChar(100)
  recurrence_rule   String?   @db.VarChar(255)
  estimated_duration Int?     @default(60)
  service_price     Decimal?  @db.Decimal(8, 2)
  special_instructions String? @db.Text
  
  jobs              Job[]
  account           Account   @relation(fields: [tenant_id, customer_id], references: [tenant_id, id])
  tenant            Tenant    @relation(fields: [tenant_id], references: [id], onDelete: Cascade)
  assignedTechnician User?    @relation("WorkOrderAssignedTo", fields: [assigned_to], references: [id])
  location          Location? @relation(fields: [tenant_id, location_id], references: [tenant_id, id])

  @@unique([tenant_id, id])
  @@index([tenant_id])
  @@index([customer_id])
  @@index([assigned_to])
  @@index([status])
  @@map("work_orders")
}
```

### Key Features

- **Multi-tenant support**: All work orders are scoped to tenants
- **Customer relationship**: Links to existing customer accounts
- **Technician assignment**: Optional assignment to technicians
- **Status tracking**: pending, in-progress, completed, canceled
- **Priority levels**: low, medium, high, urgent
- **Scheduling**: Flexible scheduled and completion dates
- **Audit trail**: Full audit logging for all operations
- **Backward compatibility**: Maintains existing fields for legacy support

## API Endpoints

### Base URL
```
/api/work-orders
```

### Endpoints

#### 1. Create Work Order
```http
POST /api/work-orders
```

**Request Body:**
```json
{
  "customer_id": "uuid",
  "assigned_to": "uuid", // optional
  "status": "pending", // optional, defaults to "pending"
  "priority": "medium", // optional, defaults to "medium"
  "scheduled_date": "2025-12-05T09:00:00Z", // optional
  "description": "Work order description",
  "notes": "Additional notes" // optional
}
```

#### 2. Get Work Order by ID
```http
GET /api/work-orders/:id
```

#### 3. List Work Orders
```http
GET /api/work-orders?status=pending&priority=high&assigned_to=uuid&customer_id=uuid&start_date=2025-12-05&end_date=2025-12-05&page=1&limit=20
```

**Query Parameters:**
- `status`: Filter by status (pending, in-progress, completed, canceled)
- `priority`: Filter by priority (low, medium, high, urgent)
- `assigned_to`: Filter by assigned technician ID
- `customer_id`: Filter by customer ID
- `start_date`: Filter by start date (YYYY-MM-DD)
- `end_date`: Filter by end date (YYYY-MM-DD)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

#### 4. Update Work Order
```http
PUT /api/work-orders/:id
```

**Request Body:**
```json
{
  "customer_id": "uuid", // optional
  "assigned_to": "uuid", // optional
  "status": "in-progress", // optional
  "priority": "high", // optional
  "scheduled_date": "2025-12-05T09:00:00Z", // optional
  "completion_date": "2025-12-05T17:00:00Z", // optional
  "description": "Updated description", // optional
  "notes": "Updated notes" // optional
}
```

#### 5. Delete Work Order (Soft Delete)
```http
DELETE /api/work-orders/:id
```

#### 6. Get Work Orders by Customer
```http
GET /api/work-orders/customer/:customerId
```

#### 7. Get Work Orders by Technician
```http
GET /api/work-orders/technician/:technicianId
```

## Validation Rules

### Create Work Order
- `customer_id`: Required, must be valid UUID and belong to tenant
- `assigned_to`: Optional, must be valid UUID and belong to tenant
- `status`: Optional, defaults to "pending"
- `priority`: Optional, defaults to "medium"
- `scheduled_date`: Optional, cannot be in the past
- `description`: Required, max 1000 characters
- `notes`: Optional, max 2000 characters

### Update Work Order
- All fields are optional for partial updates
- `scheduled_date`: Cannot be in the past
- `completion_date`: Can only be set when status is "completed"
- `customer_id`: Must be valid UUID and belong to tenant
- `assigned_to`: Must be valid UUID and belong to tenant

## Multi-Tenant Security

### Tenant Isolation
- All queries automatically filter by `tenant_id`
- Users can only access work orders from their own tenant
- Cross-tenant access is prevented at the service layer

### Authorization
- JWT authentication required for all endpoints
- Tenant context is extracted from JWT token
- User permissions are validated for each operation

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (cross-tenant access)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Audit Logging

All work order operations are logged with the following information:
- Tenant ID
- User ID (if available)
- Action (created, updated, deleted)
- Resource type (work_order)
- Resource ID
- Before and after states (for updates)
- Timestamp

## Testing

### Unit Tests
- Service layer tests for all CRUD operations
- Validation tests for all DTOs
- Error handling tests

### Integration Tests
- End-to-end API tests
- Database integration tests
- Multi-tenant isolation tests

### Test Coverage
- ✅ Create work order (valid + invalid payloads)
- ✅ Retrieve single work order (correct tenant only)
- ✅ List work orders with filters
- ✅ Update work order fields
- ✅ Delete work order (soft delete)
- ✅ Tenant isolation (cross-tenant access prevention)

## Usage Examples

### Creating a Work Order
```javascript
const response = await fetch('/api/work-orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    customer_id: 'customer-uuid',
    description: 'Emergency pest control needed',
    priority: 'urgent',
    scheduled_date: '2025-12-05T09:00:00Z'
  })
});
```

### Listing Work Orders with Filters
```javascript
const response = await fetch('/api/work-orders?status=pending&priority=high&page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Updating a Work Order
```javascript
const response = await fetch('/api/work-orders/work-order-uuid', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    status: 'in-progress',
    assigned_to: 'technician-uuid',
    notes: 'Work started on time'
  })
});
```

## Seed Data

A seed script is provided to populate the database with sample work orders:

```bash
node scripts/seed-work-orders.js
```

This creates various work orders with different statuses, priorities, and assignments for testing and demo purposes.

## Performance Considerations

### Database Indexes
- `tenant_id`: Primary filtering index
- `customer_id`: Customer-specific queries
- `assigned_to`: Technician-specific queries
- `status`: Status-based filtering

### Query Optimization
- Pagination support for large datasets
- Efficient joins with related entities
- Proper use of Prisma includes for data fetching

## Future Enhancements

### Planned Features
- Work order templates
- Recurring work orders
- Work order attachments
- Email notifications
- Mobile app integration
- Advanced reporting

### Scalability Considerations
- Database partitioning by tenant
- Caching layer for frequently accessed data
- Background job processing for notifications
- API rate limiting

## Troubleshooting

### Common Issues

1. **Validation Errors**
   - Check that all required fields are provided
   - Ensure UUIDs are valid and belong to the correct tenant
   - Verify scheduled dates are not in the past

2. **Permission Errors**
   - Ensure JWT token is valid and not expired
   - Check that user belongs to the correct tenant
   - Verify user has appropriate roles

3. **Database Errors**
   - Check database connection
   - Verify schema migrations are applied
   - Ensure proper indexes exist

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Support

For issues or questions regarding the Work Orders implementation:
1. Check the test files for usage examples
2. Review the API documentation in Swagger UI
3. Check the audit logs for operation history
4. Contact the development team for technical support
