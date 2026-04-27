import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import type { ApiResponse, Lead, PaginationParams } from '@appTypes/index';

export const LEADS_KEY = 'leads';

export function useLeadsByJob(
  workspaceId: string,
  jobId: string,
  pagination?: PaginationParams,
) {
  return useQuery({
    queryKey: [LEADS_KEY, workspaceId, jobId, pagination],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        ApiResponse<{ leads: Lead[]; totalCount: number }>
      >(API_ROUTES.LEADS.BY_JOB(workspaceId, jobId), { params: pagination });
      return data.data;
    },
    enabled: !!workspaceId && !!jobId,
  });
}
