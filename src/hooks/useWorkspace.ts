import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import type { ApiResponse, Workspace } from '@appTypes/index';

export const WORKSPACE_KEY = 'workspaces';

export function useWorkspaces() {
  return useQuery({
    queryKey: [WORKSPACE_KEY],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<Workspace[]>>(
        API_ROUTES.WORKSPACES.BASE,
      );
      return data.data;
    },
  });
}

export function useWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: [WORKSPACE_KEY, workspaceId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<Workspace>>(
        API_ROUTES.WORKSPACES.BY_ID(workspaceId),
      );
      return data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCreateWorkspace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await axiosInstance.post<ApiResponse<Workspace>>(
        API_ROUTES.WORKSPACES.BASE,
        { name },
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [WORKSPACE_KEY] }),
  });
}
