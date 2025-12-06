import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

export interface AdminAnalyticsDto {
  totalInvestors: number;
  totalCompanies: number;
  totalInvestments: number;
  totalInvestedToday: number;
  totalInvestedThisMonth: number;
  topProjects: Array<{
    id: number;
    title: string;
    companyName: string;
    raisedAmount: number;
    targetAmount: number;
    investorCount: number;
  }>;
  dailyInvestments: Record<string, number>;
  investmentsByCategory: Record<string, number>;
  investmentsByRiskLevel: Record<string, number>;
  pendingCompanyApprovals: number;
  pendingInvestorApprovals: number;
  pendingPayouts: number;
  pendingReturns: number;
}

export interface InvestorKycUpdateRequest {
  classification: "RETAIL" | "QUALIFIED" | "INSTITUTIONAL";
  kycNotes?: string;
}

export const fetchAdminAnalytics = async (): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get<ResponsePayload<{ analytics: AdminAnalyticsDto }>>(
    "/admin/analytics"
  );
  return response.data.data.analytics;
};

export const fetchPendingCompanyApprovals = async (
  page: number = 0,
  size: number = 20
): Promise<{ requests: any[]; totalElements: number; totalPages: number; currentPage: number }> => {
  const response = await apiClient.get<ResponsePayload<any>>(
    "/admin/queues/company-approvals",
    { params: { page, size } }
  );
  return response.data.data;
};

export const fetchPendingInvestorApprovals = async (
  page: number = 0,
  size: number = 20
): Promise<{ investors: any[]; totalElements: number; totalPages: number; currentPage: number }> => {
  const response = await apiClient.get<ResponsePayload<any>>(
    "/admin/queues/investor-approvals",
    { params: { page, size } }
  );
  return response.data.data;
};

export const updateInvestorKyc = async (
  investorId: number,
  request: InvestorKycUpdateRequest
): Promise<any> => {
  const response = await apiClient.put<ResponsePayload<{ investor: any }>>(
    `/admin/investors/${investorId}/kyc`,
    request
  );
  return response.data.data.investor;
};
