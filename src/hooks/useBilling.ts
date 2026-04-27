import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import type { ApiResponse, Subscription, CreditTransaction } from '@appTypes/index';

export const BILLING_KEY = 'billing';

export function useSubscription(workspaceId: string) {
  return useQuery({
    queryKey: [BILLING_KEY, workspaceId, 'subscription'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<Subscription>>(
        API_ROUTES.BILLING.SUBSCRIPTION(workspaceId),
      );
      return data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCreditHistory(workspaceId: string) {
  return useQuery({
    queryKey: [BILLING_KEY, workspaceId, 'credits'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<CreditTransaction[]>>(
        API_ROUTES.CREDITS.HISTORY(workspaceId),
      );
      return data.data;
    },
    enabled: !!workspaceId,
  });
}
