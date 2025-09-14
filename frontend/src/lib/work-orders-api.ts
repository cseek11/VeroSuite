import { 
  WorkOrder, 
  CreateWorkOrderRequest, 
  UpdateWorkOrderRequest, 
  WorkOrderFilters, 
  WorkOrderListResponse,
  WorkOrderStatusChange,
  WorkOrderAssignment
} from '@/types/work-orders';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class WorkOrdersApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    // Get token from auth store (stored as JSON)
    let token = null;
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        token = parsed.token;
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
    
    // Fallback to direct jwt key
    if (!token) {
      token = localStorage.getItem('jwt');
    }
    
    const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getWorkOrders(filters: WorkOrderFilters = {}): Promise<WorkOrderListResponse> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assigned_to) params.append('assigned_to', filters.assigned_to);
    if (filters.customer_id) params.append('customer_id', filters.customer_id);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${API_BASE_URL}/work-orders?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    return this.handleResponse<WorkOrderListResponse>(response);
  }

  async getWorkOrderById(id: string): Promise<WorkOrder> {
    const response = await fetch(`${API_BASE_URL}/work-orders/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    return this.handleResponse<WorkOrder>(response);
  }

  async createWorkOrder(data: CreateWorkOrderRequest): Promise<WorkOrder> {
    const response = await fetch(`${API_BASE_URL}/work-orders`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<WorkOrder>(response);
  }

  async updateWorkOrder(id: string, data: UpdateWorkOrderRequest): Promise<WorkOrder> {
    const response = await fetch(`${API_BASE_URL}/work-orders/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<WorkOrder>(response);
  }

  async deleteWorkOrder(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/work-orders/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  async getWorkOrdersByCustomer(customerId: string): Promise<WorkOrder[]> {
    const response = await fetch(`${API_BASE_URL}/work-orders/customer/${customerId}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    return this.handleResponse<WorkOrder[]>(response);
  }

  async getWorkOrdersByTechnician(technicianId: string): Promise<WorkOrder[]> {
    const response = await fetch(`${API_BASE_URL}/work-orders/technician/${technicianId}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    return this.handleResponse<WorkOrder[]>(response);
  }

  async changeWorkOrderStatus(workOrderId: string, newStatus: string, notes?: string): Promise<WorkOrder> {
    return this.updateWorkOrder(workOrderId, {
      status: newStatus as any,
      notes: notes,
    });
  }

  async assignWorkOrder(workOrderId: string, technicianId: string, scheduledDate?: string): Promise<WorkOrder> {
    return this.updateWorkOrder(workOrderId, {
      assigned_to: technicianId,
      scheduled_date: scheduledDate,
    });
  }

  async bulkUpdateStatus(workOrderIds: string[], newStatus: string, notes?: string): Promise<WorkOrder[]> {
    const promises = workOrderIds.map(id => 
      this.changeWorkOrderStatus(id, newStatus, notes)
    );
    return Promise.all(promises);
  }

  async searchWorkOrders(query: string, filters: WorkOrderFilters = {}): Promise<WorkOrderListResponse> {
    // For now, we'll use the regular getWorkOrders with additional filtering
    // In the future, this could be enhanced with a dedicated search endpoint
    const searchFilters = {
      ...filters,
      // Add search-specific filters if the backend supports them
    };
    
    return this.getWorkOrders(searchFilters);
  }
}

export const workOrdersApi = new WorkOrdersApiService();
