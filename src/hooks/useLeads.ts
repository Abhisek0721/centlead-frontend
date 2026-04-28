import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import type { ApiPaginationResponse, Lead, Job, PaginationParams } from '@appTypes/index';

export const LEADS_KEY = 'leads';

export function useLeads(
  workspaceId: string,
  params?: { jobId?: string } & PaginationParams,
) {
  return useQuery({
    queryKey: [LEADS_KEY, workspaceId, params],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiPaginationResponse<Lead[]>>(
        API_ROUTES.LEADS.BASE(workspaceId),
        { params },
      );
      return { leads: data.data, totalCount: data.pagination.totalCount };
    },
    enabled: !!workspaceId,
  });
}

export function useLeadsByJob(
  workspaceId: string,
  jobId: string,
  pagination?: PaginationParams,
) {
  return useQuery({
    queryKey: [LEADS_KEY, workspaceId, 'job', jobId, pagination],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        ApiPaginationResponse<{ leads: Lead[]; job: Job }>
      >(API_ROUTES.LEADS.BY_JOB(workspaceId, jobId), { params: pagination });
      return {
        leads: data.data.leads,
        job: data.data.job,
        totalCount: data.pagination.totalCount,
      };
    },
    enabled: !!workspaceId && !!jobId,
  });
}
