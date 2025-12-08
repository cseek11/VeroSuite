/**
 * Card Interaction System Types
 * 
 * Defines the types and interfaces for cross-card drag-and-drop interactions
 * that enable workflow creation through visual data transfer.
 */

/**
 * Data types that can be transferred between cards
 */
export type DataType = 
  | 'customer' 
  | 'job' 
  | 'technician' 
  | 'workorder' 
  | 'invoice' 
  | 'report' 
  | 'filter' 
  | 'route'
  | 'appointment'
  | 'note'
  | 'tag'
  | 'custom';

/**
 * Entity data structure for drag payload
 */
export interface EntityData {
  id: string;
  type: string;
  entity: any; // Full entity data (customer, job, etc.)
  metadata?: {
    selectedItems?: any[]; // For multi-select
    filters?: Record<string, any>;
    context?: Record<string, any>;
    [key: string]: any; // Allow additional metadata
  };
}

/**
 * Visual preview shown during drag
 */
export interface DragPreview {
  title: string;
  icon?: string;
  color?: string;
  count?: number; // For multi-select
  image?: string;
}

/**
 * Drag payload structure - data transferred between cards
 */
export interface DragPayload {
  // Source information
  sourceCardId: string;
  sourceCardType: string;
  sourceDataType: DataType;
  
  // Data being transferred
  data: EntityData;
  
  // Visual feedback
  dragPreview?: DragPreview;
  
  // Interaction metadata
  timestamp: number;
  userId: string;
  
  // Additional context
  [key: string]: any;
}

/**
 * Result of an action execution
 */
export interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  undo?: () => Promise<void>; // Optional undo function
}

/**
 * Action handler function type
 */
export type ActionHandler = (payload: DragPayload) => Promise<ActionResult>;

/**
 * Action configuration
 */
export interface ActionConfig {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  handler: ActionHandler;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  keyboardShortcut?: string;
  disabled?: boolean;
}

/**
 * Accept configuration for drop zones
 */
export interface AcceptConfig {
  dataTypes: DataType[];
  maxItems?: number; // undefined = unlimited
  requiredFields?: string[]; // Fields that must be present in entity
  customValidator?: (payload: DragPayload) => boolean;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Validator function type
 */
export type Validator = (payload: DragPayload) => ValidationResult;

/**
 * Drop zone style configuration
 */
export interface DropZoneStyle {
  highlightColor?: string;
  borderStyle?: string;
  backgroundColor?: string;
  borderWidth?: number;
}

/**
 * Drop zone configuration
 */
export interface DropZoneConfig {
  cardId: string;
  cardType: string;
  
  // What data types this card accepts
  accepts: AcceptConfig;
  
  // Actions available when data is dropped
  actions: Record<string, ActionConfig>;
  
  // Visual feedback
  dropZoneStyle?: DropZoneStyle;
  
  // Validation
  validator?: Validator;
  
  // Additional metadata
  metadata?: Record<string, any>;
}

/**
 * Drag configuration for cards that can emit data
 */
export interface DragConfig {
  dataType: DataType;
  supportsMultiSelect?: boolean;
  getDragPayload: (data: any, selectedItems?: any[]) => DragPayload;
  getDragPreview?: (data: any, selectedItems?: any[]) => DragPreview;
  canDrag?: (data: any) => boolean;
}

/**
 * Complete card configuration
 */
export interface CardConfig {
  id: string;
  type: string;
  canDrag?: boolean; // Can this card emit data?
  dragConfig?: DragConfig;
  dropZones?: DropZoneConfig[];
  metadata?: Record<string, any>;
}

/**
 * Interaction configuration for card-to-card interactions
 */
export interface InteractionConfig {
  id: string;
  sourceCardType: string;
  targetCardType: string;
  sourceDataType: DataType;
  actionId: string;
  handler: ActionHandler;
  metadata?: Record<string, any>;
}

/**
 * Card interaction registry state
 */
export interface RegistryState {
  cards: Map<string, CardConfig>;
  interactions: Map<string, InteractionConfig>;
  enabled: boolean;
}








