---
title: VeroForge SDK Guide
category: Development
status: active
last_reviewed: 2025-11-16
owner: platform_engineering
related:
  - docs/planning/VEROFORGE_DEVELOPMENT_PLAN.md
  - docs/architecture/veroforge-marketplace.md
---

# VeroForge SDK Guide

**Status:** Strategic Initiative - Post-VeroAI  
**Last Updated:** 2025-11-16

---

## Overview

The VeroForge SDK (`@veroforge/sdk`) enables developers to:
- Create plugins for the marketplace
- Extend and customize generated applications
- Override template-generated code
- Add custom endpoints and components

---

## Installation

```bash
npm install @veroforge/sdk
```

```typescript
import { Plugin, PluginContext, extendTemplate, overrideTemplate } from '@veroforge/sdk';
```

---

## Plugin Development

### Basic Plugin Structure

```typescript
import { Plugin, PluginContext, PluginRequest, PluginResponse } from '@veroforge/sdk';

export class MyPlugin implements Plugin {
  name = 'my-plugin';
  version = '1.0.0';
  
  private context: PluginContext;
  
  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    // Initialize plugin
  }
  
  async execute(request: PluginRequest): Promise<PluginResponse> {
    // Handle plugin execution
    return {
      success: true,
      data: { result: 'plugin executed' }
    };
  }
  
  async cleanup?(): Promise<void> {
    // Cleanup resources
  }
}
```

### Plugin API

**Available Methods:**

```typescript
interface PluginAPI {
  // Data operations
  readData(entity: string, filters: Filter[]): Promise<Data[]>;
  writeData(entity: string, data: Data): Promise<Data>;
  
  // Workflow operations
  triggerWorkflow(workflowId: string, data: any): Promise<void>;
  
  // Logging
  logger: Logger;
  
  // Configuration
  config: PluginConfig;
}
```

### Plugin Example: Stripe Billing

```typescript
import { Plugin, PluginContext, PluginRequest, PluginResponse } from '@veroforge/sdk';
import Stripe from 'stripe';

export class StripeBillingPlugin implements Plugin {
  name = 'stripe-billing';
  version = '1.0.0';
  
  private context: PluginContext;
  private stripe: Stripe;
  
  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.stripe = new Stripe(context.config.stripeSecretKey);
  }
  
  async execute(request: PluginRequest): Promise<PluginResponse> {
    switch (request.action) {
      case 'create-subscription':
        const subscription = await this.stripe.subscriptions.create({
          customer: request.data.customerId,
          items: [{ price: request.data.priceId }]
        });
        return { success: true, data: subscription };
        
      case 'cancel-subscription':
        await this.stripe.subscriptions.cancel(request.data.subscriptionId);
        return { success: true, data: { cancelled: true } };
        
      default:
        return { success: false, error: 'Unknown action' };
    }
  }
}
```

---

## Template Extension

### Extending Templates

Extend template-generated code without modifying the template itself:

```typescript
import { extendTemplate } from '@veroforge/sdk';

extendTemplate('crud-master-detail', {
  api: {
    service: (baseService) => {
      // Add custom methods to service
      baseService.customSearch = async (query: string) => {
        // Custom search logic
        return await baseService.findAll({ where: { name: { contains: query } } });
      };
      
      return baseService;
    },
    controller: (baseController) => {
      // Add custom endpoints
      baseController.get('/custom-search', async (req, res) => {
        const results = await baseController.service.customSearch(req.query.q);
        res.json(results);
      });
      
      return baseController;
    }
  },
  ui: {
    list: (baseComponent) => {
      // Add custom UI elements
      return (props) => (
        <div>
          {baseComponent(props)}
          <CustomFilter />
        </div>
      );
    }
  }
});
```

### Extension Points

**API Extensions:**
- `service` - Extend service methods
- `controller` - Add custom endpoints
- `dto` - Add custom DTOs
- `module` - Add custom modules

**UI Extensions:**
- `list` - Extend list view
- `detail` - Extend detail view
- `form` - Extend form component
- `hooks` - Add custom hooks

**Mobile Extensions:**
- `screen` - Extend screen component
- `service` - Extend mobile service
- `model` - Extend data model

---

## Template Override

### Overriding Template Files

Completely replace template-generated code:

```typescript
import { overrideTemplate } from '@veroforge/sdk';

overrideTemplate('crud-master-detail', {
  'api/service.template.ts': `
    import { Injectable } from '@nestjs/common';
    
    @Injectable()
    export class {{EntityName}}Service {
      // Custom service implementation
      async findAll() {
        // Custom logic
      }
    }
  `,
  'ui/list.template.tsx': `
    export function {{EntityName}}List() {
      // Custom list component
      return <div>Custom List</div>;
    }
  `
});
```

---

## Custom Endpoints

### Adding Custom API Endpoints

```typescript
import { addCustomEndpoint } from '@veroforge/sdk';

addCustomEndpoint({
  method: 'POST',
  path: '/api/custom/endpoint',
  handler: async (req, res) => {
    // Custom endpoint logic
    res.json({ result: 'custom endpoint' });
  },
  middleware: [authMiddleware, validationMiddleware]
});
```

