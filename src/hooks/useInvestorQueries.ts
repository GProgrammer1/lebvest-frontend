import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchInvestorDashboard,
  fetchInvestorInvestments,
  fetchInvestorWatchlist,
  fetchInvestorGoals,
  fetchInvestorProfile,
  updateInvestorProfile,
  fetchInvestorPreferences,
  updateInvestorPreferences,
  fetchInvestorNotifications,
  markNotificationAsRead,
  changePassword,
  uploadProfileImage,
  InvestorProfileDto,
  InvestorPreferenceDto,
  InvestorNotificationDto,
  UpdateInvestorProfileRequest,
  UpdateInvestorPreferenceRequest,
  ChangePasswordRequest,
} from "@/api/investor";
import { InvestorDashboard, InvestorInvestmentSummary, InvestmentSummary, InvestorGoalSummary } from "@/lib/types";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

// Query keys
export const investorKeys = {
  all: ["investor"] as const,
  dashboard: () => [...investorKeys.all, "dashboard"] as const,
  investments: () => [...investorKeys.all, "investments"] as const,
  watchlist: () => [...investorKeys.all, "watchlist"] as const,
  goals: () => [...investorKeys.all, "goals"] as const,
  profile: () => [...investorKeys.all, "profile"] as const,
  preferences: () => [...investorKeys.all, "preferences"] as const,
  notifications: () => [...investorKeys.all, "notifications"] as const,
  acceptedRequests: () => [...investorKeys.all, "accepted-requests"] as const,
};

// Dashboard
export const useInvestorDashboard = () => {
  return useQuery<InvestorDashboard>({
    queryKey: investorKeys.dashboard(),
    queryFn: fetchInvestorDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Investments
export const useInvestorInvestments = () => {
  return useQuery<InvestorInvestmentSummary[]>({
    queryKey: investorKeys.investments(),
    queryFn: fetchInvestorInvestments,
    staleTime: 1000 * 60 * 2,
  });
};

// Watchlist
export const useInvestorWatchlist = () => {
  return useQuery<InvestmentSummary[]>({
    queryKey: investorKeys.watchlist(),
    queryFn: fetchInvestorWatchlist,
    staleTime: 1000 * 60 * 2,
  });
};

// Goals
export const useInvestorGoals = () => {
  return useQuery<InvestorGoalSummary[]>({
    queryKey: investorKeys.goals(),
    queryFn: fetchInvestorGoals,
    staleTime: 1000 * 60 * 2,
  });
};

// Profile
export const useInvestorProfile = () => {
  return useQuery<InvestorProfileDto>({
    queryKey: investorKeys.profile(),
    queryFn: fetchInvestorProfile,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateInvestorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInvestorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investorKeys.profile() });
      queryClient.invalidateQueries({ queryKey: investorKeys.dashboard() });
    },
  });
};

// Preferences
export const useInvestorPreferences = () => {
  return useQuery<InvestorPreferenceDto>({
    queryKey: investorKeys.preferences(),
    queryFn: fetchInvestorPreferences,
    staleTime: 1000 * 60 * 10,
  });
};

export const useUpdateInvestorPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInvestorPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investorKeys.preferences() });
      queryClient.invalidateQueries({ queryKey: investorKeys.dashboard() });
    },
  });
};

// Notifications
export const useInvestorNotifications = () => {
  return useQuery<InvestorNotificationDto[]>({
    queryKey: investorKeys.notifications(),
    queryFn: fetchInvestorNotifications,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investorKeys.notifications() });
    },
  });
};

// Password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

// Profile Image Upload
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investorKeys.profile() });
      queryClient.invalidateQueries({ queryKey: investorKeys.dashboard() });
    },
  });
};

// Accepted Investment Requests
export const useAcceptedInvestmentRequests = () => {
  return useQuery<any[]>({
    queryKey: investorKeys.acceptedRequests(),
    queryFn: async () => {
      const response = await apiClient.get<ResponsePayload>(
        "/investors/me/investment-requests/accepted"
      );
      if (response.data.status === 200) {
        const allRequests = response.data.data.requests || [];
        // Filter out paid requests - only show accepted but not yet paid
        return allRequests.filter((request: any) => request.status !== "PAID");
      }
      return [];
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

