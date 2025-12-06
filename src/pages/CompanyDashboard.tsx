import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useCompanyDashboard, useCompanyProfile, useCompanyInvestors, useCompanyInvestmentRequests, useAcceptInvestmentRequest, useRejectInvestmentRequest } from "@/hooks/useCompanyQueries";
import { TableSkeleton, CardSkeleton } from "@/components/LoadingSkeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { PayoutHistory } from "@/components/PayoutHistory";

// Mock data for investors
const mockInvestors = [
  {
    id: "inv1",
    name: "John Smith",
    portfolioSize: 150000,
    riskLevel: "medium",
    sectors: ["real_estate", "technology"],
  },
  {
    id: "inv2",
    name: "Sarah Johnson",
    portfolioSize: 300000,
    riskLevel: "high",
    sectors: ["startup", "healthcare"],
  },
  {
    id: "inv3",
    name: "Michael Brown",
    portfolioSize: 75000,
    riskLevel: "low",
    sectors: ["government_bonds", "real_estate"],
  },
  {
    id: "inv4",
    name: "Jessica Lee",
    portfolioSize: 250000,
    riskLevel: "medium",
    sectors: ["technology", "education"],
  },
  {
    id: "inv5",
    name: "Robert Chen",
    portfolioSize: 500000,
    riskLevel: "high",
    sectors: ["healthcare", "technology"],
    active: true,
  },
];


