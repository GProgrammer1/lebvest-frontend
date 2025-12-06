import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload, InvestmentSummary, FilterOptions } from "@/lib/types";
import { fetchSearchSuggestions } from "@/api/investment";

// Query keys
export const investmentKeys = {
  all: ["investments"] as const,
  lists: () => [...investmentKeys.all, "list"] as const,
  list: (filters?: any) => [...investmentKeys.lists(), filters] as const,
  details: () => [...investmentKeys.all, "detail"] as const,
  detail: (id: string | number) => [...investmentKeys.details(), id] as const,
  search: (query: string) => [...investmentKeys.all, "search", query] as const,
};

// Search investments
export const useSearchInvestments = (query: string, category?: string, riskLevel?: string) => {
  return useQuery<InvestmentSummary[]>({
    queryKey: investmentKeys.search(query),
    queryFn: async () => {
      if (!query.trim()) return [];
      const params = new URLSearchParams();
      params.append("q", query.trim());
      if (category) params.append("category", category);
      if (riskLevel) params.append("riskLevel", riskLevel);
      const response = await apiClient.get<ResponsePayload>(
        `/api/investments/search?${params.toString()}`
      );
      if (response.data.status === 200) {
        return response.data.data.investments || [];
      }
      return [];
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
};

// Search suggestions
export const useSearchSuggestions = (query: string) => {
  return useQuery<string[]>({
    queryKey: [...investmentKeys.all, "suggestions", query],
    queryFn: () => fetchSearchSuggestions(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Get investments with filters
export const useInvestments = (filters: {
  query?: string;
  category?: string;
  riskLevel?: string;
  minReturn?: number;
  location?: string;
  sector?: string;
  investmentType?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  size?: number;
  sort?: string;
} = {}) => {
  return useQuery<any>({
    queryKey: investmentKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.query) params.append("query", filters.query);
      if (filters.category) params.append("category", filters.category);
      if (filters.riskLevel) params.append("riskLevel", filters.riskLevel);
      if (filters.minReturn) params.append("minReturn", filters.minReturn.toString());
      if (filters.location) params.append("location", filters.location);
      if (filters.sector) params.append("sector", filters.sector);
      if (filters.investmentType) params.append("investmentType", filters.investmentType);
      if (filters.minAmount) params.append("minAmount", filters.minAmount.toString());
      if (filters.maxAmount) params.append("maxAmount", filters.maxAmount.toString());
      if (filters.page !== undefined) params.append("page", filters.page.toString());
      if (filters.size) params.append("size", filters.size.toString());
      if (filters.sort) params.append("sort", filters.sort);

      const response = await apiClient.get<ResponsePayload>(
        `/investments?${params.toString()}`
      );
      if (response.data.status === 200) {
        return response.data.data;
      }
      throw new Error("Failed to fetch investments");
    },
    staleTime: 1000 * 60 * 2,
  });
};

// Get investment detail
export const useInvestmentDetail = (id: string | number) => {
  return useQuery<any>({
    queryKey: investmentKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<ResponsePayload>(`/investments/${id}`);
      if (response.data.status === 200) {
        return response.data.data.investment;
      }
      throw new Error("Failed to fetch investment");
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Create investment request
export const useCreateInvestmentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ investmentId, amount }: { investmentId: number; amount: number }) => {
      const response = await apiClient.post<ResponsePayload>(
        `/investments/${investmentId}/invest`,
        { amount }
      );
      if (response.data.status === 201) {
        return response.data;
      }
      throw new Error(response.data.message || "Failed to create investment request");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentKeys.all });
    },
  });
};

// Toggle watchlist
export const useToggleWatchlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ investmentId, isWatchlisted }: { investmentId: number; isWatchlisted: boolean }) => {
      if (isWatchlisted) {
        await apiClient.delete(`/investments/${investmentId}/watchlist`);
      } else {
        await apiClient.post(`/investments/${investmentId}/watchlist`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentKeys.all });
    },
  });
};

