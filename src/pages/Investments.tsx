
import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvestmentCard from "@/components/InvestmentCard";
import InvestmentFilters from "@/components/InvestmentFilters";
import { FilterOptions, Investment } from "@/lib/types";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Investments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState(""); // Active search query used for API calls
  const [searchSuggestions, setSearchSuggestions] = useState<Investment[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState("created:DESC");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Read search query from URL on mount
  // Note: Initial fetch of all investments happens automatically via the useEffect below
  // when activeSearchQuery is empty (no search) and filters are empty (no filters)
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
      setActiveSearchQuery(urlSearchQuery);
      // Clear the URL parameter after reading it
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search suggestions using new suggestions endpoint
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        // First try the new suggestions endpoint
        try {
          const suggestionsResponse = await apiClient.get<ResponsePayload>(
            `/api/investments/search/suggestions?q=${encodeURIComponent(searchQuery.trim())}`
          );
          if (suggestionsResponse.data.status === 200 && suggestionsResponse.data.data.suggestions) {
            // If we get text suggestions, use them to search
            const suggestionText = suggestionsResponse.data.data.suggestions[0];
            if (suggestionText) {
              const params = new URLSearchParams();
              params.append("q", suggestionText);
              params.append("page", "0");
              params.append("size", "5");
              const response = await apiClient.get<ResponsePayload>(`/investments/search?${params.toString()}`);
              
              if (response.data.status === 200) {
                const data = response.data.data;
                const mappedSuggestions: Investment[] = (data.investments || []).map((inv: any) => ({
            id: inv.id?.toString() || "",
            title: inv.title || "",
            companyName: inv.companyName || "",
            description: inv.description || "",
            category: inv.category?.toLowerCase() || "",
            sector: inv.sector?.toLowerCase() || "",
            location: inv.location?.toLowerCase().replace(/\s+/g, '_') || "",
            riskLevel: inv.riskLevel?.toLowerCase() || "medium",
            expectedReturn: inv.expectedReturn || 0,
            minInvestment: Number(inv.minInvestment || 0),
            targetAmount: Number(inv.targetAmount || 0),
            raisedAmount: Number(inv.raisedAmount || 0),
            deadline: inv.deadline || "",
            imageUrl: inv.imageUrl || "",
            investmentType: inv.investmentType?.toLowerCase() || "",
            duration: inv.durationMonths || 0,
            fundingStage: inv.fundingStage || "",
            highlights: inv.highlights || [],
            financials: [],
            team: [],
            documents: [],
            updates: [],
            aiPrediction: {
              profitPrediction: inv.expectedReturn || 0,
              confidenceScore: 75,
              riskAssessment: `This investment has a ${inv.riskLevel?.toLowerCase() || 'medium'} risk level.`
            }
          }));
          setSearchSuggestions(mappedSuggestions);
          setShowSuggestions(true);
          return;
        }
      } catch (suggestionError) {
        // Fallback to regular search if suggestions endpoint fails
        console.log("Suggestions endpoint not available, using regular search");
      }
      
      // Fallback to regular search
      try {
        const params = new URLSearchParams();
        params.append("q", searchQuery.trim());
        params.append("page", "0");
        params.append("size", "5");
        const response = await apiClient.get<ResponsePayload>(`/investments/search?${params.toString()}`);
        
        if (response.data.status === 200) {
          const data = response.data.data;
          const mappedSuggestions: Investment[] = (data.investments || []).map((inv: any) => ({
            id: inv.id?.toString() || "",
            title: inv.title || "",
            companyName: inv.companyName || "",
            description: inv.description || "",
            category: inv.category?.toLowerCase() || "",
            sector: inv.sector?.toLowerCase() || "",
            location: inv.location?.toLowerCase().replace(/\s+/g, '_') || "",
            riskLevel: inv.riskLevel?.toLowerCase() || "medium",
            expectedReturn: inv.expectedReturn || 0,
            minInvestment: Number(inv.minInvestment || 0),
            targetAmount: Number(inv.targetAmount || 0),
            raisedAmount: Number(inv.raisedAmount || 0),
            deadline: inv.deadline || "",
            imageUrl: inv.imageUrl || "",
            investmentType: inv.investmentType?.toLowerCase() || "",
            duration: inv.durationMonths || 0,
            fundingStage: inv.fundingStage || "",
            highlights: inv.highlights || [],
            financials: [],
            team: [],
            documents: [],
            updates: [],
            aiPrediction: {
              profitPrediction: inv.expectedReturn || 0,
              confidenceScore: 75,
              riskAssessment: `This investment has a ${inv.riskLevel?.toLowerCase() || 'medium'} risk level.`
            }
          }));
          setSearchSuggestions(mappedSuggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSearchSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const fetchInvestments = async () => {
    setLoading(true);
    try {
      let response;
      
      if (activeSearchQuery.trim()) {
        // Use search endpoint
        const params = new URLSearchParams();
        params.append("q", activeSearchQuery.trim());
        params.append("page", page.toString());
        params.append("size", "20");
        console.log("Searching investments with query:", activeSearchQuery.trim());
        response = await apiClient.get<ResponsePayload>(`/investments/search?${params.toString()}`);
      } else {
        // Use filtered endpoint - when no filters, this returns all investments
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category.toUpperCase().replace(/\s+/g, '_'));
        if (filters.riskLevel) params.append("riskLevel", filters.riskLevel.toUpperCase());
        if (filters.minReturn) params.append("minReturn", filters.minReturn.toString());
        if (filters.location) params.append("location", filters.location.toUpperCase().replace(/\s+/g, '_'));
        if (filters.sector) params.append("sector", filters.sector.toUpperCase().replace(/\s+/g, '_'));
        if (filters.investmentType) params.append("investmentType", filters.investmentType.toUpperCase().replace(/\s+/g, '_'));
        if (filters.minAmount) params.append("minAmount", filters.minAmount.toString());
        if (filters.maxAmount) params.append("maxAmount", filters.maxAmount.toString());
        params.append("sort", sort);
        params.append("page", page.toString());
        params.append("size", "20");
        
        const url = `/investments?${params.toString()}`;
        console.log("Fetching all investments:", url);
        response = await apiClient.get<ResponsePayload>(url);
      }
      
      if (response.data.status === 200) {
        const data = response.data.data;
        // Map backend DTO to frontend Investment type
        const mappedInvestments: Investment[] = (data.investments || []).map((inv: any) => ({
          id: inv.id?.toString() || "",
          title: inv.title || "",
          companyName: inv.companyName || "",
          description: inv.description || "",
          category: inv.category?.toLowerCase() || "",
          sector: inv.sector?.toLowerCase() || "",
          location: inv.location?.toLowerCase().replace(/\s+/g, '_') || "",
          riskLevel: inv.riskLevel?.toLowerCase() || "medium",
          expectedReturn: inv.expectedReturn || 0,
          minInvestment: Number(inv.minInvestment || 0),
          targetAmount: Number(inv.targetAmount || 0),
          raisedAmount: Number(inv.raisedAmount || 0),
          deadline: inv.deadline || "",
          imageUrl: inv.imageUrl || "",
          investmentType: inv.investmentType?.toLowerCase() || "",
          duration: inv.durationMonths || 0,
          fundingStage: inv.fundingStage || "",
          highlights: inv.highlights || [],
          financials: [],
          team: [],
          documents: [],
          updates: [],
          aiPrediction: {
            profitPrediction: inv.expectedReturn || 0,
            confidenceScore: 75,
            riskAssessment: `This investment has a ${inv.riskLevel?.toLowerCase() || 'medium'} risk level.`
          }
        }));
        
        setInvestments(mappedInvestments);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        console.log(`Loaded ${mappedInvestments.length} investments (page ${page + 1} of ${data.totalPages || 1}, total: ${data.totalElements || 0})`);
      } else {
        console.warn("Unexpected response status:", response.data.status);
      }
    } catch (error: any) {
      console.error("Error fetching investments:", error);
      console.error("Error details:", error.response?.data || error.message);
      // Set empty state on error
      setInvestments([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch investments when dependencies change
  useEffect(() => {
    console.log("Fetching investments - activeSearchQuery:", activeSearchQuery, "filters:", filters, "page:", page, "sort:", sort);
    fetchInvestments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSearchQuery, filters, page, sort]);

  // Reset to first page when filters or search change
  useEffect(() => {
    setPage(0);
  }, [filters, activeSearchQuery]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Clear search when filters are applied
    if (Object.keys(newFilters).length > 0) {
      setSearchQuery("");
      setActiveSearchQuery("");
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    setActiveSearchQuery(query);
    setPage(0);
    setShowSuggestions(false);
    // Clear filters when search is used
    if (query) {
      setFilters({});
    }
  };

  const handleSuggestionClick = (investment: Investment) => {
    setSearchQuery(investment.title);
    setActiveSearchQuery(investment.title);
    setPage(0);
    setShowSuggestions(false);
    setFilters({});
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
    setPage(0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="bg-lebanese-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Browse Investment Opportunities</h1>
          <p className="text-xl">Discover and filter through a wide range of Lebanese investment options.</p>
        </div>
      </div>
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="lg:w-1/4">
              <InvestmentFilters onFilterChange={handleFilterChange} />
            </div>
            
            {/* Investment listings */}
            <div className="lg:w-3/4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-semibold">All Investments</h2>
                  <p className="text-gray-500">Showing {investments.length} of {totalElements} opportunities</p>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto relative">
                  <div className="relative flex-grow md:flex-grow-0 w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 z-10" />
                    <Input
                      ref={searchInputRef}
                      placeholder="Search investments..."
                      className="pl-9 pr-9 w-full"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => {
                        if (searchSuggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch(e);
                        } else if (e.key === 'Escape') {
                          setShowSuggestions(false);
                        }
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto"
                      >
                        {searchSuggestions.map((investment) => (
                          <Link
                            key={investment.id}
                            to={`/investments/${investment.id}`}
                            onClick={() => handleSuggestionClick(investment)}
                            className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={investment.imageUrl && investment.imageUrl.trim() !== ""
                                  ? investment.imageUrl
                                  : "https://via.placeholder.com/48x48/1e3a8a/ffffff?text=Inv"}
                                alt={investment.title}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/48x48/1e3a8a/ffffff?text=Inv";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {investment.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {investment.companyName}
                                </p>
                                <p className="text-xs text-lebanese-green mt-1">
                                  {investment.expectedReturn}% return
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                        {searchSuggestions.length >= 5 && (
                          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                            <button
                              type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSearch(e);
                              }}
                              className="text-sm text-lebanese-navy hover:underline w-full text-left"
                            >
                              View all results for "{searchQuery}"
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {showSuggestions && searchQuery.trim() && searchSuggestions.length === 0 && !loading && (
                      <div
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4"
                      >
                        <p className="text-sm text-gray-500 text-center">
                          No investments found for "{searchQuery}"
                        </p>
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="bg-lebanese-navy hover:bg-opacity-90">
                    Search
                  </Button>
                </form>
                <div className="flex gap-2">
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="created:DESC">Sort by: Newest</option>
                    <option value="expectedReturn:DESC">Return: High to Low</option>
                    <option value="expectedReturn:ASC">Return: Low to High</option>
                    <option value="targetAmount:DESC">Amount: High to Low</option>
                    <option value="targetAmount:ASC">Amount: Low to High</option>
                    <option value="deadline:ASC">Deadline: Closest</option>
                  </select>
                </div>
              </div>
              
              {activeSearchQuery && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Search results for: <strong>"{activeSearchQuery}"</strong>
                  </span>
                  <button
                    onClick={clearSearch}
                    className="text-sm text-lebanese-navy hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lebanese-navy mb-4"></div>
                  <div>Loading investments...</div>
                </div>
              ) : investments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No investments found</h3>
                  <p className="text-gray-500 mb-4">
                    {activeSearchQuery 
                      ? `No results found for "${activeSearchQuery}". Try a different search term.`
                      : "Try adjusting your filter criteria or search query"}
                  </p>
                  {activeSearchQuery && (
                    <Button onClick={clearSearch} variant="outline" className="mt-2">
                      Clear search and show all investments
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {investments.map((investment) => (
                      <InvestmentCard key={investment.id} investment={investment} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-gray-500">
                        Page {page + 1} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(prev => Math.max(0, prev - 1))}
                          disabled={page === 0 || loading}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(prev => prev + 1)}
                          disabled={page >= totalPages - 1 || loading}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Investments;
