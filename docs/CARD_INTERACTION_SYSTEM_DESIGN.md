# Card Interaction System Design: Cross-Card Drag-and-Drop

**Date:** December 2024  
**System:** VeroField Dashboard Card Management System  
**Feature:** Inter-Card Data Transfer & Workflow System

---

## Executive Summary

This document designs a sophisticated **cross-card interaction system** that enables users to drag data between cards to create workflows, generate reports, schedule appointments, and perform actions. The system transforms the dashboard from a collection of independent cards into an **interactive workflow platform**.

**Core Concept:** Cards can both **emit data** (be dragged from) and **accept data** (be dropped onto), creating powerful workflow shortcuts.

---

## System Architecture

### 1. **Data Transfer Protocol**

#### **Drag Payload Structure**
```typescript
interface DragPayload {
  // Source information
  sourceCardId: string;
  sourceCardType: string;
  sourceDataType: 'customer' | 'job' | 'technician' | 'workorder' | 'invoice' | 'report' | 'custom';
  
  // Data being transferred
  data: {
    id: string;
    type: string;
    entity: any; // Full entity data (customer, job, etc.)
    metadata?: {
      selectedItems?: any[]; // For multi-select
      filters?: Record<string, any>;
      context?: Record<string, any>;
    };
  };
  
  // Visual feedback
  dragPreview?: {
    title: string;
    icon?: string;
    color?: string;
  };
  
  // Interaction metadata
  timestamp: number;
  userId: string;
}
```

#### **Drop Zone Configuration**
```typescript
interface DropZoneConfig {
  cardId: string;
  cardType: string;
  
  // What data types this card accepts
  accepts: {
    dataTypes: string[]; // ['customer', 'job', 'technician']
    maxItems?: number; // undefined = unlimited
    requiredFields?: string[]; // Fields that must be present
  };
  
  // Actions available when data is dropped
  actions: {
    [actionId: string]: {
      label: string;
      icon?: string;
      handler: (payload: DragPayload) => Promise<ActionResult>;
      requiresConfirmation?: boolean;
      confirmationMessage?: string;
    };
  };
  
  // Visual feedback
  dropZoneStyle?: {
    highlightColor?: string;
    borderStyle?: string;
  };
  
  // Validation
  validator?: (payload: DragPayload) => ValidationResult;
}
```

---

## Card Interaction Patterns

### **Pattern 1: Data Source → Action Card**

**Example:** Drag customer from Search Card → Scheduler Card = Create appointment

```typescript
// Customer Search Card (Source)
const customerSearchCard = {
  id: 'customer-search',
  type: 'customer-search',
  canDrag: true,
  dragConfig: {
    dataType: 'customer',
    getDragPayload: (selectedCustomer) => ({
      sourceCardId: 'customer-search',
      sourceCardType: 'customer-search',
      sourceDataType: 'customer',
      data: {
        id: selectedCustomer.id,
        type: 'customer',
        entity: selectedCustomer
      },
      dragPreview: {
        title: selectedCustomer.name,
        icon: 'User',
        color: 'blue'
      }
    })
  }
};

// Scheduler Card (Destination)
const schedulerCard = {
  id: 'scheduler',
  type: 'scheduler',
  dropZones: [{
    accepts: {
      dataTypes: ['customer', 'job', 'workorder']
    },
    actions: {
      'create-appointment': {
        label: 'Create Appointment',
        icon: 'Calendar',
        handler: async (payload) => {
          if (payload.sourceDataType === 'customer') {
            // Open appointment creation modal with customer pre-filled
            return openAppointmentModal({
              customerId: payload.data.id,
              customer: payload.data.entity
            });
          }
        }
      },
      'reschedule': {
        label: 'Reschedule Existing',
        icon: 'Calendar',
        handler: async (payload) => {
          // If job/workorder, reschedule it
          if (payload.sourceDataType === 'job') {
            return rescheduleJob(payload.data.id, newDate);
          }
        }
      }
    }
  }]
};
```

