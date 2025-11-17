// Inventory Types
export interface InventoryComplianceData {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  expiringSoon: number;
  complianceRate: number;
  safetyScore: number;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  itemCount?: number;
}

export interface ComplianceAlert {
  id: string;
  type: 'expiring' | 'low_stock' | 'out_of_stock' | 'compliance_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  itemId?: string;
  itemName?: string;
  dueDate?: string;
  createdAt: string;
}

export interface Inspection {
  id: string;
  type: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  scheduledDate: string;
  completedDate?: string;
  inspector?: string;
  notes?: string;
  result?: 'pass' | 'fail' | 'conditional';
}






