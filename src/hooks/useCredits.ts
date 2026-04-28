import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import type { ApiResponse, ApiPaginationResponse, CreditBalance, CreditTransaction, PaginationParams } from '@appTypes/index';

export const CREDITS_KEY = 'credits';

export function useCreditBalance(workspaceId: string) {
  return useQuery({
    queryKey: [CREDITS_KEY, workspaceId, 'balance'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<CreditBalance>>(
        API_ROUTES.CREDITS.BALANCE(workspaceId),
      );
      return data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCreditTransactions(workspaceId: string, pagination?: PaginationParams) {
  return useQuery({
    queryKey: [CREDITS_KEY, workspaceId, 'transactions', pagination],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiPaginationResponse<CreditTransaction[]>>(
        API_ROUTES.CREDITS.TRANSACTIONS(workspaceId),
        { params: pagination },
      );
      return { transactions: data.data, totalCount: data.pagination.totalCount };
    },
    enabled: !!workspaceId,
  });
}
