import axios from 'axios';

// Using DuckDuckGo Instant Answer API (no API key required) or you can use Google Custom Search API
const DUCKDUCKGO_API = 'https://api.duckduckgo.com/?q={query}&format=json&no_html=1&skip_disambig=1';

export interface SearchResult {
  title: string;
  snippet: string;
  url?: string;
}

export const searchWeb = async (query: string): Promise<SearchResult[]> => {
  try {
    // Try DuckDuckGo first (no API key needed)
    const response = await axios.get(DUCKDUCKGO_API.replace('{query}', encodeURIComponent(query)), {
      timeout: 10000,
    });

    const results: SearchResult[] = [];
    
    // DuckDuckGo returns AbstractText and RelatedTopics
    if (response.data.AbstractText) {
      results.push({
        title: response.data.Heading || query,
        snippet: response.data.AbstractText,
        url: response.data.AbstractURL,
      });
    }

    // Add related topics
    if (response.data.RelatedTopics && Array.isArray(response.data.RelatedTopics)) {
      response.data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
        if (topic.Text) {
          results.push({
            title: topic.Text.split(' - ')[0] || query,
            snippet: topic.Text,
            url: topic.FirstURL,
          });
        }
      });
    }

    return results.length > 0 ? results : [];
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
};

// Alternative: Use Google Custom Search API (requires API key)
export const searchWebWithGoogle = async (query: string, apiKey?: string, searchEngineId?: string): Promise<SearchResult[]> => {
  if (!apiKey || !searchEngineId) {
    // Fallback to DuckDuckGo if Google API not configured
    return searchWeb(query);
  }

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: searchEngineId,
        q: query,
        num: 5,
      },
      timeout: 10000,
    });

    if (response.data.items) {
      return response.data.items.map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        url: item.link,
      }));
    }

    return [];
  } catch (error) {
    console.error('Google search error:', error);
    // Fallback to DuckDuckGo
    return searchWeb(query);
  }
};

