
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

// Mock data for investors
const mockInvestors = [
  {
    id: "inv1",
    name: "John Smith",
    portfolioSize: 150000,
    riskLevel: "medium",
    sectors: ["real_estate", "technology"],
    active: true,
    totalInvestments: 7,
    averageInvestmentSize: 20000,
    returns: {
      oneYear: 8.5,
      threeYear: 12.2,
      fiveYear: 9.7
    },
    preferredCategories: ["real_estate", "technology"],
    yearsInvesting: 5
  },
  {
    id: "inv2",
    name: "Sarah Johnson",
    portfolioSize: 300000,
    riskLevel: "high",
    sectors: ["startup", "healthcare"],
    active: true,
    totalInvestments: 12,
    averageInvestmentSize: 25000,
    returns: {
      oneYear: 14.2,
      threeYear: 18.5,
      fiveYear: 16.1
    },
    preferredCategories: ["startup", "healthcare", "technology"],
    yearsInvesting: 7
  },
  {
    id: "inv3",
    name: "Michael Brown",
    portfolioSize: 75000,
    riskLevel: "low",
    sectors: ["government_bonds", "real_estate"],
    active: true,
    totalInvestments: 4,
    averageInvestmentSize: 15000,
    returns: {
      oneYear: 4.2,
      threeYear: 5.5,
      fiveYear: 6.1
    },
    preferredCategories: ["government_bonds", "real_estate"],
    yearsInvesting: 3
  },
  {
    id: "inv4",
    name: "Jessica Lee",
    portfolioSize: 250000,
    riskLevel: "medium",
    sectors: ["technology", "education"],
    active: true,
    totalInvestments: 9,
    averageInvestmentSize: 27000,
    returns: {
      oneYear: 9.8,
      threeYear: 11.5,
      fiveYear: 10.2
    },
    preferredCategories: ["technology", "education"],
    yearsInvesting: 6
  },
  {
    id: "inv5",
    name: "Robert Chen",
    portfolioSize: 500000,
    riskLevel: "high",
    sectors: ["healthcare", "technology"],
    active: true,
    totalInvestments: 15,
    averageInvestmentSize: 33000,
    returns: {
      oneYear: 16.8,
      threeYear: 20.5,
      fiveYear: 18.2
    },
    preferredCategories: ["healthcare", "technology", "startup"],
    yearsInvesting: 10
  }
];

