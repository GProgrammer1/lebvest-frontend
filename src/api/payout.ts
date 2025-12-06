import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

export interface PayoutRequestDto {
  id: number;
  investorId: number;
  investorName: string;
  investorEmail: string;
  investmentId: number;
  investmentTitle: string;
  companyId: number;
  companyName: string;
  investorInvestmentId: number;
  amount: number;
  expectedReturn: number;
  status: "PENDING" | "SUBMITTED" | "VERIFYING" | "APPROVED" | "REJECTED" | "COMPLETED";
  payoutEvidenceUrl?: string;
  adminNotes?: string;
  rejectionReason?: string;
  stripePayoutId?: string;
  submittedAt?: string;
  approvedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutHistoryDto {
  id: number;
  investorId: number;
  investorName: string;
  investmentId: number;
  investmentTitle: string;
  payoutRequestId: number;
  principalAmount: number;
  returnAmount: number;
  totalPayout: number;
  payoutMethod?: string;
  transactionId?: string;
  completedAt: string;
  createdAt: string;
}

export interface ApprovePayoutRequest {
  adminNotes?: string;
}

export interface RejectPayoutRequest {
  rejectionReason: string;
}

// Investor endpoints
export const createPayoutRequest = async (investorInvestmentId: number): Promise<PayoutRequestDto> => {
  const response = await apiClient.post<ResponsePayload<{ payoutRequest: PayoutRequestDto }>>(
    `/api/investors/me/payouts/request/${investorInvestmentId}`
  );
  return response.data.data.payoutRequest;
};

export const fetchInvestorPayouts = async (status?: string): Promise<PayoutRequestDto[]> => {
  const params = status ? { status } : {};
  const response = await apiClient.get<ResponsePayload<{ payoutRequests: PayoutRequestDto[] }>>(
    "/api/investors/me/payouts",
    { params }
  );
  return response.data.data.payoutRequests;
};

export const fetchInvestorPayoutHistory = async (): Promise<PayoutHistoryDto[]> => {
  const response = await apiClient.get<ResponsePayload<{ payoutHistory: PayoutHistoryDto[] }>>(
    "/api/investors/me/payouts/history"
  );
  return response.data.data.payoutHistory;
};

// Company endpoints
export const fetchCompanyPayouts = async (status?: string): Promise<PayoutRequestDto[]> => {
  const params = status ? { status } : {};
  const response = await apiClient.get<ResponsePayload<{ payoutRequests: PayoutRequestDto[] }>>(
    "/api/companies/me/payouts",
    { params }
  );
  return response.data.data.payoutRequests;
};

export const submitPayoutEvidence = async (
  payoutRequestId: number,
  evidenceFile: File
): Promise<PayoutRequestDto> => {
  const formData = new FormData();
  formData.append("evidence", evidenceFile);
  const response = await apiClient.post<ResponsePayload<{ payoutRequest: PayoutRequestDto }>>(
    `/api/companies/me/payouts/${payoutRequestId}/submit-evidence`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data.payoutRequest;
};

// Admin endpoints
export const fetchAdminPayouts = async (status?: string): Promise<PayoutRequestDto[]> => {
  const params = status ? { status } : {};
  const response = await apiClient.get<ResponsePayload<{ payoutRequests: PayoutRequestDto[] }>>(
    "/api/admin/payouts",
    { params }
  );
  return response.data.data.payoutRequests;
};

export const approvePayout = async (
  payoutRequestId: number,
  request?: ApprovePayoutRequest
): Promise<PayoutRequestDto> => {
  const response = await apiClient.post<ResponsePayload<{ payoutRequest: PayoutRequestDto }>>(
    `/api/admin/payouts/${payoutRequestId}/approve`,
    request || {}
  );
  return response.data.data.payoutRequest;
};

export const rejectPayout = async (
  payoutRequestId: number,
  request: RejectPayoutRequest
): Promise<PayoutRequestDto> => {
  const response = await apiClient.post<ResponsePayload<{ payoutRequest: PayoutRequestDto }>>(
    `/api/admin/payouts/${payoutRequestId}/reject`,
    request
  );
  return response.data.data.payoutRequest;
};
