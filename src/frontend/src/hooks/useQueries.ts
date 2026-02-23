import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Material, Job, Vendor, RAPTemplate, MaterialRequest, ProgressRecord, RealizationReport } from '../backend';
import { toast } from 'sonner';

// User Profile Hooks
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// Material Hooks
export function useGetAllMaterials() {
  const { actor, isFetching } = useActor();

  return useQuery<Material[]>({
    queryKey: ['materials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMaterials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, unit, price }: { name: string; unit: string; price: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMaterial(name, unit, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add material');
    },
  });
}

export function useUpdateMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, unit, price }: { id: bigint; name: string; unit: string; price: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMaterial(id, name, unit, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update material');
    },
  });
}

export function useDeleteMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMaterial(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete material');
    },
  });
}

// Job Hooks
export function useGetAllJobs() {
  const { actor, isFetching } = useActor();

  return useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, volume, unit, cost, parentId }: { name: string; volume: bigint; unit: string; cost: bigint; parentId: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addJob(name, volume, unit, cost, parentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add job');
    },
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, volume, unit, cost, parentId }: { id: bigint; name: string; volume: bigint; unit: string; cost: bigint; parentId: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJob(id, name, volume, unit, cost, parentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update job');
    },
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJob(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete job');
    },
  });
}

// Vendor Hooks
export function useGetAllVendors() {
  const { actor, isFetching } = useActor();

  return useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVendors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, address, phone }: { name: string; address: string; phone: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVendor(name, address, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add vendor');
    },
  });
}

export function useUpdateVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, address, phone }: { id: bigint; name: string; address: string; phone: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVendor(id, name, address, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update vendor');
    },
  });
}

export function useDeleteVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVendor(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete vendor');
    },
  });
}

// RAP Template Hooks
export function useGetAllRAPTemplates() {
  const { actor, isFetching } = useActor();

  return useQuery<RAPTemplate[]>({
    queryKey: ['rapTemplates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRAPTemplates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRAPTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, jobs }: { name: string; jobs: Job[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createRAPTemplate(name, jobs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rapTemplates'] });
      toast.success('RAP template created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create RAP template');
    },
  });
}

export function useUpdateRAPTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, jobs }: { id: bigint; name: string; jobs: Job[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRAPTemplate(id, name, jobs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rapTemplates'] });
      toast.success('RAP template updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update RAP template');
    },
  });
}

export function useDeleteRAPTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRAPTemplate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rapTemplates'] });
      toast.success('RAP template deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete RAP template');
    },
  });
}

// Material Request Hooks
export function useGetAllMaterialRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<MaterialRequest[]>({
    queryKey: ['materialRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMaterialRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyMaterialRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<MaterialRequest[]>({
    queryKey: ['myMaterialRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMaterialRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMaterialRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, materialId, quantity }: { jobId: bigint; materialId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMaterialRequest(jobId, materialId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materialRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myMaterialRequests'] });
      toast.success('Material request created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create material request');
    },
  });
}

export function useGetPendingBuyerApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<MaterialRequest[]>({
    queryKey: ['pendingBuyerApprovals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingBuyerApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveMaterialRequestByBuyer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, price, quantity }: { requestId: bigint; price: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveMaterialRequestByBuyer(requestId, price, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materialRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingBuyerApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['pendingFinanceApprovals'] });
      toast.success('Request approved by Buyer');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve request');
    },
  });
}

export function useGetPendingFinanceApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<MaterialRequest[]>({
    queryKey: ['pendingFinanceApprovals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingFinanceApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveMaterialRequestByFinance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, finalPrice }: { requestId: bigint; finalPrice: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveMaterialRequestByFinance(requestId, finalPrice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materialRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingFinanceApprovals'] });
      toast.success('Request approved by Finance');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve request');
    },
  });
}

// Progress Record Hooks
export function useGetAllProgressRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<ProgressRecord[]>({
    queryKey: ['progressRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProgressRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, percentage }: { jobId: bigint; percentage: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordProgress(jobId, percentage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressRecords'] });
      toast.success('Progress recorded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record progress');
    },
  });
}

// Realization Report Hooks
export function useGetAllRealizationReports() {
  const { actor, isFetching } = useActor();

  return useQuery<RealizationReport[]>({
    queryKey: ['realizationReports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRealizationReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddRealizationReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ materialId, actualPrice, vendorId }: { materialId: bigint; actualPrice: bigint; vendorId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRealizationReport(materialId, actualPrice, vendorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realizationReports'] });
      toast.success('Realization report added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add realization report');
    },
  });
}

// Material Usage Hook
export function useGetMaterialUsageSummary(materialId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<{ totalRequested: bigint; totalApproved: bigint }>({
    queryKey: ['materialUsage', materialId?.toString()],
    queryFn: async () => {
      if (!actor || !materialId) return { totalRequested: BigInt(0), totalApproved: BigInt(0) };
      return actor.getMaterialUsageSummary(materialId);
    },
    enabled: !!actor && !isFetching && materialId !== null,
  });
}
