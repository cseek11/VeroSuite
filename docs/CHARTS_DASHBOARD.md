# Charts & Graphs Dashboard

## Overview

A comprehensive analytics dashboard built with React, TailwindCSS, and Recharts that provides executives and teams with clear, actionable insights into sales, customer engagement, support, and marketing performance.

## Features

### 🎯 Core Functionality
- **Executive KPI Dashboard** - Top-level metrics with delta indicators
- **Sales & Pipeline Analytics** - Revenue trends, deal performance, and funnel visualization
- **Support & Service Metrics** - Ticket resolution times and status distribution
- **Customer Health Monitoring** - Segmentation analysis and risk assessment
- **Marketing Performance** - Lead source analysis and campaign ROI
- **Quick Drilldown Actions** - Direct access to detailed reports and analysis

### 📊 Chart Types
- **Area Charts** - Revenue trends over time
- **Bar Charts** - Sales rep performance and lead sources
- **Pie Charts** - Customer segments and ticket status
- **Line Charts** - Resolution time trends
- **Funnel Charts** - Sales pipeline visualization
- **KPI Cards** - Executive summary metrics

### 🎨 Design Features
- **Responsive Layout** - Adapts from desktop (3-column) to mobile stack
- **Smooth Animations** - Framer Motion powered transitions
- **Consistent Branding** - Unified color scheme and styling
- **Accessibility** - High contrast, readable labels, semantic markup
- **Interactive Elements** - Tooltips, hover states, and drilldown capabilities

## Routes

### Main Dashboard
- **URL**: `/charts`
- **Description**: Full-featured analytics dashboard with all charts and metrics

### Test Page
- **URL**: `/charts-test`
- **Description**: Simple test page to verify chart functionality

## Data Structure

The dashboard uses a comprehensive mock data structure that can be easily replaced with API calls:

```typescript
interface DashboardData {
  kpis: {
    revenue: number;
    pipeline: number;
    newCustomers: number;
    retention: number;
    avgCloseDays: number;
    deltas: {
      revenue: number;
      pipeline: number;
      newCustomers: number;
      retention: number;
    };
  };
  sales: {
    revenueTrend: Array<{ name: string; revenue: number }>;
    dealsByRep: Array<{ name: string; deals: number; value: number }>;
    funnel: Array<{ stage: string; value: number; color: string }>;
  };
  support: {
    tickets: Array<{ name: string; value: number; color: string }>;
    resolutionTrend: Array<{ name: string; avg: number }>;
    topIssues: Array<{ issue: string; count: number; priority: string }>;
  };
  customers: {
    segments: Array<{ name: string; value: number; color: string }>;
    nps: number;
    atRisk: number;
  };
  marketing: {
    leadSources: Array<{ name: string; value: number; color: string }>;
    topCampaign: { name: string; roas: number };
    cpa: number;
  };
}
```

## Components

### Main Components

#### ChartsPage
- **Location**: `frontend/src/routes/Charts.tsx`
- **Purpose**: Main dashboard component with all charts and metrics
- **Features**:
  - Header with filters (date range, team, export)
  - Top KPI row with delta indicators
  - Main content grid with charts
  - Responsive layout

#### ChartsTestPage
- **Location**: `frontend/src/routes/ChartsTest.tsx`
- **Purpose**: Simple test page for chart functionality
- **Features**:
  - Basic chart examples
  - KPI card demonstration
  - Test results display

### Chart Components

#### Revenue Trend Chart
- **Type**: Area Chart
- **Data**: Weekly revenue data
- **Features**: Smooth area fill, tooltips, responsive

#### Sales Rep Performance
- **Type**: Bar Chart
- **Data**: Deals and values by sales representative
- **Features**: Dual metrics, angled labels, color coding

#### Sales Funnel
- **Type**: Funnel Chart
- **Data**: Pipeline stages from leads to closed won
- **Features**: Stage progression, color coding, animations

