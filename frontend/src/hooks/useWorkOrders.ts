import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workOrdersApi } from '@/lib/work-orders-api';
import { 
  WorkOrder, 
  CreateWorkOrderRequest, 
  UpdateWorkOrderRequest, 
  WorkOrderFilters,
  WorkOrderListResponse
} from '@/types/work-orders';

// Query keys
export const workOrderKeys = {
  all: ['workOrders'] as const,
  lists: () => [...workOrderKeys.all, 'list'] as const,
  list: (filters: WorkOrderFilters) => [...workOrderKeys.lists(), filters] as const,
  details: () => [...workOrderKeys.all, 'detail'] as const,
  detail: (id: string) => [...workOrderKeys.details(), id] as const,
  byCustomer: (customerId: string) => [...workOrderKeys.all, 'customer', customerId] as const,
  byTechnician: (technicianId: string) => [...workOrderKeys.all, 'technician', technicianId] as const,
};

// Hooks for fetching work orders
export const useWorkOrders = (filters: WorkOrderFilters = {}) => {
  return useQuery({
    queryKey: workOrderKeys.list(filters),
    queryFn: () => workOrdersApi.getWorkOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkOrder = (id: string) => {
  return useQuery({
    queryKey: workOrderKeys.detail(id),
    queryFn: () => workOrdersApi.getWorkOrderById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useWorkOrdersByCustomer = (customerId: string) => {
  return useQuery({
    queryKey: workOrderKeys.byCustomer(customerId),
    queryFn: () => workOrdersApi.getWorkOrdersByCustomer(customerId),
    enabled: !!customerId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useWorkOrdersByTechnician = (technicianId: string) => {
  return useQuery({
    queryKey: workOrderKeys.byTechnician(technicianId),
    queryFn: () => workOrdersApi.getWorkOrdersByTechnician(technicianId),
    enabled: !!technicianId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hooks for mutations
export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkOrderRequest) => workOrdersApi.createWorkOrder(data),
    onSuccess: (newWorkOrder) => {
      // Invalidate and refetch work order lists
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      
      // Add the new work order to the cache
      queryClient.setQueryData(workOrderKeys.detail(newWorkOrder.id), newWorkOrder);
      
      // If it's assigned to a technician, invalidate their work orders
      if (newWorkOrder.assigned_to) {
        queryClient.invalidateQueries({ 
          queryKey: workOrderKeys.byTechnician(newWorkOrder.assigned_to) 
        });
      }
      
      // Invalidate customer work orders
      queryClient.invalidateQueries({ 
        queryKey: workOrderKeys.byCustomer(newWorkOrder.customer_id) 
      });
    },
  });
};

export const useUpdateWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkOrderRequest }) => 
      workOrdersApi.updateWorkOrder(id, data),
    onSuccess: (updatedWorkOrder) => {
      // Update the work order in cache
      queryClient.setQueryData(workOrderKeys.detail(updatedWorkOrder.id), updatedWorkOrder);
      
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      
      // Invalidate related queries
      if (updatedWorkOrder.assigned_to) {
        queryClient.invalidateQueries({ 
          queryKey: workOrderKeys.byTechnician(updatedWorkOrder.assigned_to) 
        });
      }
      
      queryClient.invalidateQueries({ 
        queryKey: workOrderKeys.byCustomer(updatedWorkOrder.customer_id) 
      });
    },
  });
};

export const useDeleteWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workOrdersApi.deleteWorkOrder(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: workOrderKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
    },
  });
};

export const useChangeWorkOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workOrderId, newStatus, notes }: { 
      workOrderId: string; 
      newStatus: string; 
      notes?: string; 
    }) => workOrdersApi.changeWorkOrderStatus(workOrderId, newStatus, notes),
    onSuccess: (updatedWorkOrder) => {
      // Update the work order in cache
      queryClient.setQueryData(workOrderKeys.detail(updatedWorkOrder.id), updatedWorkOrder);
      
      // Invalidate lists to reflect status changes
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      
      // Invalidate related queries
      if (updatedWorkOrder.assigned_to) {
        queryClient.invalidateQueries({ 
          queryKey: workOrderKeys.byTechnician(updatedWorkOrder.assigned_to) 
        });
      }
      
      queryClient.invalidateQueries({ 
        queryKey: workOrderKeys.byCustomer(updatedWorkOrder.customer_id) 
      });
    },
  });
};

export const useAssignWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workOrderId, technicianId, scheduledDate }: { 
      workOrderId: string; 
      technicianId: string; 
      scheduledDate?: string; 
    }) => workOrdersApi.assignWorkOrder(workOrderId, technicianId, scheduledDate),
    onSuccess: (updatedWorkOrder) => {
      // Update the work order in cache
      queryClient.setQueryData(workOrderKeys.detail(updatedWorkOrder.id), updatedWorkOrder);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      
      // Invalidate technician work orders
      queryClient.invalidateQueries({ 
        queryKey: workOrderKeys.byTechnician(updatedWorkOrder.assigned_to!) 
      });
    },
  });
};

export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workOrderIds, newStatus, notes }: { 
      workOrderIds: string[]; 
      newStatus: string; 
      notes?: string; 
    }) => workOrdersApi.bulkUpdateStatus(workOrderIds, newStatus, notes),
    onSuccess: (updatedWorkOrders) => {
      // Update each work order in cache
      updatedWorkOrders.forEach(workOrder => {
        queryClient.setQueryData(workOrderKeys.detail(workOrder.id), workOrder);
      });
      
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      
      // Invalidate related queries for all affected work orders
      updatedWorkOrders.forEach(workOrder => {
        if (workOrder.assigned_to) {
          queryClient.invalidateQueries({ 
            queryKey: workOrderKeys.byTechnician(workOrder.assigned_to) 
          });
        }
        
        queryClient.invalidateQueries({ 
          queryKey: workOrderKeys.byCustomer(workOrder.customer_id) 
        });
      });
    },
  });
};

// Utility hook for optimistic updates
export const useOptimisticWorkOrderUpdate = () => {
  const queryClient = useQueryClient();

  const updateWorkOrderOptimistically = (id: string, updates: Partial<WorkOrder>) => {
    queryClient.setQueryData(workOrderKeys.detail(id), (old: WorkOrder | undefined) => {
      if (!old) return old;
      return { ...old, ...updates };
    });
  };

  return { updateWorkOrderOptimistically };
};

