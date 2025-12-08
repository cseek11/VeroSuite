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
  description?: string | undefined;
  itemCount?: number | undefined;
  compliance?: number | undefined;
  total?: number | undefined;
  lowStock?: number | undefined;
  outOfStock?: number | undefined;
}

export interface ComplianceAlert {
  id: string;
  type: 'expiring' | 'low_stock' | 'out_of_stock' | 'compliance_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  itemId?: string | undefined;
  itemName?: string | undefined;
  dueDate?: string | undefined;
  createdAt: string;
}

export interface Inspection {
  id: string;
  type: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  scheduledDate: string;
  completedDate?: string | undefined;
  inspector?: string | undefined;
  notes?: string | undefined;
  result?: 'pass' | 'fail' | 'conditional' | undefined;
}






