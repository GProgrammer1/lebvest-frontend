import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCompanyProfile,
  updateCompanyProfile,
  changeCompanyPassword,
  uploadCompanyProfileImage,
  getCompanyVerification,
  submitCompanyVerification,
  CompanyProfile,
  CompanyVerificationRequest,
  UpdateCompanyProfileRequest,
  ChangePasswordRequest,
} from "@/api/company";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

// Query keys
export const companyKeys = {
  all: ["company"] as const,
  profile: () => [...companyKeys.all, "profile"] as const,
  dashboard: () => [...companyKeys.all, "dashboard"] as const,
  verification: () => [...companyKeys.all, "verification"] as const,
  investors: (filters?: any) => [...companyKeys.all, "investors", filters] as const,
  investmentRequests: (status?: string) => [...companyKeys.all, "investment-requests", status] as const,
};

// Profile
export const useCompanyProfile = () => {
  return useQuery<CompanyProfile>({
    queryKey: companyKeys.profile(),
    queryFn: getCompanyProfile,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateCompanyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCompanyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.profile() });
      queryClient.invalidateQueries({ queryKey: companyKeys.dashboard() });
    },
  });
};

// Dashboard
export const useCompanyDashboard = () => {
  return useQuery<any>({
    queryKey: companyKeys.dashboard(),
    queryFn: async () => {
      const response = await apiClient.get<ResponsePayload>("/companies/me/dashboard");
      if (response.data.status === 200) {
        return response.data.data.dashboard;
      }
      throw new Error("Failed to fetch dashboard");
    },
    staleTime: 1000 * 60 * 2,
  });
};

// Verification
export const useCompanyVerification = () => {
  return useQuery<CompanyVerificationRequest | null>({
    queryKey: companyKeys.verification(),
    queryFn: getCompanyVerification,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubmitCompanyVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitCompanyVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.verification() });
      queryClient.invalidateQueries({ queryKey: companyKeys.profile() });
    },
  });
};

// Investors
export const useCompanyInvestors = (filters: {
  query?: string;
  minPortfolio?: string;
  riskLevel?: string;
  category?: string;
  page?: number;
  size?: number;
} = {}) => {
  return useQuery<any>({
    queryKey: companyKeys.investors(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.query) params.append("query", filters.query);
      if (filters.minPortfolio && filters.minPortfolio !== "all") {
        params.append("minPortfolio", filters.minPortfolio);
      }
      if (filters.riskLevel && filters.riskLevel !== "all") {
        params.append("riskLevel", filters.riskLevel.toUpperCase());
      }
      if (filters.category && filters.category !== "all") {
        params.append("category", filters.category.toUpperCase().replace(/\s+/g, "_"));
      }
      params.append("page", (filters.page || 0).toString());
      params.append("size", (filters.size || 20).toString());

      const response = await apiClient.get<ResponsePayload>(
        `/companies/me/investors?${params.toString()}`
      );
      if (response.data.status === 200) {
        return response.data.data;
      }
      throw new Error("Failed to fetch investors");
    },
    staleTime: 1000 * 60 * 2,
  });
};

// Investment Requests
export const useCompanyInvestmentRequests = (status: string = "ALL") => {
  return useQuery<any[]>({
    queryKey: companyKeys.investmentRequests(status),
    queryFn: async () => {
      const response = await apiClient.get<ResponsePayload>(
        `/companies/me/investment-requests?status=${status}`
      );
      if (response.data.status === 200) {
        return response.data.data.requests || [];
      }
      return [];
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useAcceptInvestmentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: number) => {
      const response = await apiClient.post<ResponsePayload>(
        `/companies/me/investment-requests/${requestId}/accept`,
        {}
      );
      if (response.data.status === 200) {
        return response.data;
      }
      throw new Error(response.data.message || "Failed to accept request");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.investmentRequests() });
    },
  });
};

export const useRejectInvestmentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: number; reason: string }) => {
      const response = await apiClient.post<ResponsePayload>(
        `/companies/me/investment-requests/${requestId}/reject`,
        { reason }
      );
      if (response.data.status === 200) {
        return response.data;
      }
      throw new Error(response.data.message || "Failed to reject request");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.investmentRequests() });
    },
  });
};

// Password
export const useChangeCompanyPassword = () => {
  return useMutation({
    mutationFn: changeCompanyPassword,
  });
};

// Profile Image Upload
export const useUploadCompanyProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadCompanyProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.profile() });
      queryClient.invalidateQueries({ queryKey: companyKeys.dashboard() });
    },
  });
};