### Custom Endpoint with DTO

```typescript
import { addCustomEndpoint, createDTO } from '@veroforge/sdk';

const CustomRequestDTO = createDTO({
  name: { type: 'string', required: true },
  email: { type: 'string', required: true, format: 'email' }
});

addCustomEndpoint({
  method: 'POST',
  path: '/api/custom/endpoint',
  dto: CustomRequestDTO,
  handler: async (req, res) => {
    const { name, email } = req.body; // Validated
    // Process request
    res.json({ success: true });
  }
});
```

---

## Custom Components

### Adding Custom UI Components

```typescript
import { addCustomComponent } from '@veroforge/sdk';

addCustomComponent('CustomWidget', {
  component: (props) => (
    <div>
      <h3>Custom Widget</h3>
      {/* Custom component logic */}
    </div>
  ),
  props: {
    title: { type: 'string', default: 'Widget' },
    data: { type: 'array', required: true }
  }
});
```

### Using Custom Components in Templates

```typescript
// In template extension
extendTemplate('dashboard-builder', {
  ui: {
    widgets: (baseWidgets) => [
      ...baseWidgets,
      'CustomWidget' // Add custom widget to available widgets
    ]
  }
});
```

---

## Plugin Configuration

### Configuration Schema

```typescript
interface PluginConfig {
  // Plugin-specific configuration
  [key: string]: any;
}

// Access in plugin
const apiKey = this.context.config.apiKey;
const endpoint = this.context.config.endpoint;
```

### Configuration Example

```typescript
// Plugin manifest
{
  "id": "stripe-billing",
  "config": {
    "stripeSecretKey": {
      "type": "string",
      "required": true,
      "secret": true
    },
    "webhookEndpoint": {
      "type": "string",
      "default": "/api/webhooks/stripe"
    }
  }
}
```

---

## Error Handling

### Plugin Error Handling

```typescript
async execute(request: PluginRequest): Promise<PluginResponse> {
  try {
    // Plugin logic
    return { success: true, data: result };
  } catch (error) {
    this.context.logger.error('Plugin error', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}
```

### SDK Error Types

```typescript
class PluginError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

// Usage
throw new PluginError('Invalid request', 'INVALID_REQUEST', 400);
```

---

## Testing

### Plugin Testing

```typescript
import { createPluginContext } from '@veroforge/sdk/testing';

describe('MyPlugin', () => {
  let plugin: MyPlugin;
  let context: PluginContext;
  
  beforeEach(async () => {
    context = createPluginContext({
      config: { apiKey: 'test-key' },
      api: mockAPI
    });
    plugin = new MyPlugin();
    await plugin.initialize(context);
  });
  
  it('should execute successfully', async () => {
    const response = await plugin.execute({
      action: 'test',
      data: {}
    });
    
    expect(response.success).toBe(true);
  });
});
```

---

## Best Practices

### 1. Idempotency

Make plugin operations idempotent:

```typescript
async execute(request: PluginRequest): Promise<PluginResponse> {
  // Check if operation already completed
  const existing = await this.checkExisting(request.id);
  if (existing) {
    return { success: true, data: existing };
  }
  
  // Perform operation
  const result = await this.performOperation(request);
  return { success: true, data: result };
}
```

### 2. Resource Cleanup

Always clean up resources:

```typescript
async cleanup(): Promise<void> {
  // Close connections
  await this.database.close();
  await this.cache.close();
}
```

### 3. Logging

Use context logger:

```typescript
this.context.logger.info('Plugin initialized');
this.context.logger.error('Error occurred', error);
this.context.logger.debug('Debug information', data);
```

### 4. Configuration Validation

Validate configuration on initialization:

```typescript
async initialize(context: PluginContext): Promise<void> {
  if (!context.config.apiKey) {
    throw new Error('API key required');
  }
  // Initialize
}
```

---

## Publishing Plugins

### Plugin Package Structure

```
my-plugin/
├── src/
│   └── index.ts
├── package.json
├── manifest.json
└── README.md
```

### Plugin Manifest

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": "Developer Name",
  "category": "integration",
  "pricing": {
    "model": "subscription",
    "price": 9.99
  },
  "apiSurface": [
    "readData",
    "writeData"
  ],
  "permissions": [
    "data.read",
    "data.write"
  ]
}
```

### Publishing Process

1. Develop plugin locally
2. Test with plugin simulator
3. Submit to marketplace
4. Security scan
5. Manual review (if needed)
6. Approval and publication

---

## Related Documentation

- [VeroForge Development Plan](../../planning/VEROFORGE_DEVELOPMENT_PLAN.md)
- [Marketplace Architecture](../../architecture/veroforge-marketplace.md)
- [Template System](../../planning/VEROFORGE_TEMPLATE_SYSTEM.md)

---

**Last Updated:** 2025-11-16  
**Status:** Planning - Awaiting VeroAI Completion  
**Owner:** Platform Engineering Team

