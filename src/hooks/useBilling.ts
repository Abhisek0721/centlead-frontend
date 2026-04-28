import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@lib/axios';
import { API_ROUTES } from '@constants/apiRoutes';
import type { ApiResponse, BillingPlan } from '@appTypes/index';

export const BILLING_KEY = 'billing';

export function useBillingPlans() {
  return useQuery({
    queryKey: [BILLING_KEY, 'plans'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<BillingPlan[]>>(
        API_ROUTES.BILLING.PLANS,
      );
      return data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
