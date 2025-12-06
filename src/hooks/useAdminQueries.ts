import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminAnalytics,
  fetchPendingCompanyApprovals,
  fetchPendingInvestorApprovals,
  updateInvestorKyc,
  AdminAnalyticsDto,
  InvestorKycUpdateRequest,
} from "@/api/admin";

export const adminKeys = {
  all: ["admin"] as const,
  analytics: () => [...adminKeys.all, "analytics"] as const,
  companyApprovals: (page: number, size: number) => [...adminKeys.all, "company-approvals", page, size] as const,
  investorApprovals: (page: number, size: number) => [...adminKeys.all, "investor-approvals", page, size] as const,
};

export const useAdminAnalytics = () => {
  return useQuery<AdminAnalyticsDto>({
    queryKey: adminKeys.analytics(),
    queryFn: fetchAdminAnalytics,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePendingCompanyApprovals = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: adminKeys.companyApprovals(page, size),
    queryFn: () => fetchPendingCompanyApprovals(page, size),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const usePendingInvestorApprovals = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: adminKeys.investorApprovals(page, size),
    queryFn: () => fetchPendingInvestorApprovals(page, size),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useUpdateInvestorKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ investorId, request }: { investorId: number; request: InvestorKycUpdateRequest }) =>
      updateInvestorKyc(investorId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.investorApprovals(0, 20) });
    },
  });
};