### **Pattern 2: Data Source → Report Card**

**Example:** Drag customer from Search Card → Report Card = Generate customer report

```typescript
// Report Card (Destination)
const reportCard = {
  id: 'reports',
  type: 'reports',
  dropZones: [{
    accepts: {
      dataTypes: ['customer', 'job', 'technician', 'workorder']
    },
    actions: {
      'generate-report': {
        label: 'Generate Report',
        icon: 'FileText',
        handler: async (payload) => {
          // Generate report based on data type
          const reportType = getReportTypeForDataType(payload.sourceDataType);
          return generateReport({
            type: reportType,
            entityId: payload.data.id,
            entity: payload.data.entity
          });
        }
      },
      'add-to-report': {
        label: 'Add to Existing Report',
        icon: 'Plus',
        handler: async (payload) => {
          // Add entity to currently open report
          return addEntityToReport(payload.data);
        }
      }
    }
  }]
};
```

### **Pattern 3: Multi-Select → Batch Action Card**

**Example:** Select multiple jobs → Drag to Technician Card = Bulk assign

```typescript
// Jobs Calendar Card (Source - Multi-select)
const jobsCalendarCard = {
  id: 'jobs-calendar',
  type: 'jobs-calendar',
  canDrag: true,
  dragConfig: {
    dataType: 'job',
    supportsMultiSelect: true,
    getDragPayload: (selectedJobs) => ({
      sourceCardId: 'jobs-calendar',
      sourceCardType: 'jobs-calendar',
      sourceDataType: 'job',
      data: {
        id: selectedJobs[0].id, // Primary item
        type: 'job',
        entity: selectedJobs[0],
        metadata: {
          selectedItems: selectedJobs // All selected items
        }
      },
      dragPreview: {
        title: `${selectedJobs.length} jobs selected`,
        icon: 'Package',
        color: 'purple'
      }
    })
  }
};

// Technician Dispatch Card (Destination)
const technicianCard = {
  id: 'technician-dispatch',
  type: 'technician-dispatch',
  dropZones: [{
    accepts: {
      dataTypes: ['job', 'workorder'],
      maxItems: undefined // Accept multiple
    },
    actions: {
      'assign-jobs': {
        label: 'Assign Jobs',
        icon: 'UserCheck',
        requiresConfirmation: true,
        confirmationMessage: `Assign ${payload.data.metadata.selectedItems.length} jobs to this technician?`,
        handler: async (payload) => {
          const jobs = payload.data.metadata.selectedItems;
          const technicianId = getSelectedTechnician();
          return bulkAssignJobs(jobs.map(j => j.id), technicianId);
        }
      }
    }
  }]
};
```

### **Pattern 4: Filter Card → Data Card**

**Example:** Drag filter from Filter Card → Customer List Card = Apply filter

```typescript
// Filter Card (Source)
const filterCard = {
  id: 'filters',
  type: 'filters',
  canDrag: true,
  dragConfig: {
    dataType: 'filter',
    getDragPayload: (filterConfig) => ({
      sourceCardId: 'filters',
      sourceCardType: 'filters',
      sourceDataType: 'filter',
      data: {
        id: filterConfig.id,
        type: 'filter',
        entity: filterConfig
      },
      dragPreview: {
        title: filterConfig.name,
        icon: 'Filter',
        color: 'gray'
      }
    })
  }
};

// Customer List Card (Destination)
const customerListCard = {
  id: 'customer-list',
  type: 'customer-list',
  dropZones: [{
    accepts: {
      dataTypes: ['filter']
    },
    actions: {
      'apply-filter': {
        label: 'Apply Filter',
        icon: 'Filter',
        handler: async (payload) => {
          return applyFilterToCustomerList(payload.data.entity);
        }
      }
    }
  }]
};
```

---

## Comprehensive Card Interaction Matrix

### **Customer Search Card** (Source)
**Can drag:** Customers, Customer Lists, Customer Filters

