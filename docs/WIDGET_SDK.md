# Widget SDK Documentation

## Overview

The Widget SDK allows developers to create custom widgets that can be embedded in dashboard regions. All widgets run in a secure sandbox with strict isolation.

## Widget Manifest

Every widget must have a manifest that describes its capabilities:

```typescript
interface WidgetManifest {
  widget_id: string;        // Unique identifier (alphanumeric, hyphens, underscores)
  name: string;            // Display name
  version: string;         // Semantic version
  description?: string;     // Widget description
  author?: string;         // Widget author
  entry_point: string;     // URL to widget HTML/JS
  config_schema?: any;      // JSON Schema for configuration
  permissions?: string[];   // Required permissions
  pii_tags?: string[];     // PII data tags
  performance_budget?: number; // Max execution time (ms)
}
```

## Widget Lifecycle

### Initialization

1. Widget iframe loads `entry_point` URL
2. Widget sends `ready` message to parent
3. Parent sends `init` message with config
4. Widget initializes and renders

### Communication

Widgets communicate with the parent via postMessage:

```javascript
// Widget sends message to parent
window.parent.postMessage({
  type: 'ready',
  widgetId: 'my-widget-id'
}, '*');

// Widget receives message from parent
window.addEventListener('message', (event) => {
  if (event.data.type === 'init') {
    const config = event.data.payload.config;
    // Initialize widget with config
  }
  
  if (event.data.type === 'update') {
    const newConfig = event.data.payload.config;
    // Update widget with new config
  }
  
  if (event.data.type === 'destroy') {
    // Cleanup
  }
});
```

## Security

### Content Security Policy

Widgets run with strict CSP:
- `default-src 'self'`
- `script-src 'self' 'unsafe-inline'`
- `style-src 'self' 'unsafe-inline'`
- `frame-ancestors 'none'`
- `form-action 'none'`

### Best Practices

1. **Validate all inputs** - Never trust config data
2. **Sanitize outputs** - Prevent XSS
3. **Use HTTPS** - For all external resources
4. **Limit permissions** - Request only what you need
5. **Tag PII data** - Mark widgets that display personal information

## Widget Registration

### Registering a Widget

```typescript
const manifest: WidgetManifest = {
  widget_id: 'my-custom-widget',
  name: 'My Custom Widget',
  version: '1.0.0',
  entry_point: 'https://example.com/widget.html',
  config_schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      refreshInterval: { type: 'number' }
    },
    required: ['title']
  }
};

await enhancedApi.dashboardLayouts.registerWidget({
  manifest,
  is_public: false,
  allowed_tenants: []
});
```

### Approval Process

1. Submit widget manifest
2. Admin reviews and approves
3. Widget becomes available to approved tenants
4. Public widgets available to all

## Configuration Schema

Define your widget's configuration using JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Widget title"
    },
    "refreshInterval": {
      "type": "number",
      "minimum": 1000,
      "maximum": 60000,
      "default": 5000
    },
    "showLegend": {
      "type": "boolean",
      "default": true
    }
  },
  "required": ["title"]
}
```

## Performance

### Budget Monitoring

- Set `performance_budget` in manifest
- Widgets exceeding budget are logged
- Consider using Web Workers for heavy computations

### Optimization Tips

1. **Lazy load data** - Only fetch what's visible
2. **Debounce updates** - Limit refresh frequency
3. **Use virtual scrolling** - For long lists
4. **Cache responses** - Reduce API calls
5. **Minimize DOM updates** - Batch changes

## Example Widget

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Widget</title>
  <style>
    body { margin: 0; padding: 16px; font-family: sans-serif; }
  </style>
</head>
<body>
  <div id="widget-content">
    <h2 id="title">Loading...</h2>
    <div id="data"></div>
  </div>

  <script>
    let config = {};
    const widgetId = 'my-widget-id';

    // Send ready message
    window.parent.postMessage({
      type: 'ready',
      widgetId
    }, '*');

    // Listen for messages
    window.addEventListener('message', (event) => {
      if (event.data.widgetId !== widgetId) return;

      switch (event.data.type) {
        case 'init':
          config = event.data.payload.config;
          initialize();
          break;
        case 'update':
          config = event.data.payload.config;
          update();
          break;
        case 'destroy':
          cleanup();
          break;
      }
    });

    function initialize() {
      document.getElementById('title').textContent = config.title || 'My Widget';
      loadData();
    }

    function update() {
      // Handle config updates
      if (config.title) {
        document.getElementById('title').textContent = config.title;
      }
    }

    function loadData() {
      // Fetch and display data
      document.getElementById('data').textContent = 'Data loaded';
    }

    function cleanup() {
      // Cleanup resources
    }
  </script>
</body>
</html>
```

## Testing

### Local Development

1. Host widget on local server
2. Use `http://localhost:3000/widget.html` as entry_point
3. Register widget in development environment
4. Test in dashboard

### Validation

Widget manifests are validated:
- Required fields present
- Valid URL for entry_point
- Valid JSON Schema for config_schema
- Performance budget is positive number

## Troubleshooting

### Widget Not Loading

- Check entry_point URL is accessible
- Verify CSP allows your resources
- Check browser console for errors
- Ensure ready message is sent

### Config Not Updating

- Verify update message handler
- Check config schema matches
- Validate config values

### Performance Issues

- Monitor execution time
- Use performance budget
- Optimize data fetching
- Consider Web Workers

## Related Documentation

- [Architecture Overview](../DASHBOARD_REGIONS.md)
- [Security Guide](../security/WIDGET_SECURITY.md)





