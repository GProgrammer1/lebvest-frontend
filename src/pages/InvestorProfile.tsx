
import { useState, useEffect } from "react";
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
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

const InvestorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [contactVisible, setContactVisible] = useState(false);
  const [investor, setInvestor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInvestorProfile = async () => {
      if (!id) {
        setError("Invalid investor ID");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<ResponsePayload>(`/investors/${id}`);
        if (response.data.status === 200) {
          setInvestor(response.data.data.profile);
        } else {
          setError("Investor profile not found");
        }
      } catch (err: any) {
        console.error("Error fetching investor profile:", err);
        setError(err.response?.data?.message || "Failed to load investor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorProfile();
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const calculateTotalROI = () => {
    if (!investor || !investor.totalInvested || investor.totalInvested === 0) return '0%';
    const roi = (Number(investor.totalReturns || 0) / Number(investor.totalInvested)) * 100;
    return roi.toFixed(1) + '%';
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="text-center">
            <div>Loading investor profile...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !investor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Investor not found</h2>
            <p className="mt-2 text-gray-600">{error || "The requested investor profile does not exist."}</p>
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

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{investor.name || 'Investor'} | Investor Profile | LebVest</title>
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
                      <p className="text-gray-500 text-sm">Investor Profile</p>
                    </div>
                  </div>
                  
                  {investor.bio && (
                    <div className="mt-4 space-y-1">
                      <p className="text-gray-700">{investor.bio}</p>
                    </div>
                  )}
                  
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
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investor.bio ? (
                      <div>
                        <p className="text-gray-700">{investor.bio}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500 italic">No bio available</p>
                      </div>
                    )}
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Contact</h3>
                      <p className="text-sm text-gray-600">{investor.email}</p>
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
                      <div className="text-2xl font-bold mt-1">{formatCurrency(Number(investor.portfolioValue || 0))}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <div className="text-sm font-medium text-gray-500">Total Invested</div>
                      <div className="text-2xl font-bold mt-1">{formatCurrency(Number(investor.totalInvested || 0))}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <div className="text-sm font-medium text-gray-500">Total Returns</div>
                      <div className="text-2xl font-bold mt-1 text-green-600">
                        +{formatCurrency(Number(investor.totalReturns || 0))} ({calculateTotalROI()})
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
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                  Investment details are private and not available in public profiles.
                                  <p className="text-sm mt-2">Contact the investor through our messaging system to discuss investment opportunities.</p>
                                </TableCell>
                              </TableRow>
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
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                  Investment history is private and not available in public profiles.
                                </TableCell>
                              </TableRow>
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
