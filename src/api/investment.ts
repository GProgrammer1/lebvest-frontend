import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

export const fetchSearchSuggestions = async (query: string): Promise<string[]> => {
  const response = await apiClient.get<ResponsePayload<{ suggestions: string[] }>>(
    "/api/investments/search/suggestions",
    { params: { q: query } }
  );
  return response.data.data.suggestions;
};
