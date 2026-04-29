import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import type { ApiResponse, WorkspaceMember, WorkspaceInvitation, Role } from '@appTypes/index';

export const TEAM_KEY = 'team';

export function useTeamMembers(workspaceId: string) {
  return useQuery({
    queryKey: [TEAM_KEY, workspaceId, 'members'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<WorkspaceMember[]>>(
        API_ROUTES.TEAM.MEMBERS(workspaceId),
      );
      return data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useInvitations(workspaceId: string) {
  return useQuery({
    queryKey: [TEAM_KEY, workspaceId, 'invitations'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<WorkspaceInvitation[]>>(
        API_ROUTES.TEAM.INVITATIONS(workspaceId),
      );
      return data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useInviteMember(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { email: string; role: Role }) => {
      const { data } = await axiosInstance.post<ApiResponse<WorkspaceInvitation>>(
        API_ROUTES.TEAM.INVITE(workspaceId),
        dto,
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [TEAM_KEY, workspaceId] }),
  });
}

export function useUpdateMemberRole(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: Role }) => {
      await axiosInstance.patch(API_ROUTES.TEAM.UPDATE_ROLE(workspaceId, memberId), { role });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [TEAM_KEY, workspaceId] }),
  });
}

export function useRemoveMember(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (memberId: string) => {
      await axiosInstance.delete(API_ROUTES.TEAM.REMOVE(workspaceId, memberId));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [TEAM_KEY, workspaceId] }),
  });
}

export function useResendInvite(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (invitationId: string) => {
      await axiosInstance.post(API_ROUTES.TEAM.RESEND_INVITE(workspaceId, invitationId));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [TEAM_KEY, workspaceId] }),
  });
}