**Interactions:**
- → **Scheduler Card:** Create appointment, Schedule service
- → **Report Card:** Generate customer report, Add to report
- → **Invoice Card:** Create invoice, View payment history
- → **Work Order Card:** Create work order
- → **Communication Card:** Send SMS, Send email, Call customer
- → **Map Card:** Show customer location, Add to route
- → **Notes Card:** Add customer note, View history
- → **Tag Card:** Apply tags, Add to segment

### **Jobs Calendar Card** (Source)
**Can drag:** Jobs, Job Lists, Time Slots

**Interactions:**
- → **Technician Card:** Assign jobs, Reassign jobs
- → **Scheduler Card:** Reschedule, Move to different time
- → **Invoice Card:** Create invoice from job
- → **Report Card:** Generate job report, Job completion report
- → **Map Card:** Add to route, Optimize route
- → **Notes Card:** Add job note, View job history
- → **Customer Card:** View customer details, Customer history

### **Technician Dispatch Card** (Source & Destination)
**Can drag:** Technicians, Technician Lists
**Can accept:** Jobs, Work Orders, Routes

**Interactions:**
- **As Source:**
  - → **Jobs Calendar:** Assign technician to job
  - → **Map Card:** Show technician location, Add to route
  - → **Report Card:** Generate technician report
  - → **Schedule Card:** View technician schedule
  
- **As Destination:**
  - ← **Jobs Calendar:** Assign jobs to technician
  - ← **Work Order Card:** Assign work orders
  - ← **Route Card:** Assign route to technician

### **Scheduler Card** (Destination)
**Can accept:** Customers, Jobs, Work Orders, Technicians

**Interactions:**
- ← **Customer Search:** Create appointment
- ← **Jobs Calendar:** Reschedule job
- ← **Work Order Card:** Schedule work order
- ← **Technician Card:** View/Edit technician schedule

### **Report Card** (Destination)
**Can accept:** Customers, Jobs, Technicians, Work Orders, Invoices, Filters

**Interactions:**
- ← **Customer Search:** Generate customer report
- ← **Jobs Calendar:** Generate job report
- ← **Technician Card:** Generate technician report
- ← **Invoice Card:** Generate financial report
- ← **Filter Card:** Apply filter to report

### **Invoice Card** (Source & Destination)
**Can drag:** Invoices, Payment Records
**Can accept:** Customers, Jobs, Work Orders

**Interactions:**
- **As Source:**
  - → **Report Card:** Financial reports
  - → **Customer Card:** Payment history
  
- **As Destination:**
  - ← **Customer Search:** Create invoice
  - ← **Jobs Calendar:** Create invoice from job
  - ← **Work Order Card:** Create invoice from work order

### **Map Card** (Destination)
**Can accept:** Customers, Jobs, Technicians, Routes

**Interactions:**
- ← **Customer Search:** Show customer location
- ← **Jobs Calendar:** Show job locations, Add to route
- ← **Technician Card:** Show technician location
- ← **Route Card:** Display route

### **Communication Card** (Destination)
**Can accept:** Customers, Jobs, Technicians

**Interactions:**
- ← **Customer Search:** Send SMS/Email to customer
- ← **Jobs Calendar:** Send job confirmation
- ← **Technician Card:** Send message to technician

### **Notes Card** (Destination)
**Can accept:** Customers, Jobs, Work Orders, Technicians

**Interactions:**
- ← **Customer Search:** Add customer note
- ← **Jobs Calendar:** Add job note
- ← **Work Order Card:** Add work order note

### **Quick Actions Card** (Destination)
**Can accept:** Any entity type

**Interactions:**
- ← **Any Card:** Show available actions for dropped entity
- Acts as a universal action hub

---

## Implementation Architecture

### **1. Drag-and-Drop System Enhancement**

