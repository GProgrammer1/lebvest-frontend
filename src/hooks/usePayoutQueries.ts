import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPayoutRequest,
  fetchInvestorPayouts,
  fetchInvestorPayoutHistory,
  fetchCompanyPayouts,
  submitPayoutEvidence,
  fetchAdminPayouts,
  approvePayout,
  rejectPayout,
  PayoutRequestDto,
  PayoutHistoryDto,
  ApprovePayoutRequest,
  RejectPayoutRequest,
} from "@/api/payout";

// Query keys
export const payoutKeys = {
  all: ["payout"] as const,
  investor: {
    all: () => [...payoutKeys.all, "investor"] as const,
    list: (status?: string) => [...payoutKeys.investor.all(), "list", status] as const,
    history: () => [...payoutKeys.investor.all(), "history"] as const,
  },
  company: {
    all: () => [...payoutKeys.all, "company"] as const,
    list: (status?: string) => [...payoutKeys.company.all(), "list", status] as const,
  },
  admin: {
    all: () => [...payoutKeys.all, "admin"] as const,
    list: (status?: string) => [...payoutKeys.admin.all(), "list", status] as const,
  },
};

// Investor hooks
export const useInvestorPayouts = (status?: string) => {
  return useQuery<PayoutRequestDto[]>({
    queryKey: payoutKeys.investor.list(status),
    queryFn: () => fetchInvestorPayouts(status),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useInvestorPayoutHistory = () => {
  return useQuery<PayoutHistoryDto[]>({
    queryKey: payoutKeys.investor.history(),
    queryFn: fetchInvestorPayoutHistory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreatePayoutRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayoutRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payoutKeys.investor.all() });
    },
  });
};

// Company hooks
export const useCompanyPayouts = (status?: string) => {
  return useQuery<PayoutRequestDto[]>({
    queryKey: payoutKeys.company.list(status),
    queryFn: () => fetchCompanyPayouts(status),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useSubmitPayoutEvidence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payoutRequestId, evidenceFile }: { payoutRequestId: number; evidenceFile: File }) =>
      submitPayoutEvidence(payoutRequestId, evidenceFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payoutKeys.company.all() });
    },
  });
};

// Admin hooks
export const useAdminPayouts = (status?: string) => {
  return useQuery<PayoutRequestDto[]>({
    queryKey: payoutKeys.admin.list(status),
    queryFn: () => fetchAdminPayouts(status),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useApprovePayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payoutRequestId, request }: { payoutRequestId: number; request?: ApprovePayoutRequest }) =>
      approvePayout(payoutRequestId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payoutKeys.admin.all() });
      queryClient.invalidateQueries({ queryKey: payoutKeys.company.all() });
      queryClient.invalidateQueries({ queryKey: payoutKeys.investor.all() });
    },
  });
};

export const useRejectPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payoutRequestId, request }: { payoutRequestId: number; request: RejectPayoutRequest }) =>
      rejectPayout(payoutRequestId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payoutKeys.admin.all() });
      queryClient.invalidateQueries({ queryKey: payoutKeys.company.all() });
      queryClient.invalidateQueries({ queryKey: payoutKeys.investor.all() });
    },
  });
};
