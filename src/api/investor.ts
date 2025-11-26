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

export const fetchInvestorInvestments =
  async (): Promise<InvestorInvestmentSummary[]> => {
    const response = await apiClient.get<ApiResponse<InvestmentsResponse>>(
      "/investors/me/investments"
    );
    return response.data.data.investments;
  };

export const fetchInvestorWatchlist = async (): Promise<InvestmentSummary[]> => {
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

