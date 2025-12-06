
import React, { useState, useEffect } from "react";
import { Investment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getCompanyProfileById } from "@/api/company";
import { Building2 } from "lucide-react";

interface InvestmentDetailProps {
  investment: Investment;
  onInvestmentSuccess?: () => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const capitalize = (str: string): string => {
  return str.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;
  
  // If it's already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, prepend the API base URL
  const apiBaseUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';
  return `${apiBaseUrl}/${imageUrl}`;
};

const InvestmentDetail: React.FC<InvestmentDetailProps> = ({ investment, onInvestmentSuccess }) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(investment.minInvestment);
  const [customAmountInput, setCustomAmountInput] = useState<string>("");
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [isInvesting, setIsInvesting] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isTogglingWatchlist, setIsTogglingWatchlist] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyLogoError, setCompanyLogoError] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, role } = useAuth();
  const isInvestor = role === 'Investor';
  const progressPercentage = (investment.raisedAmount / investment.targetAmount) * 100;

  // Fetch company logo if companyId is available
  useEffect(() => {
    const fetchCompanyLogo = async () => {
      if (investment.companyId) {
        try {
          const company = await getCompanyProfileById(investment.companyId);
          if (company.logo) {
            setCompanyLogo(getImageUrl(company.logo));
          }
        } catch (error) {
          console.error("Error fetching company logo:", error);
          setCompanyLogoError(true);
        }
      }
    };
    fetchCompanyLogo();
  }, [investment.companyId]);
  
  useEffect(() => {
    // Check if investment is in watchlist
    const checkWatchlist = async () => {
      if (!isAuthenticated || !isInvestor) {
        setIsWatchlisted(false);
        return;
      }
      
      try {
        const response = await apiClient.get<ResponsePayload>(`/investments/${investment.id}/watchlist/status`);
        if (response.data.status === 200) {
          const status = response.data.data.watchlistStatus;
          setIsWatchlisted(status.isWatchlisted || false);
        }
      } catch (error) {
        console.error("Error checking watchlist:", error);
        setIsWatchlisted(false);
      }
    };
    checkWatchlist();
  }, [investment.id, isAuthenticated, isInvestor]);
  
  const getRiskColor = (risk: string): string => {
    const colors: {[key: string]: string} = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  const handleInvest = async () => {
    // Determine the final amount to use
    // If customAmountInput exists and has a value, use it (user is typing custom amount)
    // Otherwise, use investmentAmount (preset was selected)
    let finalAmount = investmentAmount;
    
    // Check if user has entered a custom amount (even if it's in the input field)
    if (customAmountInput && customAmountInput.trim() !== "") {
      const numValue = parseFloat(customAmountInput.trim());
      if (isNaN(numValue)) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid number",
          variant: "destructive",
        });
        return;
      }
      if (numValue < investment.minInvestment) {
        toast({
          title: "Invalid Amount",
          description: `Minimum investment is ${formatCurrency(investment.minInvestment)}`,
          variant: "destructive",
        });
        return;
      }
      // Use the custom amount from input
      finalAmount = numValue;
    } else {
      // No custom input, use investmentAmount (preset value)
      if (investmentAmount < investment.minInvestment) {
        toast({
          title: "Invalid Amount",
          description: `Minimum investment is ${formatCurrency(investment.minInvestment)}`,
          variant: "destructive",
        });
        return;
      }
      finalAmount = investmentAmount;
    }

    setIsInvesting(true);
    try {
      const response = await apiClient.post<ResponsePayload>(
        `/investments/${investment.id}/invest`,
        { amount: finalAmount }
      );

      if (response.data.status === 201) {
        toast({
          title: "Investment Successful!",
          description: `You have successfully invested ${formatCurrency(finalAmount)} in this project.`,
        });
        setIsInvestDialogOpen(false);
        setCustomAmountInput("");
        setInvestmentAmount(investment.minInvestment); // Reset to default
        if (onInvestmentSuccess) {
          onInvestmentSuccess();
        }
      }
    } catch (error: any) {
      console.error("Error making investment:", error);
      toast({
        title: "Investment Failed",
        description: error.response?.data?.message || "Failed to process investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInvesting(false);
    }
  };

  const handleToggleWatchlist = async () => {
    setIsTogglingWatchlist(true);
    try {
      if (isWatchlisted) {
        await apiClient.delete(`/investments/${investment.id}/watchlist`);
        setIsWatchlisted(false);
        toast({
          title: "Removed from Watchlist",
          description: "This investment has been removed from your watchlist.",
        });
      } else {
        await apiClient.post(`/investments/${investment.id}/watchlist`);
        setIsWatchlisted(true);
        toast({
          title: "Added to Watchlist",
          description: "This investment has been added to your watchlist.",
        });
      }
    } catch (error: any) {
      console.error("Error toggling watchlist:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update watchlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTogglingWatchlist(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{investment.title}</h1>
            <div className="flex items-center gap-3 mb-4">
              {investment.companyId ? (
                <Link 
                  to={`/company-profile/${investment.companyId}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {companyLogo && !companyLogoError ? (
                    <img 
                      src={companyLogo} 
                      alt={investment.companyName || 'Company'} 
                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                      onError={() => setCompanyLogoError(true)}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-lebanese-navy/10 flex items-center justify-center border-2 border-gray-200">
                      <Building2 className="h-6 w-6 text-lebanese-navy" />
                    </div>
                  )}
                  <p className="text-xl text-gray-600 hover:text-lebanese-navy">{investment.companyName}</p>
                </Link>
              ) : (
                <>
                  {companyLogo && !companyLogoError ? (
                    <img 
                      src={companyLogo} 
                      alt={investment.companyName || 'Company'} 
                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                      onError={() => setCompanyLogoError(true)}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-lebanese-navy/10 flex items-center justify-center border-2 border-gray-200">
                      <Building2 className="h-6 w-6 text-lebanese-navy" />
                    </div>
                  )}
                  <p className="text-xl text-gray-600">{investment.companyName}</p>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="capitalize">
                {capitalize(investment.category)}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {capitalize(investment.sector)}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {capitalize(investment.location)}
              </Badge>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.riskLevel)}`}>
                {capitalize(investment.riskLevel)} Risk
              </span>
            </div>
          </div>
          
          {/* Main image */}
          <div className="rounded-lg overflow-hidden mb-8 bg-gray-200">
            <img 
              src={investment.imageUrl && investment.imageUrl.trim() !== "" 
                ? investment.imageUrl 
                : "https://via.placeholder.com/800x400/1e3a8a/ffffff?text=Investment+Opportunity"} 
              alt={investment.title} 
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800x400/1e3a8a/ffffff?text=Investment+Opportunity";
              }}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">About This Investment</h3>
                <p className="text-gray-700">{investment.description}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {investment.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-lebanese-green mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">AI Investment Analysis</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Profit Prediction</p>
                        <p className="text-2xl font-bold text-lebanese-green">{investment.aiPrediction.profitPrediction}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold mr-2">{investment.aiPrediction.confidenceScore}</p>
                          <span className="text-sm text-gray-500">/100</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Expected Return</p>
                        <p className="text-2xl font-bold text-lebanese-navy">{investment.expectedReturn}%</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm text-gray-500 mb-2">Risk Assessment</p>
                      <p className="text-gray-700">{investment.aiPrediction.riskAssessment}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="financials" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Financial History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {investment.financials.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.revenue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.expenses)}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(item.profit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Investment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm text-gray-500">Investment Type</dt>
                          <dd className="text-lg font-medium capitalize">{investment.investmentType}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Funding Stage</dt>
                          <dd className="text-lg font-medium">{investment.fundingStage}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Duration</dt>
                          <dd className="text-lg font-medium">{investment.duration} months</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm text-gray-500">Minimum Investment</dt>
                          <dd className="text-lg font-medium">{formatCurrency(investment.minInvestment)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Expected Return</dt>
                          <dd className="text-lg font-medium text-lebanese-green">{investment.expectedReturn}%</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Risk Level</dt>
                          <dd className="text-lg font-medium capitalize">{investment.riskLevel}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {investment.team.map((member, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                              {member.imageUrl ? (
                                <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-2xl text-gray-500">{member.name.charAt(0)}</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold">{member.name}</h4>
                            <p className="text-sm text-lebanese-navy mb-2">{member.role}</p>
                            <p className="text-sm text-gray-600">{member.bio}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Available Documents</h3>
                <div className="space-y-4">
                  {investment.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-sm text-gray-500 uppercase">{doc.type}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="updates" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Project Updates</h3>
                <div className="space-y-6">
                  {investment.updates.map((update, index) => (
                    <div key={index} className="border-l-4 border-lebanese-navy pl-4 py-1">
                      <p className="text-sm text-gray-500 mb-1">{formatDate(update.date)}</p>
                      <h4 className="font-semibold text-lg mb-2">{update.title}</h4>
                      <p className="text-gray-700">{update.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Funding Progress</h3>
                    <Progress value={progressPercentage} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm">
                      <span>{formatCurrency(investment.raisedAmount)} raised</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Target: {formatCurrency(investment.targetAmount)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Deadline</p>
                    <p className="font-semibold">{formatDate(investment.deadline)}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold mb-2">Investment Amount</h4>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Minimum</span>
                      <span className="font-medium">{formatCurrency(investment.minInvestment)}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-between"
                        onClick={() => {
                          setInvestmentAmount(investment.minInvestment);
                          setCustomAmountInput("");
                        }}
                      >
                        {formatCurrency(investment.minInvestment)}
                        {investmentAmount === investment.minInvestment && !customAmountInput && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-between"
                        onClick={() => {
                          setInvestmentAmount(investment.minInvestment * 5);
                          setCustomAmountInput("");
                        }}
                      >
                        {formatCurrency(investment.minInvestment * 5)}
                        {investmentAmount === investment.minInvestment * 5 && !customAmountInput && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-between"
                        onClick={() => {
                          setInvestmentAmount(investment.minInvestment * 10);
                          setCustomAmountInput("");
                        }}
                      >
                        {formatCurrency(investment.minInvestment * 10)}
                        {investmentAmount === investment.minInvestment * 10 && !customAmountInput && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </Button>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          type="number"
                          placeholder="Custom amount"
                          className="w-full pl-8"
                          value={customAmountInput}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            setCustomAmountInput(inputValue);
                            
                            // Always update investmentAmount when user types, even if below minimum
                            // Validation will happen on submit
                            const numValue = parseFloat(inputValue);
                            if (!isNaN(numValue)) {
                              setInvestmentAmount(numValue);
                            } else if (inputValue === "" || inputValue === ".") {
                              // Allow empty or partial input while typing
                              // Don't reset investmentAmount while user is typing
                            }
                          }}
                          onFocus={() => {
                            // When user focuses on custom input, clear it so they can type fresh
                            // Don't pre-fill with preset value
                            setCustomAmountInput("");
                          }}
                          onBlur={(e) => {
                            // Validate on blur
                            const numValue = parseFloat(e.target.value);
                            if (isNaN(numValue) || numValue < investment.minInvestment) {
                              // Clear invalid input but keep investmentAmount as user typed
                              // This allows them to see their input was invalid
                              if (e.target.value.trim() === "" || isNaN(numValue)) {
                                setCustomAmountInput("");
                                setInvestmentAmount(investment.minInvestment);
                              } else {
                                // Keep the invalid value visible so user can see what they typed
                                // They'll get validation error on submit
                                setInvestmentAmount(numValue);
                              }
                            } else {
                              // Valid amount - keep both values in sync
                              setInvestmentAmount(numValue);
                              setCustomAmountInput(numValue.toString());
                            }
                          }}
                          min={investment.minInvestment}
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {isAuthenticated && isInvestor ? (
                    <>
                      <Button 
                        className="w-full bg-lebanese-navy hover:bg-opacity-90"
                        onClick={() => setIsInvestDialogOpen(true)}
                      >
                        Invest Now
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleToggleWatchlist}
                        disabled={isTogglingWatchlist}
                      >
                        {isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
                      </Button>
                    </>
                  ) : isAuthenticated && role === 'Company' ? (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertDescription className="text-sm text-yellow-800">
                        Companies cannot invest in projects. If you're looking to list your own project, visit your <Link to="/company-dashboard" className="underline font-medium">company dashboard</Link>.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <Link to="/signin" className="w-full">
                        <Button className="w-full bg-lebanese-navy hover:bg-opacity-90">
                          Sign In to Invest
                        </Button>
                      </Link>
                      <Link to="/register" className="w-full">
                        <Button variant="outline" className="w-full">
                          Create Account
                        </Button>
                      </Link>
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-sm text-blue-800">
                          You need to sign in as an investor to invest or add to watchlist. <Link to="/signin" className="underline font-medium">Sign in</Link> or <Link to="/register" className="underline font-medium">create an account</Link> to get started.
                        </AlertDescription>
                      </Alert>
                    </>
                  )}
                  
                  <Alert className="bg-gray-50 border-gray-200">
                    <AlertDescription className="text-sm text-gray-600">
                      This investment opportunity has been verified by LebVest according to Lebanese regulations and our platform standards.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Investment Confirmation Dialog */}
      <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Investment</DialogTitle>
            <DialogDescription>
              Please review your investment details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Investment Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(investmentAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Project</p>
              <p className="font-medium">{investment.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Expected Return</p>
              <p className="font-medium text-lebanese-green">{investment.expectedReturn}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Minimum Investment</p>
              <p className="font-medium">{formatCurrency(investment.minInvestment)}</p>
            </div>
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                By confirming, you agree to invest {formatCurrency(investmentAmount)} in this project. 
                This action cannot be undone.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInvestDialogOpen(false)}
              disabled={isInvesting}
            >
              Cancel
            </Button>
            <Button
              className="bg-lebanese-navy hover:bg-opacity-90"
              onClick={handleInvest}
              disabled={isInvesting || investmentAmount < investment.minInvestment}
            >
              {isInvesting ? "Processing..." : "Confirm Investment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentDetail;
