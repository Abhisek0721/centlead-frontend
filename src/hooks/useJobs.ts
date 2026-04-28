import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import type { ApiResponse, ApiPaginationResponse, Job, PaginationParams } from '@appTypes/index';

export const JOBS_KEY = 'jobs';

export function useJobs(workspaceId: string, pagination?: PaginationParams) {
  return useQuery({
    queryKey: [JOBS_KEY, workspaceId, pagination],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiPaginationResponse<Job[]>>(
        API_ROUTES.JOBS.BASE(workspaceId),
        { params: pagination },
      );
      return { jobs: data.data, totalCount: data.pagination.totalCount };
    },
    enabled: !!workspaceId,
  });
}

export function useJob(workspaceId: string, jobId: string) {
  return useQuery({
    queryKey: [JOBS_KEY, workspaceId, jobId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<Job>>(
        API_ROUTES.JOBS.BY_ID(workspaceId, jobId),
      );
      return data.data;
    },
    enabled: !!workspaceId && !!jobId,
  });
}

export function useCreateJob(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { searchQuery: string; goalPrompt: string; aiEnabled?: boolean }) => {
      const { data } = await axiosInstance.post<ApiResponse<Job>>(
        API_ROUTES.JOBS.BASE(workspaceId),
        dto,
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [JOBS_KEY, workspaceId] }),
  });
}

export function useDeleteJob(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      await axiosInstance.delete(API_ROUTES.JOBS.BY_ID(workspaceId, jobId));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [JOBS_KEY, workspaceId] }),
  });
}