#### **Enhanced useCardDragDrop Hook**
```typescript
interface EnhancedDragDropProps extends UseCardDragDropProps {
  // New props for cross-card interactions
  onCardDataDrag?: (cardId: string, payload: DragPayload) => void;
  onCardDataDrop?: (targetCardId: string, payload: DragPayload) => Promise<ActionResult>;
  getCardDropZones?: (cardId: string) => DropZoneConfig[];
  getCardDragConfig?: (cardId: string) => DragConfig;
}

export function useCardDragDrop(props: EnhancedDragDropProps) {
  const [draggingData, setDraggingData] = useState<DragPayload | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [dropZoneHighlight, setDropZoneHighlight] = useState<string | null>(null);
  
  // Detect if dragging card content (not card itself)
  const handleContentDragStart = useCallback((cardId: string, payload: DragPayload, e: React.MouseEvent) => {
    // Different from card drag - this is dragging data FROM a card
    setDraggingData(payload);
    // Show drag preview
    showDragPreview(payload.dragPreview);
  }, []);
  
  // Detect drop zones as user drags
  const handleContentDragMove = useCallback((e: MouseEvent) => {
    if (!draggingData) return;
    
    // Find card under cursor
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    const cardElement = elementUnderCursor?.closest('[data-card-id]');
    
    if (cardElement) {
      const targetCardId = cardElement.getAttribute('data-card-id');
      if (targetCardId) {
        // Check if this card accepts this data type
        const dropZones = props.getCardDropZones?.(targetCardId) || [];
        const canAccept = dropZones.some(zone => 
          zone.accepts.dataTypes.includes(draggingData.sourceDataType)
        );
        
        if (canAccept) {
          setDropTarget(targetCardId);
          setDropZoneHighlight(targetCardId);
          // Show drop zone highlight
        } else {
          setDropTarget(null);
          setDropZoneHighlight(null);
        }
      }
    }
  }, [draggingData, props]);
  
  // Handle drop
  const handleContentDrop = useCallback(async (targetCardId: string, payload: DragPayload) => {
    const dropZones = props.getCardDropZones?.(targetCardId) || [];
    
    // Find matching drop zone
    const matchingZone = dropZones.find(zone => 
      zone.accepts.dataTypes.includes(payload.sourceDataType)
    );
    
    if (matchingZone) {
      // Show action menu if multiple actions available
      if (Object.keys(matchingZone.actions).length > 1) {
        const action = await showActionMenu(matchingZone.actions);
        if (action) {
          return await action.handler(payload);
        }
      } else {
        // Single action - execute directly
        const action = Object.values(matchingZone.actions)[0];
        if (action.requiresConfirmation) {
          const confirmed = await confirmAction(action.confirmationMessage);
          if (confirmed) {
            return await action.handler(payload);
          }
        } else {
          return await action.handler(payload);
        }
      }
    }
  }, [props]);
  
  return {
    // Existing card drag functionality
    ...existingCardDragReturn,
    
    // New cross-card data transfer
    handleContentDragStart,
    handleContentDragMove,
    handleContentDrop,
    draggingData,
    dropTarget,
    dropZoneHighlight
  };
}
```

### **2. Card Component Enhancement**

#### **Draggable Content Wrapper**
```typescript
interface DraggableContentProps {
  cardId: string;
  dataType: string;
  data: any;
  children: React.ReactNode;
  dragConfig?: DragConfig;
  className?: string;
}

export function DraggableContent({
  cardId,
  dataType,
  data,
  children,
  dragConfig,
  className
}: DraggableContentProps) {
  const { handleContentDragStart } = useCardDragDrop();
  
  const handleDragStart = (e: React.DragEvent) => {
    const payload: DragPayload = {
      sourceCardId: cardId,
      sourceCardType: getCardType(cardId),
      sourceDataType: dataType,
      data: {
        id: data.id,
        type: dataType,
        entity: data
      },
      dragPreview: dragConfig?.getDragPreview?.(data) || {
        title: data.name || data.id,
        icon: getIconForDataType(dataType)
      },
      timestamp: Date.now(),
      userId: getCurrentUserId()
    };
    
    handleContentDragStart(cardId, payload, e as any);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
  };
  
  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      className={`draggable-content ${className}`}
      data-draggable-type={dataType}
      data-draggable-id={data.id}
    >
      {children}
    </div>
  );
}
```

