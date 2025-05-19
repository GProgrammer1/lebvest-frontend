
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, ChevronLeft, BarChart3, ShieldCheck, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

// Mock investor data
const mockInvestors = {
  "inv1": {
    id: "inv1",
    name: "John Smith",
    portfolioValue: 150000,
    totalInvested: 125000,
    totalReturns: 22500,
    joinDate: "2023-05-15",
    bio: "Experienced angel investor focused on early-stage startups with innovative solutions. Previous successful exits in fintech and healthtech sectors.",
    preferences: {
      categories: ["real_estate", "technology", "startups"],
      riskLevel: "medium",
      minInvestment: 10000,
      preferredLocations: ["beirut", "mount_lebanon"]
    },
    activeInvestments: [
      { 
        id: "proj1", 
        name: "Beirut Tech Hub", 
        amount: 50000, 
        date: "2023-07-10", 
        roi: "+12%", 
        category: "technology" 
      },
      { 
        id: "proj2", 
        name: "Cedar Apartments", 
        amount: 75000, 
        date: "2023-08-22", 
        roi: "+5%", 
        category: "real_estate" 
      }
    ],
    investmentHistory: [
      { year: 2021, amount: 80000, returns: 12000 },
      { year: 2022, amount: 100000, returns: 15000 },
      { year: 2023, amount: 125000, returns: 22500 }
    ]
  },
  "inv2": {
    id: "inv2",
    name: "Sarah Johnson",
    portfolioValue: 300000,
    totalInvested: 250000,
    totalReturns: 42500,
    joinDate: "2023-06-22",
    bio: "Impact investor with a focus on sustainable development and healthcare innovations. Looking to build a diversified portfolio with long-term growth potential.",
    preferences: {
      categories: ["healthcare", "technology", "education"],
      riskLevel: "high",
      minInvestment: 25000,
      preferredLocations: ["beirut", "south", "north"]
    },
    activeInvestments: [
      { 
        id: "proj3", 
        name: "MedTech Solutions", 
        amount: 100000, 
        date: "2023-06-15", 
        roi: "+18%", 
        category: "healthcare" 
      },
      { 
        id: "proj4", 
        name: "EdTech Learning Platform", 
        amount: 75000, 
        date: "2023-07-30", 
        roi: "+10%", 
        category: "education" 
      },
      { 
        id: "proj5", 
        name: "AI Analytics Suite", 
        amount: 75000, 
        date: "2023-09-05", 
        roi: "+8%", 
        category: "technology" 
      }
    ],
    investmentHistory: [
      { year: 2021, amount: 150000, returns: 22500 },
      { year: 2022, amount: 200000, returns: 30000 },
      { year: 2023, amount: 250000, returns: 42500 }
    ]
  }
};

const InvestorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [contactVisible, setContactVisible] = useState(false);
  
  // Get investor data based on ID
  const investor = id && mockInvestors[id as keyof typeof mockInvestors];
  
  if (!investor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Investor not found</h2>
            <p className="mt-2 text-gray-600">The requested investor profile does not exist.</p>
            <Link to="/company-dashboard">
              <Button className="mt-4 bg-lebanese-navy hover:bg-opacity-90">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const calculateTotalROI = () => {
    const roi = (investor.totalReturns / investor.totalInvested) * 100;
    return roi.toFixed(1) + '%';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{investor.name} | Investor Profile | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/company-dashboard" className="inline-flex items-center text-lebanese-navy hover:text-lebanese-green">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column - Profile details */}
            <div className="w-full lg:w-1/3 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Investor Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="mr-4 h-16 w-16 rounded-full bg-lebanese-navy/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-lebanese-navy" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{investor.name}</h2>
                      <p className="text-gray-500 text-sm">Member since {new Date(investor.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <p className="text-gray-700">{investor.bio}</p>
                  </div>
                  
                  {!contactVisible ? (
                    <Button 
                      className="w-full mt-6 bg-lebanese-navy hover:bg-opacity-90"
                      onClick={() => setContactVisible(true)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Investor
                    </Button>
                  ) : (
                    <div className="mt-6 p-4 bg-gray-50 border rounded-md">
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <p className="text-gray-700 mb-2">To protect our investors' privacy, direct contact information is not displayed.</p>
                      <p className="text-gray-700 mb-4">Please use our secure messaging system to reach out to this investor.</p>
                      <Button className="w-full bg-lebanese-navy hover:bg-opacity-90">
                        Send Message
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Investment Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Interested Categories</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {investor.preferences.categories.map((category) => (
                          <Badge key={category} variant="outline" className="capitalize">
                            {category.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Risk Tolerance</h3>
                      <div className="mt-1">
                        <Badge className={`
                          ${investor.preferences.riskLevel === "low" ? "bg-blue-100 text-blue-700" : ""}
                          ${investor.preferences.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" : ""}
                          ${investor.preferences.riskLevel === "high" ? "bg-red-100 text-red-700" : ""}
                        `}>
                          {investor.preferences.riskLevel.charAt(0).toUpperCase() + investor.preferences.riskLevel.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Minimum Investment</h3>
                      <div className="mt-1 font-medium">
                        {formatCurrency(investor.preferences.minInvestment)}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Preferred Locations</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {investor.preferences.preferredLocations.map((location) => (
                          <Badge key={location} variant="outline" className="capitalize">
                            {location.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Portfolio details */}
            <div className="w-full lg:w-2/3">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <div className="text-sm font-medium text-gray-500">Portfolio Value</div>
                      <div className="text-2xl font-bold mt-1">{formatCurrency(investor.portfolioValue)}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <div className="text-sm font-medium text-gray-500">Total Invested</div>
                      <div className="text-2xl font-bold mt-1">{formatCurrency(investor.totalInvested)}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <div className="text-sm font-medium text-gray-500">Total Returns</div>
                      <div className="text-2xl font-bold mt-1 text-green-600">
                        +{formatCurrency(investor.totalReturns)} ({calculateTotalROI()})
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Tabs defaultValue="active">
                      <TabsList>
                        <TabsTrigger value="active">Active Investments</TabsTrigger>
                        <TabsTrigger value="history">Investment History</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="active" className="mt-4">
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>ROI</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {investor.activeInvestments.map((investment) => (
                                <TableRow key={investment.id}>
                                  <TableCell className="font-medium">{investment.name}</TableCell>
                                  <TableCell className="capitalize">{investment.category.replace("_", " ")}</TableCell>
                                  <TableCell>{formatCurrency(investment.amount)}</TableCell>
                                  <TableCell>{new Date(investment.date).toLocaleDateString()}</TableCell>
                                  <TableCell className="text-green-600">{investment.roi}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="history" className="mt-4">
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Year</TableHead>
                                <TableHead>Amount Invested</TableHead>
                                <TableHead>Returns</TableHead>
                                <TableHead>ROI</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {investor.investmentHistory.map((history) => (
                                <TableRow key={history.year}>
                                  <TableCell className="font-medium">{history.year}</TableCell>
                                  <TableCell>{formatCurrency(history.amount)}</TableCell>
                                  <TableCell>{formatCurrency(history.returns)}</TableCell>
                                  <TableCell className="text-green-600">
                                    {((history.returns / history.amount) * 100).toFixed(1)}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-center py-4 px-6 bg-blue-50 border border-blue-200 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-blue-600 text-sm">
                  This is a public investor profile. Some details are hidden to protect the investor's privacy.
                </p>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button variant="outline" className="mr-4">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Compare with other investors
                </Button>
                
                <Button className="bg-lebanese-navy hover:bg-opacity-90">
                  Send Investment Opportunity
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InvestorProfile;
