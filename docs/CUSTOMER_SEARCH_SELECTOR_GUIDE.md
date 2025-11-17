# CustomerSearchSelector Component Guide

## Overview
The `CustomerSearchSelector` is a reusable component designed for scalable customer selection in forms. It replaces dropdown menus with an intelligent search interface that can handle 1000+ customers efficiently.

## Features
- **Real-time Search**: Instant filtering as you type
- **Multiple Search Fields**: Searches name, email, phone, city, and account type
- **Performance Optimized**: Limits results to 20 items for fast rendering
- **Visual Customer Info**: Shows account type, contact info, and AR balance
- **Keyboard Navigation**: Full keyboard accessibility
- **Selected Customer Display**: Clear visual confirmation of selection
- **Error Handling**: Built-in validation and error display

## Usage

### Basic Implementation
```typescript
import { CustomerSearchSelector } from '@/components/ui';

<CustomerSearchSelector
  value={formData.customer_id}
  onChange={(customerId, customer) => {
    setFormData(prev => ({ ...prev, customer_id: customerId }));
    setSelectedCustomer(customer);
  }}
  placeholder="Search customers..."
  required={true}
/>
```

### With Error Handling
```typescript
<CustomerSearchSelector
  label="Select Customer"
  value={formData.customer_id}
  onChange={(customerId, customer) => {
    updateFormData('customer_id', customerId);
    setSelectedCustomer(customer);
  }}
  placeholder="Search customers by name, email, or phone..."
  error={errors.customer_id}
  required={true}
  className="mb-4"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Selected customer ID |
| `onChange` | `(customerId: string, customer: Account \| null) => void` | **Required** | Callback when selection changes |
| `placeholder` | `string` | `"Search customers..."` | Input placeholder text |
| `error` | `string` | `undefined` | Error message to display |
| `required` | `boolean` | `false` | Whether field is required |
| `className` | `string` | `''` | Additional CSS classes |
| `label` | `string` | `'Customer'` | Field label |

## Integration Examples

### Invoice Form
```typescript
// In InvoiceForm.tsx
<CustomerSearchSelector
  label="Customer"
  value={formData.account_id}
  onChange={(customerId, customer) => {
    updateFormData('account_id', customerId);
    setSelectedCustomer(customer);
  }}
  placeholder="Search customers by name, email, or phone..."
  error={errors.account_id}
  required={true}
/>
```

### Work Order Form
```typescript
// In WorkOrderForm.tsx
<CustomerSearchSelector
  label="Customer"
  value={formData.customer_id}
  onChange={(customerId, customer) => {
    updateFormData('customer_id', customerId);
    // Auto-populate customer address if needed
    if (customer?.address) {
      updateFormData('service_address', customer.address);
    }
  }}
  placeholder="Search customers..."
  error={errors.customer_id}
  required={true}
/>
```

### Agreement Form
```typescript
// In AgreementForm.tsx
<CustomerSearchSelector
  label="Customer Account"
  value={agreementData.account_id}
  onChange={(customerId, customer) => {
    setAgreementData(prev => ({ ...prev, account_id: customerId }));
    // Auto-populate customer details
    if (customer) {
      setCustomerInfo({
        name: customer.name,
        email: customer.email,
        account_type: customer.account_type
      });
    }
  }}
  placeholder="Search by customer name or account..."
  error={validationErrors.account_id}
  required={true}
/>
```

## Performance Features

### Search Optimization
- **Debounced Search**: Prevents excessive API calls
- **Result Limiting**: Shows max 20 results for fast rendering
- **Smart Filtering**: Searches multiple fields simultaneously
- **Memory Efficient**: Only loads customers once, filters in memory

### UX Features
- **Visual Feedback**: Shows customer type icons and status
- **Contact Preview**: Displays email and phone in results
- **AR Balance**: Shows outstanding balance for billing context
- **Clear Selection**: Easy way to clear and start over

## Styling & Theming

### Following VeroField Patterns
- **Purple Theme**: Uses established purple color scheme
- **Consistent Spacing**: Matches other form components
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Customization
```typescript
// Custom styling
<CustomerSearchSelector
  className="custom-customer-search"
  // ... other props
/>

// CSS customization
.custom-customer-search {
  /* Your custom styles */
}
```

## Migration from Dropdowns

### Before (Dropdown)
```typescript
<select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
  <option value="">Select customer</option>
  {customers.map(customer => (
    <option key={customer.id} value={customer.id}>
      {customer.name}
    </option>
  ))}
</select>
```

### After (Search Selector)
```typescript
<CustomerSearchSelector
  value={customerId}
  onChange={(id, customer) => setCustomerId(id)}
  placeholder="Search customers..."
  required={true}
/>
```

## Best Practices

### Form Integration
1. **Always handle both ID and customer object** in onChange callback
2. **Store selected customer** for additional form logic
3. **Use consistent error handling** with form validation
4. **Provide clear placeholders** that indicate search capability

### Performance
1. **Limit results display** to maintain fast rendering
2. **Use debounced search** for API-based implementations
3. **Cache customer data** to avoid repeated API calls
4. **Implement lazy loading** for very large datasets

### Accessibility
1. **Use proper labels** and required indicators
2. **Provide keyboard navigation** support
3. **Include ARIA attributes** for screen readers
4. **Ensure color contrast** meets WCAG standards

## Future Enhancements

### Planned Features
- **Recent Selections**: Show recently selected customers
- **Favorites**: Mark frequently used customers
- **Advanced Filters**: Filter by account type, status, etc.
- **Bulk Selection**: Multi-customer selection capability
- **API Integration**: Direct API search for very large datasets

---

**Use this component consistently across all forms that require customer selection to maintain a professional, scalable user experience.**
