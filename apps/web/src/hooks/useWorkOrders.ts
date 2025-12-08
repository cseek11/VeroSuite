import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workOrdersApi } from '@/lib/work-orders-api';
import { 
  WorkOrder, 
  CreateWorkOrderRequest, 
  UpdateWorkOrderRequest, 
  WorkOrderFilters
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
  // Validate UUID format before enabling query
  const isValidUUID = (str: string | undefined | null): boolean => {
    if (!str || typeof str !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  return useQuery({
    queryKey: workOrderKeys.detail(id),
    queryFn: () => workOrdersApi.getWorkOrderById(id),
    enabled: !!id && isValidUUID(id), // Only enable if ID is valid UUID
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useWorkOrdersByCustomer = (customerId: string) => {
  // Validate UUID format before enabling query
  const isValidUUID = (str: string | undefined | null): boolean => {
    if (!str || typeof str !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  return useQuery({
    queryKey: workOrderKeys.byCustomer(customerId),
    queryFn: () => workOrdersApi.getWorkOrdersByCustomer(customerId),
    enabled: !!customerId && isValidUUID(customerId), // Only enable if ID is valid UUID
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useWorkOrdersByTechnician = (technicianId: string) => {
  // Validate UUID format before enabling query
  const isValidUUID = (str: string | undefined | null): boolean => {
    if (!str || typeof str !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  return useQuery({
    queryKey: workOrderKeys.byTechnician(technicianId),
    queryFn: () => workOrdersApi.getWorkOrdersByTechnician(technicianId),
    enabled: !!technicianId && isValidUUID(technicianId), // Only enable if ID is valid UUID
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
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkOrderRequest }) => {
      // Validate UUID before making API call
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        throw new Error(`Invalid work order ID: "${id}". ID must be a valid UUID.`);
      }
      return workOrdersApi.updateWorkOrder(id, data);
    },
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
    mutationFn: (id: string) => {
      // Validate UUID before making API call
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        throw new Error(`Invalid work order ID: "${id}". ID must be a valid UUID.`);
      }
      return workOrdersApi.deleteWorkOrder(id);
    },
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
    }) => {
      // Validate UUID before making API call
      if (!workOrderId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(workOrderId)) {
        throw new Error(`Invalid work order ID: "${workOrderId}". ID must be a valid UUID.`);
      }
      return workOrdersApi.changeWorkOrderStatus(workOrderId, newStatus, notes);
    },
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
    }) => {
      // Validate UUIDs before making API call
      if (!workOrderId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(workOrderId)) {
        throw new Error(`Invalid work order ID: "${workOrderId}". ID must be a valid UUID.`);
      }
      if (!technicianId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(technicianId)) {
        throw new Error(`Invalid technician ID: "${technicianId}". ID must be a valid UUID.`);
      }
      return workOrdersApi.assignWorkOrder(workOrderId, technicianId, scheduledDate);
    },
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