const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [minPortfolio, setMinPortfolio] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [investorsPage, setInvestorsPage] = useState(0);
  const [investmentRequestsFilter, setInvestmentRequestsFilter] = useState("PENDING");
  const [rejectingRequestId, setRejectingRequestId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // React Query hooks
  const { data: profile } = useCompanyProfile();
  const { data: dashboardData, isLoading: loading } = useCompanyDashboard();
  const { data: investorsData, isLoading: investorsLoading } = useCompanyInvestors({
    query: searchQuery,
    minPortfolio: minPortfolio !== "all" ? minPortfolio : undefined,
    riskLevel: riskFilter !== "all" ? riskFilter : undefined,
    category: sectorFilter !== "all" ? sectorFilter : undefined,
    page: investorsPage,
    size: 20,
  });
  const { data: investmentRequests = [], isLoading: investmentRequestsLoading } = useCompanyInvestmentRequests(investmentRequestsFilter);
  const acceptRequest = useAcceptInvestmentRequest();
  const rejectRequest = useRejectInvestmentRequest();

  const needsVerification = profile?.status === "APPROVED" || profile?.status === "PENDING_DOCS";
  const investors = investorsData?.investors || [];
  const investorsTotalPages = investorsData?.totalPages || 0;
  const investorsTotalElements = investorsData?.totalElements || 0;

  // Reset to first page when filters change
  useEffect(() => {
    setInvestorsPage(0);
  }, [searchQuery, riskFilter, minPortfolio, sectorFilter]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };


  const investmentRequestsCount = investmentRequests.filter(
    (req) => req.status === "PENDING"
  ).length;

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await acceptRequest.mutateAsync(requestId);
      toast({
        title: "Success",
        description: "Investment request accepted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    try {
      await rejectRequest.mutateAsync({ requestId, reason: rejectionReason });
      setRejectingRequestId(null);
      setRejectionReason("");
      toast({
        title: "Success",
        description: "Investment request rejected",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Company Dashboard | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Verification Banner - Only show for APPROVED or PENDING_DOCS, not FULLY_VERIFIED */}
          {needsVerification && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <span className="font-medium">Action Required:</span> Complete your company verification to start posting projects.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate("/company-verification")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white whitespace-nowrap"
                >
                  Complete Verification
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-lebanese-navy">
                Company Dashboard
              </h1>
              <p className="text-gray-600">
                Find potential investors for your projects
              </p>
            </div>
            <Button className="mt-4 md:mt-0 bg-lebanese-navy hover:bg-opacity-90">
              Update Company Profile
            </Button>
          </div>

          <Tabs defaultValue="investors" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="investors">Find Investors</TabsTrigger>
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="investment-requests" className="relative">
                Investment Requests
                {investmentRequestsCount > 0 && (
                  <Badge className="ml-2 bg-blue-500 hover:bg-blue-600 text-white">
                    {investmentRequestsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="payouts">Payout Management</TabsTrigger>
            </TabsList>

            <TabsContent value="investors">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Investor Directory</CardTitle>
                  <CardDescription>
                    Browse potential investors that match your project needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search investors..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Select
                        value={riskFilter}
                        onValueChange={(value) =>
                          setRiskFilter(
                            value as "all" | "low" | "medium" | "high"
                          )
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All levels</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={minPortfolio}
                        onValueChange={(value) =>
                          setMinPortfolio(
                            value as
                              | "all"
                              | "50000"
                              | "100000"
                              | "250000"
                              | "500000"
                          )
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Min portfolio size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any amount</SelectItem>
                          <SelectItem value="50000">$50,000+</SelectItem>
                          <SelectItem value="100000">$100,000+</SelectItem>
                          <SelectItem value="250000">$250,000+</SelectItem>
                          <SelectItem value="500000">$500,000+</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={sectorFilter}
                        onValueChange={(value) =>
                          setSectorFilter(
                            value as
                              | "all"
                              | "real_estate"
                              | "technology"
                              | "healthcare"
                              | "startup"
                              | "government_bonds"
                              | "education"
                          )
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Sector interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All sectors</SelectItem>
                          <SelectItem value="real_estate">
                            Real Estate
                          </SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="startup">Startups</SelectItem>
                          <SelectItem value="government_bonds">
                            Gov. Bonds
                          </SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Portfolio Size</TableHead>
                          <TableHead>Risk Level</TableHead>
                          <TableHead>Interested In</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {investorsLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6">
                              <TableSkeleton rows={3} cols={5} />
                            </TableCell>
                          </TableRow>
                        ) : investors.length > 0 ? (
                          investors.map((inv) => (
                            <TableRow key={inv.id}>
                              <TableCell className="font-medium">
                                {inv.name}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(Number(inv.portfolioValue || 0))}
                              </TableCell>
                              <TableCell>
                                {inv.riskLevels && inv.riskLevels.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {Array.from(inv.riskLevels).map((risk: string) => (
                                      <span
                                        key={risk}
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          risk === "LOW"
                                            ? "bg-blue-100 text-blue-700"
                                            : risk === "MEDIUM"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {risk.charAt(0) + risk.slice(1).toLowerCase()}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {inv.categories && inv.categories.size > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {Array.from(inv.categories).slice(0, 3).map((cat: string) => (
                                      <span
                                        key={cat}
                                        className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700"
                                      >
                                        {cat.replace(/_/g, " ")}
                                      </span>
                                    ))}
                                    {inv.categories.size > 3 && (
                                      <span className="text-xs text-gray-500">+{inv.categories.size - 3}</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="space-x-2">
                                <Link to={`/investor-profile/${inv.id}`}>
                                  <Button variant="outline" size="sm">
                                    View Profile
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6">
                              No investors match your filter criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {investorsTotalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        Showing {investorsPage * 20 + 1} to {Math.min((investorsPage + 1) * 20, investorsTotalElements)} of {investorsTotalElements} investors
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInvestorsPage(prev => Math.max(0, prev - 1))}
                          disabled={investorsPage === 0 || investorsLoading}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInvestorsPage(prev => prev + 1)}
                          disabled={investorsPage >= investorsTotalPages - 1 || investorsLoading}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">My Projects</CardTitle>
                  <CardDescription>
                    Manage your investment projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end mb-6">
                    <Button 
                      className="bg-lebanese-navy hover:bg-opacity-90"
                      onClick={() => navigate("/list-project")}
                    >
                      + New Project
                    </Button>
                  </div>
                  {loading ? (
                    <div className="space-y-4">
                      <CardSkeleton />
                      <CardSkeleton />
                    </div>
                  ) : dashboardData?.recentInvestments && dashboardData.recentInvestments.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recentInvestments.map((investment: any) => (
                        <Card key={investment.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold">{investment.title}</h3>
                                <p className="text-gray-600 mt-1">{investment.description}</p>
                                <div className="flex gap-4 mt-3">
                                  <span className="text-sm text-gray-500">
                                    Target: {formatCurrency(investment.targetAmount || 0)}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Raised: {formatCurrency(investment.raisedAmount || 0)}
                                  </span>
                                </div>
                              </div>
                              <Badge>{investment.category}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Filter className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No projects yet
                      </h3>
                      <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                        Get started by creating your first investment project to
                        attract funding
                      </p>
                    <div className="mt-6">
                      <Button onClick={() => navigate("/list-project")}>
                        Create Your First Project
                      </Button>
                    </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investment-requests">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Investment Requests</CardTitle>
                  <CardDescription>
                    Review and manage investment requests from investors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Select
                      value={investmentRequestsFilter}
                      onValueChange={setInvestmentRequestsFilter}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Requests</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {investmentRequestsLoading ? (
                    <div className="text-center py-12">
                      <div>Loading investment requests...</div>
                    </div>
                  ) : investmentRequests.length > 0 ? (
                    <div className="space-y-4">
                      {investmentRequests.map((request) => (
                        <Card key={request.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                  {request.investorProfileImageUrl && (
                                    <img
                                      src={request.investorProfileImageUrl.startsWith('http') 
                                        ? request.investorProfileImageUrl 
                                        : `http://localhost:8080/api/files/${request.investorProfileImageUrl}`}
                                      alt={request.investorName}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  )}
                                  <div>
                                    <h3 className="text-lg font-semibold">
                                      {request.investorName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {request.investorEmail}
                                    </p>
                                  </div>
                                </div>
                                <div className="mb-4">
                                  <p className="text-sm text-gray-600">
                                    <strong>Project:</strong> {request.investmentTitle}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    <strong>Amount:</strong> {formatCurrency(Number(request.amount))}
                                  </p>
                                  {request.message && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      <strong>Message:</strong> {request.message}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500 mt-2">
                                    Requested: {formatDate(request.createdAt)}
                                  </p>
                                  {request.status === "REJECTED" && request.rejectionReason && (
                                    <p className="text-sm text-red-600 mt-2">
                                      <strong>Rejection Reason:</strong> {request.rejectionReason}
                                    </p>
                                  )}
                                </div>
                                <Badge
                                  className={
                                    request.status === "PENDING"
                                      ? "bg-yellow-500"
                                      : request.status === "ACCEPTED"
                                      ? "bg-green-500"
                                      : request.status === "REJECTED"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                  }
                                >
                                  {request.status}
                                </Badge>
                              </div>
                              <div className="flex flex-col gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/investor-profile/${request.investorId}`}>
                                    View Profile
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  title="Chat feature coming soon"
                                >
                                  Chat
                                </Button>
                                {request.status === "PENDING" && (
                                  <>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleAcceptRequest(request.id)}
                                      disabled={acceptRequest.isPending}
                                    >
                                      {acceptRequest.isPending ? "Accepting..." : "Accept"}
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => setRejectingRequestId(request.id)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            {rejectingRequestId === request.id && (
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                <label className="block text-sm font-medium mb-2">
                                  Rejection Reason <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  className="w-full p-2 border rounded-md mb-2"
                                  rows={3}
                                  placeholder="Please provide a reason for rejection..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleRejectRequest(request.id)}
                                    disabled={!rejectionReason.trim()}
                                  >
                                    Submit Rejection
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setRejectingRequestId(null);
                                      setRejectionReason("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No investment requests
                      </h3>
                      <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                        Investment requests from investors will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Track investor interest and funding metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-sm font-medium text-gray-500">
                          Total Investments
                        </div>
                        <div className="text-3xl font-bold mt-2">
                          {dashboardData?.stats?.totalInvestments || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-sm font-medium text-gray-500">
                          Total Investors
                        </div>
                        <div className="text-3xl font-bold mt-2">
                          {dashboardData?.stats?.totalInvestors || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-sm font-medium text-gray-500">
                          Total Raised
                        </div>
                        <div className="text-3xl font-bold mt-2">
                          {formatCurrency(Number(dashboardData?.stats?.totalRaised || 0))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Target: {formatCurrency(Number(dashboardData?.stats?.totalTarget || 0))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">
                          Detailed analytics coming soon
                        </h3>
                        <p className="mt-1 text-gray-500 max-w-md mx-auto">
                          Create and publish your first project to start
                          collecting detailed analytics and insights
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDashboard;
