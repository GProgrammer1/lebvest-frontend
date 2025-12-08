import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminAnalytics,
  fetchPendingCompanyApprovals,
  fetchPendingInvestorApprovals,
  updateInvestorKyc,
  fetchUsers,
  fetchProjects,
  AdminAnalyticsDto,
  InvestorKycUpdateRequest,
  FetchUsersParams,
  FetchProjectsParams,
} from "@/api/admin";

export const adminKeys = {
  all: ["admin"] as const,
  analytics: () => [...adminKeys.all, "analytics"] as const,
  companyApprovals: (page: number, size: number) => [...adminKeys.all, "company-approvals", page, size] as const,
  investorApprovals: (page: number, size: number) => [...adminKeys.all, "investor-approvals", page, size] as const,
  users: (params: FetchUsersParams) => [...adminKeys.all, "users", params] as const,
  projects: (params: FetchProjectsParams) => [...adminKeys.all, "projects", params] as const,
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

export const useUsers = (params: FetchUsersParams = {}) => {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => fetchUsers(params),
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Wait 1 second between retries
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Always refetch on mount
  });
};

export const useProjects = (params: FetchProjectsParams = {}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: adminKeys.projects(params),
    queryFn: () => fetchProjects(params),
    enabled: options?.enabled !== false, // Default to true, but can be disabled
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Wait 1 second between retries
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists (use cache)
  });
};