#### **Drop Zone Component**
```typescript
interface DropZoneProps {
  cardId: string;
  dropZoneConfig: DropZoneConfig;
  children: React.ReactNode;
  className?: string;
}

export function DropZone({
  cardId,
  dropZoneConfig,
  children,
  className
}: DropZoneProps) {
  const { handleContentDrop, dropZoneHighlight, draggingData } = useCardDragDrop();
  const [isDragOver, setIsDragOver] = useState(false);
  
  const canAccept = draggingData && 
    dropZoneConfig.accepts.dataTypes.includes(draggingData.sourceDataType);
  
  const handleDragOver = (e: React.DragEvent) => {
    if (canAccept) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    }
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const payloadJson = e.dataTransfer.getData('application/json');
    if (payloadJson) {
      const payload: DragPayload = JSON.parse(payloadJson);
      await handleContentDrop(cardId, payload);
    }
  };
  
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        drop-zone
        ${isDragOver && canAccept ? 'drop-zone-active' : ''}
        ${dropZoneHighlight === cardId ? 'drop-zone-highlight' : ''}
        ${className}
      `}
      data-card-id={cardId}
      data-accepts={dropZoneConfig.accepts.dataTypes.join(',')}
    >
      {children}
      {isDragOver && canAccept && (
        <div className="drop-zone-overlay">
          <div className="drop-zone-actions">
            {Object.entries(dropZoneConfig.actions).map(([actionId, action]) => (
              <button
                key={actionId}
                onClick={() => handleContentDrop(cardId, draggingData!)}
                className="drop-zone-action-button"
              >
                <Icon name={action.icon} />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### **3. Card Registration System**

```typescript
// Card registry to manage all card interactions
class CardInteractionRegistry {
  private cards: Map<string, CardConfig> = new Map();
  
  registerCard(config: CardConfig) {
    this.cards.set(config.id, config);
  }
  
  getCardConfig(cardId: string): CardConfig | undefined {
    return this.cards.get(cardId);
  }
  
  getDropZonesForCard(cardId: string): DropZoneConfig[] {
    const config = this.cards.get(cardId);
    return config?.dropZones || [];
  }
  
  getDragConfigForCard(cardId: string): DragConfig | undefined {
    const config = this.cards.get(cardId);
    return config?.canDrag ? config.dragConfig : undefined;
  }
  
  findCardsThatAccept(dataType: string): string[] {
    const acceptingCards: string[] = [];
    this.cards.forEach((config, cardId) => {
      const accepts = config.dropZones.some(zone =>
        zone.accepts.dataTypes.includes(dataType)
      );
      if (accepts) {
        acceptingCards.push(cardId);
      }
    });
    return acceptingCards;
  }
}

// Usage in card components
const CustomerSearchCard = () => {
  const registry = useCardInteractionRegistry();
  
  useEffect(() => {
    registry.registerCard({
      id: 'customer-search',
      type: 'customer-search',
      canDrag: true,
      dragConfig: {
        dataType: 'customer',
        getDragPayload: (customer) => ({ /* ... */ })
      }
    });
  }, []);
  
  return (
    <Card>
      {customers.map(customer => (
        <DraggableContent
          key={customer.id}
          cardId="customer-search"
          dataType="customer"
          data={customer}
        >
          <CustomerItem customer={customer} />
        </DraggableContent>
      ))}
    </Card>
  );
};

const SchedulerCard = () => {
  const registry = useCardInteractionRegistry();
  
  useEffect(() => {
    registry.registerCard({
      id: 'scheduler',
      type: 'scheduler',
      dropZones: [{
        accepts: {
          dataTypes: ['customer', 'job', 'workorder']
        },
        actions: {
          'create-appointment': {
            label: 'Create Appointment',
            handler: async (payload) => {
              // Handle appointment creation
            }
          }
        }
      }]
    });
  }, []);
  
  return (
    <DropZone cardId="scheduler" dropZoneConfig={/* ... */}>
      <Card>
        <Calendar />
      </Card>
    </DropZone>
  );
};
```

---

## Advanced Interaction Patterns

### **1. Chain Interactions**
**Example:** Customer → Scheduler → Invoice
- Drag customer to scheduler (creates appointment)
- Drag appointment to invoice card (creates invoice)

### **2. Multi-Card Operations**
**Example:** Select multiple jobs → Drag to technician → Drag to route
- Select 5 jobs from calendar
- Drag to technician (assigns all)
- Drag technician to route (adds to route)

### **3. Context-Aware Actions**
**Example:** Same customer, different actions based on destination
- Customer → Scheduler = Create appointment
- Customer → Invoice = Create invoice
- Customer → Report = Generate report
- Customer → Communication = Send message

### **4. Filter Propagation**
**Example:** Filter → Multiple Cards
- Drag filter to customer list (applies filter)
- Drag same filter to jobs calendar (applies filter)
- Filter propagates across related cards

### **5. Data Aggregation**
**Example:** Multiple customers → Report Card
- Select 10 customers
- Drag to report card
- Generates aggregated report

---

## Visual Feedback System

### **1. Drag Preview**
- Show entity name, icon, and count (for multi-select)
- Follow cursor during drag
- Animated and styled based on data type

### **2. Drop Zone Highlighting**
- Highlight cards that can accept the dragged data
- Show drop zone overlay with available actions
- Visual indicator (border, background color) when hovering

### **3. Action Menu**
- If multiple actions available, show menu on drop
- Quick action buttons
- Keyboard shortcuts (1, 2, 3 for actions)

### **4. Success/Error Feedback**
- Toast notification on successful drop
- Error message if drop fails
- Undo option for actions

---

## Implementation Phases

### **Phase 1: Foundation (Weeks 1-2)**
1. Implement drag payload system
2. Create drop zone infrastructure
3. Build card registry
4. Basic drag-and-drop between 2 card types (Customer → Scheduler)

### **Phase 2: Core Interactions (Weeks 3-4)**
1. Customer Search → Scheduler (create appointment)
2. Customer Search → Report (generate report)
3. Jobs Calendar → Technician (assign jobs)
4. Jobs Calendar → Scheduler (reschedule)

### **Phase 3: Advanced Features (Weeks 5-6)**
1. Multi-select drag-and-drop
2. Filter propagation
3. Chain interactions
4. Action menus

### **Phase 4: Polish (Weeks 7-8)**
1. Visual feedback enhancements
2. Performance optimization
3. Error handling
4. User onboarding/tutorials

---

## Success Metrics

### **Efficiency Metrics**
- **Time to Create Appointment:** Target < 5 seconds (drag customer → scheduler)
- **Time to Generate Report:** Target < 3 seconds (drag customer → report)
- **Time to Assign Jobs:** Target < 2 seconds (drag jobs → technician)
- **Clicks Saved:** Target 50% reduction in clicks for common workflows

### **Adoption Metrics**
- **Feature Discovery:** Target > 70% of users discover drag-and-drop
- **Usage Rate:** Target > 40% of users use drag-and-drop weekly
- **Workflow Completion:** Target > 80% success rate for drag-and-drop workflows

---

## Conclusion

This cross-card interaction system transforms VeroField from a collection of cards into a **powerful workflow platform**. Users can create complex workflows through simple drag-and-drop gestures, dramatically improving productivity for service-based businesses.

**Key Benefits:**
1. **Speed:** Reduce clicks from 5-10 to 1 drag-and-drop
2. **Intuitive:** Visual workflow creation
3. **Flexible:** Users create their own workflows
4. **Powerful:** Complex operations through simple gestures

**Next Steps:**
1. Review and approve design
2. Begin Phase 1 implementation
3. User testing after Phase 2
4. Iterate based on feedback

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Design Phase