const CompareInvestors = () => {
  const { id } = useParams<{ id: string }>();
  const [primaryInvestor, setPrimaryInvestor] = useState<any>(null);
  const [secondaryInvestorId, setSecondaryInvestorId] = useState<string>("");
  const [secondaryInvestor, setSecondaryInvestor] = useState<any>(null);
  const [availableInvestors, setAvailableInvestors] = useState<any[]>([]);

  useEffect(() => {
    // Find primary investor
    const primary = mockInvestors.find((investor) => investor.id === id);
    setPrimaryInvestor(primary || null);
    
    // Filter available investors (exclude primary)
    const others = mockInvestors.filter((investor) => investor.id !== id);
    setAvailableInvestors(others);
  }, [id]);

  useEffect(() => {
    // Find secondary investor if ID is selected
    if (secondaryInvestorId) {
      const secondary = mockInvestors.find((investor) => investor.id === secondaryInvestorId);
      setSecondaryInvestor(secondary || null);
    } else {
      setSecondaryInvestor(null);
    }
  }, [secondaryInvestorId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getComparisonStyle = (primary: number, secondary: number) => {
    if (!secondary) return "";
    return primary > secondary ? "text-green-600" : primary < secondary ? "text-red-600" : "";
  };

  const getRiskLevelBadgeClass = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-blue-100 text-blue-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "high":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!primaryInvestor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-900">Investor Not Found</h2>
              <p className="mt-2 text-gray-500">
                The investor you're looking for doesn't exist or you don't have permission to view their profile.
              </p>
              <Button className="mt-4" asChild>
                <Link to="/company-dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Compare Investors | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="pl-0 mb-4">
              <Link to="/company-dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-lebanese-navy">Compare Investors</h1>
            <p className="text-gray-600">Compare investment profiles and portfolios side by side</p>
          </div>

          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Select Investors to Compare</CardTitle>
                <CardDescription>
                  {primaryInvestor.name} is selected as the primary investor. Choose another investor to compare with.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-1/2">
                    <p className="text-sm font-medium mb-1">Primary Investor</p>
                    <div className="border rounded-md p-3 bg-gray-50">
                      {primaryInvestor.name}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <p className="text-sm font-medium mb-1">Compare With</p>
                    <Select value={secondaryInvestorId} onValueChange={setSecondaryInvestorId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an investor to compare" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select an investor</SelectItem>
                        {availableInvestors.map((investor) => (
                          <SelectItem key={investor.id} value={investor.id}>
                            {investor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {primaryInvestor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-xl">{primaryInvestor.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Portfolio Size</h3>
                    <p className="text-2xl font-bold">{formatCurrency(primaryInvestor.portfolioSize)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Risk Level</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelBadgeClass(primaryInvestor.riskLevel)}`}>
                      {primaryInvestor.riskLevel.charAt(0).toUpperCase() + primaryInvestor.riskLevel.slice(1)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Interested In</h3>
                    <div className="flex flex-wrap">
                      {primaryInvestor.sectors.map((sector: string) => (
                        <span 
                          key={sector}
                          className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700 mr-1 mb-1"
                        >
                          {sector.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Investment Activity</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Investments:</span>
                        <span className="font-medium">{primaryInvestor.totalInvestments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Avg. Investment Size:</span>
                        <span className="font-medium">{formatCurrency(primaryInvestor.averageInvestmentSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Years Investing:</span>
                        <span className="font-medium">{primaryInvestor.yearsInvesting}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Historical Returns</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">1-Year Return:</span>
                        <span className="font-medium">{primaryInvestor.returns.oneYear}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">3-Year Return:</span>
                        <span className="font-medium">{primaryInvestor.returns.threeYear}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">5-Year Return:</span>
                        <span className="font-medium">{primaryInvestor.returns.fiveYear}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={!secondaryInvestor ? "opacity-60" : ""}>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-xl">{secondaryInvestor ? secondaryInvestor.name : "Select an investor"}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {secondaryInvestor ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Portfolio Size</h3>
                        <p className={`text-2xl font-bold ${getComparisonStyle(secondaryInvestor.portfolioSize, primaryInvestor.portfolioSize)}`}>
                          {formatCurrency(secondaryInvestor.portfolioSize)}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Risk Level</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelBadgeClass(secondaryInvestor.riskLevel)}`}>
                          {secondaryInvestor.riskLevel.charAt(0).toUpperCase() + secondaryInvestor.riskLevel.slice(1)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Interested In</h3>
                        <div className="flex flex-wrap">
                          {secondaryInvestor.sectors.map((sector: string) => (
                            <span 
                              key={sector}
                              className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700 mr-1 mb-1"
                            >
                              {sector.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Investment Activity</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Total Investments:</span>
                            <span className={`font-medium ${getComparisonStyle(secondaryInvestor.totalInvestments, primaryInvestor.totalInvestments)}`}>
                              {secondaryInvestor.totalInvestments}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Avg. Investment Size:</span>
                            <span className={`font-medium ${getComparisonStyle(secondaryInvestor.averageInvestmentSize, primaryInvestor.averageInvestmentSize)}`}>
                              {formatCurrency(secondaryInvestor.averageInvestmentSize)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Years Investing:</span>
                            <span className={`font-medium ${getComparisonStyle(secondaryInvestor.yearsInvesting, primaryInvestor.yearsInvesting)}`}>
                              {secondaryInvestor.yearsInvesting}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Historical Returns</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">1-Year Return:</span>
                            <span className={`font-medium ${getComparisonStyle(secondaryInvestor.returns.oneYear, primaryInvestor.returns.oneYear)}`}>
                              {secondaryInvestor.returns.oneYear}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">3-Year Return:</span>
                            <span className={`font-medium ${getComparisonStyle(secondaryInvestor.returns.threeYear, primaryInvestor.returns.threeYear)}`}>
                              {secondaryInvestor.returns.threeYear}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">5-Year Return:</span>
                            <span className={`font-medium ${getComparisonStyle(secondaryInvestor.returns.fiveYear, primaryInvestor.returns.fiveYear)}`}>
                              {secondaryInvestor.returns.fiveYear}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-500">Select an investor to compare</p>
                        <p className="text-sm text-gray-400 mt-2">Choose from the dropdown menu above</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-6">
            <Button asChild>
              <Link to={`/investor-profile/${primaryInvestor.id}`}>
                View Full Profile
              </Link>
            </Button>
            {secondaryInvestor && (
              <Button asChild variant="outline" className="ml-4">
                <Link to={`/investor-profile/${secondaryInvestor.id}`}>
                  View {secondaryInvestor.name}'s Profile
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompareInvestors;
