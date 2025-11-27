import apiClient from './common/apiClient';
import { ApiResponse } from '@/lib/types';
import { Investment } from '@/lib/types';

// Request DTOs
export interface CreateInvestmentRequest {
  title: string;
  description: string;
  category: string;
  riskLevel: string;
  expectedReturn: number;
  minInvestment: number;
  targetAmount: number;
  location: string;
  investmentType: string;
  durationMonths: number;
  deadline: string; // ISO date string
  imageUrl?: string;
  fundingStage?: string;
  highlights?: string[];
}

export interface UpdateInvestmentRequest {
  title?: string;
  description?: string;
  category?: string;
  riskLevel?: string;
  expectedReturn?: number;
  minInvestment?: number;
  targetAmount?: number;
  location?: string;
  investmentType?: string;
  durationMonths?: number;
  deadline?: string; // ISO date string
  imageUrl?: string;
  fundingStage?: string;
  highlights?: string[];
}

export interface CreateInvestmentUpdateRequest {
  updateDate: string; // ISO date string
  title: string;
  content: string;
}

export interface InvestmentDetail {
  investment: Investment;
  investors: {
    investorId: string;
    investorName: string;
    investorEmail: string;
    investedAmount: number;
    currentValue: number;
    investedAt: string; // ISO date string
  }[];
}

export interface InvestmentStats {
  investmentId: string;
  investmentTitle: string;
  targetAmount: number;
  raisedAmount: number;
  progressPercentage: number;
  totalInvestors: number;
  averageInvestmentAmount: number;
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
}

// API Functions
export const createInvestment = async (
  request: CreateInvestmentRequest
): Promise<Investment> => {
  const response = await apiClient.post<ApiResponse<{ investment: Investment }>>(
    '/companies/me/investments',
    request
  );
  return response.data.data.investment;
};

export const updateInvestment = async (
  investmentId: string,
  request: UpdateInvestmentRequest
): Promise<Investment> => {
  const response = await apiClient.put<ApiResponse<{ investment: Investment }>>(
    `/companies/me/investments/${investmentId}`,
    request
  );
  return response.data.data.investment;
};

export const getInvestmentDetail = async (
  investmentId: string
): Promise<InvestmentDetail> => {
  const response = await apiClient.get<ApiResponse<{ investmentDetail: InvestmentDetail }>>(
    `/companies/me/investments/${investmentId}`
  );
  return response.data.data.investmentDetail;
};

export const createInvestmentUpdate = async (
  investmentId: string,
  request: CreateInvestmentUpdateRequest
): Promise<{ date: string; title: string; content: string }> => {
  const response = await apiClient.post<ApiResponse<{ update: { date: string; title: string; content: string } }>>(
    `/companies/me/investments/${investmentId}/updates`,
    request
  );
  return response.data.data.update;
};

export const getInvestmentStats = async (
  investmentId: string
): Promise<InvestmentStats> => {
  const response = await apiClient.get<ApiResponse<{ stats: InvestmentStats }>>(
    `/investments/${investmentId}/stats`
  );
  return response.data.data.stats;
};

