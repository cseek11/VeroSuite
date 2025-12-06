---
title: VeroForge Template System Design
category: Planning
status: active
last_reviewed: 2025-12-05
owner: platform_engineering
related:
  - docs/planning/VEROFORGE_DEVELOPMENT_PLAN.md
  - docs/architecture/veroforge-generator-pipeline.md
---

# VeroForge Template System Design

**Status:** Strategic Initiative - Post-VeroAI  
**Last Updated:** 2025-12-05

---

## Overview

The VeroForge Template System provides 80% of code generation through stable, tested templates. Templates are versioned, composable, and can be extended or overridden by customers using the SDK.

---

## Template Structure

### Directory Layout

```
apps/forge-generator/src/templates/
├── <template-id>/
│   ├── manifest.json              # Template metadata
│   ├── api/                       # API template code
│   │   ├── controller.template.ts
│   │   ├── service.template.ts
│   │   ├── dto.template.ts
│   │   └── module.template.ts
│   ├── ui/                        # UI template code
│   │   ├── list.template.tsx
│   │   ├── detail.template.tsx
│   │   ├── form.template.tsx
│   │   └── hooks.template.ts
│   ├── mobile/                    # Mobile template code
│   │   ├── screen.template.tsx
│   │   ├── service.template.ts
│   │   └── model.template.ts
│   ├── prisma/                    # Database template
│   │   └── model.template.prisma
│   ├── tests/                     # Test templates
│   │   ├── service.spec.template.ts
│   │   └── component.spec.template.tsx
│   └── devops/                    # DevOps templates
│       ├── dockerfile.template
│       └── k8s.template.yaml
```

---

## Template Manifest

### Manifest Schema

```json
{
  "id": "crud-master-detail",
  "name": "CRUD Master-Detail",
  "version": "1.0.0",
  "description": "Full CRUD operations with master-detail relationship",
  "category": "core",
  "author": "VeroForge",
  "created": "2025-12-05",
  "updated": "2025-12-05",
  "entities": {
    "required": ["Entity"],
    "optional": ["DetailEntity"]
  },
  "relationships": {
    "supported": ["1:1", "1:N", "N:N"]
  },
  "features": [
    "list",
    "create",
    "update",
    "delete",
    "detail",
    "search",
    "filter",
    "pagination"
  ],
  "compliance": ["GDPR", "HIPAA"],
  "dependencies": [],
  "variables": {
    "entityName": {
      "type": "string",
      "required": true,
      "description": "Name of the primary entity"
    },
    "detailEntityName": {
      "type": "string",
      "required": false,
      "description": "Name of the detail entity"
    },
    "includeAuditLog": {
      "type": "boolean",
      "default": true,
      "description": "Include audit logging"
    }
  },
  "hooks": {
    "preGeneration": "pre-generation.js",
    "postGeneration": "post-generation.js"
  },
  "tests": {
    "coverage": 0.85,
    "required": true
  }
}
```

### Manifest Fields

**Required Fields:**
- `id` - Unique template identifier
- `name` - Human-readable name
- `version` - Semantic version
- `description` - Template description
- `category` - Template category (core, vertical, integration)
- `entities` - Entity requirements
- `features` - Supported features

**Optional Fields:**
- `compliance` - Compliance standards supported
- `dependencies` - Other template dependencies
- `variables` - Template variables
- `hooks` - Pre/post generation hooks
- `tests` - Test requirements

---

## Core Templates (10)

### 1. CRUD Master-Detail

**ID:** `crud-master-detail`

**Purpose:** Full CRUD operations with master-detail relationship.

**Entities:**
- Master entity (required)
- Detail entity (optional)

**Features:**
- List view with pagination
- Create/Update forms
- Detail view
- Delete with confirmation
- Search and filtering
- Master-detail navigation

**Generated Code:**
- Prisma models with relationships
- NestJS controllers and services
- React list/detail/form components
- React Native screens
- API DTOs with validation

---

### 2. Workflow Engine

**ID:** `workflow-engine`

**Purpose:** Business process workflow management.

**Entities:**
- Workflow definition
- Workflow instance
- Task
- Transition

**Features:**
- Workflow definition
- State transitions
- Task assignment
- Approval workflows
- Notifications
- History tracking