#### Support Metrics
- **Type**: Combined Line and Pie Charts
- **Data**: Resolution times and ticket status
- **Features**: Dual visualization, trend analysis

#### Customer Segments
- **Type**: Pie Chart
- **Data**: Customer distribution by segment
- **Features**: Donut style, tooltips, color coding

#### Lead Sources
- **Type**: Horizontal Bar Chart
- **Data**: Marketing lead sources
- **Features**: Horizontal layout, source comparison

## Styling

### Color Scheme
```typescript
const COLORS = {
  primary: '#3B82F6',    // Blue
  success: '#10B981',    // Green
  warning: '#F59E0B',    // Orange
  danger: '#EF4444',     // Red
  purple: '#8B5CF6',     // Purple
  gray: '#6B7280'        // Gray
};
```

### Responsive Breakpoints
- **Desktop**: 3-column layout (lg:grid-cols-3)
- **Tablet**: 2-column layout (md:grid-cols-2)
- **Mobile**: Single column stack

### Animation Timing
- **Header**: 0ms delay
- **KPI Row**: 100ms delay
- **Left Column**: 200-500ms delay
- **Right Column**: 200-400ms delay

## Usage

### Basic Usage
```typescript
import ChartsPage from '@/routes/Charts';

// Navigate to dashboard
window.location.href = '/charts';
```

### Customization
```typescript
// Modify mock data for different scenarios
const customData = {
  kpis: {
    revenue: 150000,
    // ... other metrics
  }
  // ... other data sections
};
```

### Adding New Charts
```typescript
// Example: Add a new line chart
<Card title="New Metric" className="h-80">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={newData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="name" stroke="#6B7280" />
      <YAxis stroke="#6B7280" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke={COLORS.primary}
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
</Card>
```

## Dependencies

### Required Packages
- **recharts**: Chart library for React
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **tailwindcss**: CSS framework

### Internal Dependencies
- **@/components/ui/EnhancedUI**: Card, Typography, Button components
- **@/components/ui/Select**: Dropdown component
- **@/components/ui/CRMComponents**: Badge component

## Performance Considerations

### Optimization Tips
1. **Lazy Loading**: Charts are loaded on demand
2. **Responsive Containers**: Charts adapt to container size
3. **Animation Throttling**: Staggered animations prevent performance issues
4. **Data Caching**: Mock data can be replaced with cached API responses

### Memory Management
- Charts are unmounted when not visible
- Responsive containers handle resize events efficiently
- Animation cleanup on component unmount

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live data
- **Export Functionality**: PDF, Excel, CSV export
- **Drill-down Capabilities**: Click-through to detailed views
- **Custom Dashboards**: User-configurable layouts
- **Data Filtering**: Advanced filtering and date range selection
- **Mobile Optimization**: Touch-friendly interactions

### API Integration
- **Backend Endpoints**: Replace mock data with real API calls
- **Authentication**: Secure data access
- **Caching**: Redis or similar for performance
- **Real-time Sync**: WebSocket for live updates

## Troubleshooting

### Common Issues

#### Charts Not Rendering
- Check if Recharts is properly installed
- Verify data structure matches expected format
- Ensure ResponsiveContainer has proper dimensions

#### Animation Issues
- Verify Framer Motion is installed
- Check for conflicting CSS animations
- Ensure proper cleanup on unmount

#### Responsive Issues
- Test on different screen sizes
- Verify Tailwind breakpoints are working
- Check container dimensions

### Debug Mode
Enable debug logging by adding console.log statements:
```typescript
console.log('Chart data:', mockData);
console.log('Chart dimensions:', containerRef.current?.getBoundingClientRect());
```

## Contributing

### Development Guidelines
1. Follow existing code patterns
2. Use TypeScript for type safety
3. Maintain responsive design
4. Add proper error handling
5. Include accessibility features
6. Test on multiple devices

### Code Style
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow Tailwind CSS conventions
- Use consistent naming patterns

## License

This dashboard is part of the VeroField CRM system and follows the same licensing terms.

