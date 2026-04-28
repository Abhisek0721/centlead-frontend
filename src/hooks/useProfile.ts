import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/apiRoutes';
import { getToken } from '@utils/localStorage';
import type { User } from '@appTypes/index';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

export function useMe() {
  return useQuery<User>({
    queryKey: ['me-profile'],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.AUTH.ME, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { firstName?: string; lastName?: string }) => {
      const res = await fetch(API_ROUTES.AUTH.UPDATE_PROFILE, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(dto),
      });
      const data = await res.json();
      if (!res.ok) throw { response: { data } };
      return data.data as User;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me-profile'] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (dto: { currentPassword: string; newPassword: string }) => {
      const res = await fetch(API_ROUTES.AUTH.CHANGE_PASSWORD, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(dto),
      });
      const data = await res.json();
      if (!res.ok) throw { response: { data } };
      return data.data as { message: string };
    },
  });
}
