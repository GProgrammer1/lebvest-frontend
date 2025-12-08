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

export interface FetchUsersParams {
  role?: "INVESTOR" | "COMPANY" | "ADMIN";
  status?: "active" | "inactive" | "locked";
  search?: string;
  page?: number;
  size?: number;
}

export interface UsersResponse {
  users: any[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const fetchUsers = async (params: FetchUsersParams = {}): Promise<UsersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.role) queryParams.append("role", params.role);
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);
    queryParams.append("page", (params.page ?? 0).toString());
    queryParams.append("size", (params.size ?? 20).toString());

    const response = await apiClient.get<ResponsePayload>(
      `/admin/users?${queryParams.toString()}`,
      { timeout: 30000 }
    );
    
    console.log("fetchUsers response:", response.data);
    
    if (response.data.status !== 200) {
      throw new Error(response.data.message || "Failed to fetch users");
    }
    
    if (!response.data.data) {
      throw new Error("Invalid response format: missing data");
    }
    
    // Extract data from the Map structure
    const data = response.data.data;
    const result: UsersResponse = {
      users: data.users || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      currentPage: data.currentPage || 0,
      pageSize: data.pageSize || 20,
      hasNext: data.hasNext || false,
      hasPrevious: data.hasPrevious || false,
    };
    
    console.log("fetchUsers parsed result:", result);
    return result;
  } catch (error: any) {
    console.error("Error in fetchUsers:", error);
    throw error;
  }
};

export interface FetchProjectsParams {
  status?: "ALL" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  category?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface ProjectsResponse {
  projects: any[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const fetchProjects = async (params: FetchProjectsParams = {}): Promise<ProjectsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.category) queryParams.append("category", params.category);
    if (params.search) queryParams.append("search", params.search);
    queryParams.append("page", (params.page ?? 0).toString());
    queryParams.append("size", (params.size ?? 20).toString());

    const response = await apiClient.get<ResponsePayload>(
      `/admin/projects/pending?${queryParams.toString()}`
    );
    
    console.log("fetchProjects response:", response.data);
    
    if (response.data.status !== 200) {
      throw new Error(response.data.message || "Failed to fetch projects");
    }
    
    if (!response.data.data) {
      throw new Error("Invalid response format: missing data");
    }
    
    // Extract data from the Map structure
    const data = response.data.data;
    const result: ProjectsResponse = {
      projects: data.projects || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      currentPage: data.currentPage || 0,
      pageSize: data.pageSize || 20,
      hasNext: data.hasNext || false,
      hasPrevious: data.hasPrevious || false,
    };
    
    console.log("fetchProjects parsed result:", result);
    return result;
  } catch (error: any) {
    console.error("Error in fetchProjects:", error);
    throw error;
  }
};
