# Charts Dashboard Demo Guide

## Quick Start

### 1. Access the Dashboard
Navigate to the charts dashboard using one of these methods:

**Option A: Direct URL**
```
http://localhost:5173/charts
```

**Option B: Navigation Menu**
- Click on the "Analytics" item in the sidebar (📊 icon)
- This will take you to the full dashboard

**Option C: Test Page**
```
http://localhost:5173/charts-test
```
- This is a simplified test page to verify chart functionality

### 2. Dashboard Overview

The main dashboard (`/charts`) includes:

#### Top KPI Row
- **Monthly Revenue**: $128,430 (+8% vs previous)
- **Pipeline Value**: $420,100 (-4% vs previous)
- **New Customers**: 48 (+12% vs previous)
- **Retention Rate**: 92% (+1% vs previous)
- **Avg Time to Close**: 13 days (-2 days vs previous)
- **Quick Actions**: New Deal, New Ticket buttons

#### Main Content Area
**Left Column (Sales & Pipeline):**
- Revenue Trend (Area Chart)
- Deals by Sales Rep (Bar Chart)
- Sales Funnel (Funnel Chart)
- Support & Service Metrics (Combined Charts)

**Right Column:**
- Customer Health (Pie Chart + Metrics)
- Marketing Performance (Bar Chart + Metrics)
- Quick Drilldowns (Action Buttons)

### 3. Interactive Features

#### Filters
- **Date Range**: 7d, 30d, 90d, YTD
- **Team Filter**: All Teams, Sales, Support, Marketing
- **Export Options**: CSV, PDF, Excel

#### Chart Interactions
- **Tooltips**: Hover over chart elements for detailed data
- **Responsive**: Charts adapt to screen size
- **Animations**: Smooth transitions and loading effects

#### Quick Actions
- **Lost Deals Analysis**: Click to drill down
- **At-risk Customers**: View customer health issues
- **Export Detailed Report**: Download comprehensive data
- **Performance Comparison**: Compare metrics over time
- **Growth Opportunities**: Identify potential areas

### 4. Test Page Features

The test page (`/charts-test`) includes:

#### Basic Chart Examples
- **Line Chart**: Simple trend visualization
- **Bar Chart**: Basic data comparison
- **Pie Chart**: Distribution analysis
- **KPI Card**: Executive summary card

#### Test Results
- **Recharts**: Charts rendering correctly
- **Framer Motion**: Animations working
- **Responsive**: Layout adapting properly

### 5. Data Structure

The dashboard uses mock data that can be easily replaced with real API calls:

```typescript
// Example: Revenue trend data
revenueTrend: [
  { name: 'Week 1', revenue: 20000 },
  { name: 'Week 2', revenue: 25000 },
  { name: 'Week 3', revenue: 22000 },
  // ... more data points
]

// Example: Sales rep performance
dealsByRep: [
  { name: 'Alex Johnson', deals: 14, value: 85000 },
  { name: 'Sarah Wilson', deals: 12, value: 72000 },
  // ... more reps
]
```

### 6. Customization Examples

#### Adding a New Chart
```typescript
// Add this to the main content area
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.6 }}
>
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
</motion.div>
```

#### Modifying KPI Data
```typescript
// Update the mock data
const mockData = {
  kpis: {
    revenue: 150000, // New revenue value
    pipeline: 500000, // New pipeline value
    // ... other metrics
  }
  // ... rest of data
};
```

### 7. Responsive Behavior

#### Desktop (lg+)
- 3-column layout
- Full chart visibility
- Side-by-side comparisons

#### Tablet (md)
- 2-column layout
- Charts stack vertically
- Maintained readability

#### Mobile (sm)
- Single column stack
- Optimized for touch
- Simplified interactions

### 8. Performance Tips

#### For Large Datasets
- Use data sampling for trends
- Implement pagination for lists
- Cache chart data

#### For Real-time Updates
- Use WebSocket connections
- Implement incremental updates
- Add loading states

### 9. Troubleshooting

#### Charts Not Loading
1. Check browser console for errors
2. Verify Recharts is installed
3. Ensure data structure is correct

#### Animations Not Working
1. Check Framer Motion installation
2. Verify no CSS conflicts
3. Test on different browsers

#### Responsive Issues
1. Test on different screen sizes
2. Check Tailwind breakpoints
3. Verify container dimensions

### 10. Next Steps

#### Integration with Backend
1. Replace mock data with API calls
2. Add authentication headers
3. Implement error handling

#### Advanced Features
1. Add export functionality
2. Implement drill-down views
3. Add custom date ranges
4. Create saved dashboards

#### Mobile Optimization
1. Add touch gestures
2. Optimize chart interactions
3. Improve loading performance

## Support

For issues or questions:
1. Check the browser console for errors
2. Review the CHARTS_DASHBOARD.md documentation
3. Test with the simplified test page first
4. Verify all dependencies are installed

## Demo Data

The dashboard currently uses realistic mock data that represents:
- 8 weeks of revenue trends
- 5 sales representatives
- 5-stage sales funnel
- 4 customer segments
- 5 marketing lead sources
- Support ticket distribution

All data is configurable and can be easily replaced with real API endpoints.