**Generated Code:**
- Workflow state machine
- Task management API
- Approval UI components
- Notification system

---

### 3. File Management

**ID:** `file-management`

**Purpose:** File upload, storage, and management.

**Entities:**
- File
- Folder
- FileVersion

**Features:**
- File upload
- File download
- File versioning
- Folder organization
- File sharing
- Access control

**Generated Code:**
- S3/storage integration
- File upload API
- File browser UI
- File preview components

---

### 4. User Management

**ID:** `user-management`

**Purpose:** User authentication and authorization.

**Entities:**
- User
- Role
- Permission

**Features:**
- User registration/login
- Role-based access control
- Permission management
- Password reset
- Email verification
- Two-factor authentication

**Generated Code:**
- Auth API endpoints
- JWT token management
- RBAC middleware
- User management UI
- Permission management UI

---

### 5. Dashboard Builder

**ID:** `dashboard-builder`

**Purpose:** Customizable dashboard with widgets.

**Entities:**
- Dashboard
- Widget
- WidgetConfig

**Features:**
- Drag-and-drop widgets
- Widget configuration
- Dashboard layouts
- Real-time updates
- Export/import dashboards

**Generated Code:**
- Dashboard API
- Widget system
- Drag-and-drop UI
- Widget library

---

### 6. Form Builder

**ID:** `form-builder`

**Purpose:** Dynamic form generation and validation.

**Entities:**
- Form
- FormField
- FormSubmission

**Features:**
- Dynamic form creation
- Field validation
- Conditional logic
- Form submission tracking
- Export submissions

**Generated Code:**
- Form API
- Dynamic form renderer
- Validation engine
- Form builder UI

---

### 7. Notifications

**ID:** `notifications`

**Purpose:** Multi-channel notification system.

**Entities:**
- Notification
- NotificationTemplate
- NotificationChannel

**Features:**
- Email notifications
- SMS notifications
- Push notifications
- In-app notifications
- Notification preferences
- Notification history

**Generated Code:**
- Notification API
- Notification service
- Notification UI components
- Channel integrations (Twilio, SendGrid)

---

### 8. Integrations

**ID:** `integrations`

**Purpose:** REST/GraphQL API integration wrapper.

**Entities:**
- Integration
- IntegrationConfig
- IntegrationLog

**Features:**
- REST API wrapper
- GraphQL client
- OAuth integration
- API key management
- Request/response logging
- Error handling

**Generated Code:**
- Integration API
- HTTP client wrapper
- OAuth handlers
- Integration UI

---

### 9. Reporting Engine

**ID:** `reporting-engine`

**Purpose:** Report generation and scheduling.

**Entities:**
- Report
- ReportTemplate
- ReportSchedule

**Features:**
- Report generation
- Report scheduling
- Export formats (PDF, Excel, CSV)
- Report templates
- Data visualization
- Report sharing

**Generated Code:**
- Report API
- Report generator
- Report UI
- Export functionality

---

### 10. Audit Logs

**ID:** `audit-logs`

**Purpose:** Comprehensive audit logging.

**Entities:**
- AuditLog
- AuditEvent

**Features:**
- Action logging
- Change tracking
- User activity logs
- Compliance reporting
- Log search
- Log retention

**Generated Code:**
- Audit API
- Audit service
- Audit log UI
- Compliance reports

---

## Template Variables

### Variable System

Templates use variables that are replaced during generation:

```typescript
interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'entity' | 'array';
  required: boolean;
  default?: any;
  description: string;
  validation?: ValidationRule[];
}
```

### Variable Usage in Templates

**Template Code:**
```typescript
// api/controller.template.ts
@Controller('{{entityNamePlural}}')
export class {{EntityName}}Controller {
  constructor(
    private readonly {{entityNameLower}}Service: {{EntityName}}Service
  ) {}
  
  @Get()
  async findAll(@Query() query: Find{{EntityName}}Dto) {
    return this.{{entityNameLower}}Service.findAll(query);
  }
}
```

**Variable Resolution:**
```typescript
const variables = {
  entityName: 'Customer',
  entityNamePlural: 'customers',
  EntityName: 'Customer',
  entityNameLower: 'customer'
};

const generated = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
  return variables[key] || match;
});
```

---

## Template Composition

### Composing Templates

Templates can be composed to create complex applications:

```typescript
const appTemplates = [
  'user-management',      // Auth and users
  'crud-master-detail',   // Main entities
  'workflow-engine',      // Business processes
  'notifications',         // Communication
  'audit-logs'            // Compliance
];
```

### Template Dependencies

Templates can depend on other templates:

```json
{
  "id": "workflow-engine",
  "dependencies": [
    "user-management",
    "notifications"
  ]
}
```

---

## Template Versioning

### Version Strategy

- **Major:** Breaking changes
- **Minor:** New features, backward compatible
- **Patch:** Bug fixes, backward compatible

### Version Management

```typescript
interface TemplateVersion {
  id: string;
  version: string;
  manifest: TemplateManifest;
  code: TemplateCode;
  tests: TestResults;
  createdAt: string;
  deprecated?: boolean;
}
```

### Version Selection

- Latest version by default
- Specific version can be requested
- Deprecated versions still available
- Migration guides for major versions

---

## Template Generation Process

### Generation Flow

```
1. Load Template Manifest
   ↓
2. Resolve Variables
   ↓
3. Load Template Files
   ↓
4. Apply Variables
   ↓
5. Execute Pre-Generation Hooks
   ↓
6. Generate Code
   ↓
7. Execute Post-Generation Hooks
   ↓
8. Validate Generated Code
   ↓
9. Return Generated Artifacts
```

### Code Generation

```typescript
class TemplateGenerator {
  async generate(
    templateId: string,
    variables: Record<string, any>,
    context: GenerationContext
  ): Promise<GeneratedArtifacts> {
    // Load template
    const template = await this.loadTemplate(templateId);
    
    // Resolve variables
    const resolvedVars = this.resolveVariables(variables, template);
    
    // Generate code
    const artifacts: GeneratedArtifacts = {};
    
    for (const [layer, files] of Object.entries(template.files)) {
      artifacts[layer] = [];
      
      for (const file of files) {
        const code = await this.processTemplate(file, resolvedVars, context);
        artifacts[layer].push({
          path: this.resolvePath(file.path, resolvedVars),
          content: code
        });
      }
    }
    
    return artifacts;
  }
}
```

---

## Template Testing

### Test Requirements

Each template must include:
- Unit tests for template logic
- Integration tests for generated code
- E2E tests for full functionality
- Minimum 80% code coverage

### Test Structure

```
templates/<template-id>/tests/
├── unit/
│   └── template.test.ts
├── integration/
│   └── generated-code.test.ts
└── e2e/
    └── full-flow.test.ts
```

---

## Template Customization

### SDK Extension

Customers can extend templates using the SDK:

```typescript
import { extendTemplate } from '@veroforge/sdk';

extendTemplate('crud-master-detail', {
  api: {
    service: (baseService) => {
      // Add custom methods
      baseService.customMethod = async () => {
        // Custom logic
      };
      return baseService;
    }
  },
  ui: {
    list: (baseComponent) => {
      // Add custom UI elements
      return enhancedComponent;
    }
  }
});
```

### Template Override

Customers can override template files:

```typescript
overrideTemplate('crud-master-detail', {
  'api/service.template.ts': customServiceTemplate
});
```

---

## Template Registry

### Registry Structure

```typescript
interface TemplateRegistry {
  templates: Map<string, TemplateVersion[]>;
  categories: Map<string, string[]>;
  search(query: string): Template[];
  getLatest(id: string): TemplateVersion;
  getVersion(id: string, version: string): TemplateVersion;
}
```

### Template Discovery

- Search by name, category, features
- Filter by compliance requirements
- Sort by popularity, rating, date

---

## Template Auto-Improvement

### Pattern Detection

VeroAI detects patterns in customer usage:
- Common customizations
- Performance issues
- Security vulnerabilities

### Template Updates

- Patterns promoted to templates
- Templates improved based on usage
- New templates created from patterns

---

## Related Documentation

- [VeroForge Development Plan](VEROFORGE_DEVELOPMENT_PLAN.md)
- [Generator Pipeline Architecture](../architecture/veroforge-generator-pipeline.md)
- [SDK Guide](../guides/development/veroforge-sdk-guide.md)

---

**Last Updated:** 2025-12-05  
**Status:** Planning - Awaiting VeroAI Completion  
**Owner:** Platform Engineering Team

