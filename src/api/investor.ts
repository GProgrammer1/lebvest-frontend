import apiClient from "@/api/common/apiClient";
import {
  ApiResponse,
  InvestorDashboard,
  InvestorGoalSummary,
  InvestorInvestmentSummary,
  InvestmentSummary,
} from "@/lib/types";

interface DashboardResponse {
  dashboard: InvestorDashboard;
}

interface InvestmentsResponse {
  investments: InvestorInvestmentSummary[];
}

interface WatchlistResponse {
  watchlist: InvestmentSummary[];
}

interface GoalsResponse {
  goals: InvestorGoalSummary[];
}

export const fetchInvestorDashboard = async (): Promise<InvestorDashboard> => {
  const response = await apiClient.get<ApiResponse<DashboardResponse>>(
    "/investors/me/dashboard"
  );
  return response.data.data.dashboard;
};

export const fetchInvestorInvestments = async (): Promise<
  InvestorInvestmentSummary[]
> => {
  const response = await apiClient.get<ApiResponse<InvestmentsResponse>>(
    "/investors/me/investments"
  );
  return response.data.data.investments;
};

export const fetchInvestorWatchlist = async (): Promise<
  InvestmentSummary[]
> => {
  const response = await apiClient.get<ApiResponse<WatchlistResponse>>(
    "/investors/me/watchlist"
  );
  return response.data.data.watchlist;
};

export const fetchInvestorGoals = async (): Promise<InvestorGoalSummary[]> => {
  const response = await apiClient.get<ApiResponse<GoalsResponse>>(
    "/investors/me/goals"
  );
  return response.data.data.goals;
};

interface ProfileResponse {
  profile: InvestorProfileDto;
}

interface PreferencesResponse {
  preferences: InvestorPreferenceDto;
}

interface NotificationsResponse {
  notifications: InvestorNotificationDto[];
}

interface NotificationResponse {
  notification: InvestorNotificationDto;
}

export interface InvestorProfileDto {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  imageUrl?: string | null;
  portfolioValue: number;
  totalInvested: number;
  totalReturns: number;
  profilePublic?: boolean;
}

export interface InvestorPreferenceDto {
  categories: string[];
  riskLevels: string[];
  locations: string[];
}

export interface InvestorNotificationDto {
  id: number;
  type: string | null;
  title: string;
  message: string;
  notifiedAt: string;
  read: boolean;
  relatedInvestmentId?: number | null;
}

export interface UpdateInvestorProfileRequest {
  name?: string;
  email?: string;
  bio?: string;
  imageUrl?: string;
  profilePublic?: boolean;
}

export interface UpdateInvestorPreferenceRequest {
  categories: string[];
  riskLevels: string[];
  locations: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const fetchInvestorProfile = async (): Promise<InvestorProfileDto> => {
  const response = await apiClient.get<ApiResponse<ProfileResponse>>(
    "/investors/me/profile"
  );
  return response.data.data.profile;
};

export const updateInvestorProfile = async (
  request: UpdateInvestorProfileRequest
): Promise<InvestorProfileDto> => {
  const response = await apiClient.put<ApiResponse<ProfileResponse>>(
    "/investors/me/profile",
    request
  );
  return response.data.data.profile;
};

export const fetchInvestorPreferences =
  async (): Promise<InvestorPreferenceDto> => {
    const response = await apiClient.get<ApiResponse<PreferencesResponse>>(
      "/investors/me/preferences"
    );
    return response.data.data.preferences;
  };

export const updateInvestorPreferences = async (
  request: UpdateInvestorPreferenceRequest
): Promise<InvestorPreferenceDto> => {
  const response = await apiClient.put<ApiResponse<PreferencesResponse>>(
    "/investors/me/preferences",
    request
  );
  return response.data.data.preferences;
};

export const fetchInvestorNotifications = async (): Promise<
  InvestorNotificationDto[]
> => {
  const response = await apiClient.get<ApiResponse<NotificationsResponse>>(
    "/investors/me/notifications"
  );
  return response.data.data.notifications;
};

export const markNotificationAsRead = async (
  notificationId: number
): Promise<InvestorNotificationDto> => {
  const response = await apiClient.put<ApiResponse<NotificationResponse>>(
    `/investors/me/notifications/${notificationId}/read`
  );
  return response.data.data.notification;
};

export const changePassword = async (
  request: ChangePasswordRequest
): Promise<void> => {
  await apiClient.put<ApiResponse<{}>>(
    "/investors/me/change-password",
    request
  );
};

export const uploadProfileImage = async (
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  
  // Get token to ensure it's available
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication required. Please sign in again.');
  }
  
  const response = await apiClient.post<ApiResponse<{ imageUrl: string }>>(
    "/investors/me/profile-image",
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary for multipart/form-data
      }
    }
  );
  return response.data.data.imageUrl;
};
