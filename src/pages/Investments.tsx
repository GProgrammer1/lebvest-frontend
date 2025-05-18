
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvestmentCard from "@/components/InvestmentCard";
import InvestmentFilters from "@/components/InvestmentFilters";
import { mockInvestments } from "@/lib/mockData";
import { FilterOptions, Investment } from "@/lib/types";

const Investments = () => {
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>(mockInvestments);
  
  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...mockInvestments];
    
    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(inv => inv.category === filters.category);
    }
    
    if (filters.riskLevel) {
      filtered = filtered.filter(inv => inv.riskLevel === filters.riskLevel);
    }
    
    if (filters.minReturn) {
      filtered = filtered.filter(inv => inv.expectedReturn >= (filters.minReturn || 0));
    }
    
    if (filters.location) {
      filtered = filtered.filter(inv => inv.location === filters.location);
    }
    
    if (filters.sector) {
      filtered = filtered.filter(inv => inv.sector === filters.sector);
    }
    
    if (filters.investmentType) {
      filtered = filtered.filter(inv => inv.investmentType === filters.investmentType);
    }
    
    if (filters.minAmount) {
      filtered = filtered.filter(inv => inv.minInvestment >= (filters.minAmount || 0));
    }
    
    if (filters.maxAmount) {
      filtered = filtered.filter(inv => inv.minInvestment <= (filters.maxAmount || Infinity));
    }
    
    setFilteredInvestments(filtered);
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
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">All Investments</h2>
                  <p className="text-gray-500">Showing {filteredInvestments.length} opportunities</p>
                </div>
                <div className="flex gap-2">
                  <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Sort by: Featured</option>
                    <option>Return: High to Low</option>
                    <option>Return: Low to High</option>
                    <option>Amount: High to Low</option>
                    <option>Amount: Low to High</option>
                    <option>Deadline: Closest</option>
                  </select>
                </div>
              </div>
              
              {filteredInvestments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No investments found</h3>
                  <p className="text-gray-500">Try adjusting your filter criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInvestments.map((investment) => (
                    <InvestmentCard key={investment.id} investment={investment} />
                  ))}
                </div>
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
