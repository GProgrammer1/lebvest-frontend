import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import { Search, Users, Filter, BellIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "investor_inquiry",
    title: "New Investor Inquiry",
    message: "John Smith has expressed interest in your Tech Hub project.",
    date: "2025-05-15T10:30:00",
    read: false,
    investorId: "inv1",
  },
  {
    id: 2,
    type: "funding_milestone",
    title: "Funding Milestone Reached",
    message: "Your Cedar Heights project has reached 50% of its funding goal!",
    date: "2025-05-14T15:45:00",
    read: true,
  },
  {
    id: 3,
    type: "admin_message",
    title: "Admin Message",
    message: "Your project submission has been approved.",
    date: "2025-05-12T09:15:00",
    read: false,
  },
  {
    id: 4,
    type: "investor_request",
    title: "Investment Request",
    message:
      "Sarah Johnson would like to invest $50,000 in your Tech Hub project.",
    date: "2025-05-10T14:20:00",
    read: false,
    investorId: "inv2",
  },
  {
    id: 5,
    type: "admin_message",
    title: "Important Platform Update",
    message:
      "LebVest has updated its terms of service. Please review the changes.",
    date: "2025-05-08T11:00:00",
    read: true,
  },
];

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [minPortfolio, setMinPortfolio] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [notifications, setNotifications] = useState(mockNotifications);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<any[]>([]);
  const [investorsLoading, setInvestorsLoading] = useState(false);
  const [investorsPage, setInvestorsPage] = useState(0);
  const [investorsTotalPages, setInvestorsTotalPages] = useState(0);
  const [investorsTotalElements, setInvestorsTotalElements] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get<ResponsePayload>("/companies/me/dashboard");
        if (response.data.status === 200) {
          setDashboardData(response.data.data.dashboard);
        }
      } catch (error) {
        console.error("Error fetching company dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchInvestors = async () => {
      setInvestorsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("query", searchQuery);
        if (minPortfolio && minPortfolio !== "all") params.append("minPortfolio", minPortfolio);
        if (riskFilter && riskFilter !== "all") params.append("riskLevel", riskFilter.toUpperCase());
        if (sectorFilter && sectorFilter !== "all") params.append("category", sectorFilter.toUpperCase().replace(/\s+/g, '_'));
        params.append("page", investorsPage.toString());
        params.append("size", "20");

        const response = await apiClient.get<ResponsePayload>(`/companies/me/investors?${params.toString()}`);
        if (response.data.status === 200) {
          const data = response.data.data;
          setInvestors(data.investors || []);
          setInvestorsTotalPages(data.totalPages || 0);
          setInvestorsTotalElements(data.totalElements || 0);
        }
      } catch (error) {
        console.error("Error fetching investors:", error);
      } finally {
        setInvestorsLoading(false);
      }
    };

    fetchInvestors();
  }, [searchQuery, riskFilter, minPortfolio, sectorFilter, investorsPage]);

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

  const markAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

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
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="notifications" className="relative">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 hover:bg-red-600 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
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
                              Loading investors...
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
                    <div className="text-center py-12">
                      <div>Loading...</div>
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

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Notifications</CardTitle>
                  <CardDescription>
                    Stay updated on investor inquiries and project updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 transition-colors ${
                            notification.read ? "bg-white" : "bg-blue-50"
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start">
                            {/* ICON + TITLE */}
                            <div className="flex items-center space-x-3">
                              {/* 1) New Opportunity */}
                              {notification.type === "new_opportunity" && (
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                              )}
                              {/* 2) Update */}
                              {notification.type === "update" && (
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                              )}
                              {/* 3) Threshold */}
                              {notification.type === "threshold" && (
                                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-yellow-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                              )}
                              {/* 4) News */}
                              {notification.type === "news" && (
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-purple-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2zM7 10h10M7 14h6"
                                    />
                                  </svg>
                                </div>
                              )}

                              <h3
                                className={`text-lg font-medium ${
                                  notification.read ? "" : "text-lebanese-navy"
                                }`}
                              >
                                {notification.title}
                                {!notification.read && (
                                  <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </h3>
                            </div>

                            <span className="text-sm text-gray-500">
                              {formatDate(notification.date)}
                            </span>
                          </div>

                          <p className="text-gray-700 mt-1">
                            {notification.message}
                          </p>

                          {/* ICON + TITLE */}
                          <div className="flex items-center space-x-3">
                            {/* 1) Investor Inquiry */}
                            {notification.type === "investor_inquiry" && (
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-blue-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-6-4h6"
                                  />
                                </svg>
                              </div>
                            )}

                            {/* 2) Funding Milestone */}
                            {notification.type === "funding_milestone" && (
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-green-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                                  />
                                </svg>
                              </div>
                            )}

                            {/* 3) Admin Message */}
                            {notification.type === "admin_message" && (
                              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-yellow-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            )}

                            {/* 4) Investment Request */}
                            {notification.type === "investor_request" && (
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-purple-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18z"
                                  />
                                </svg>
                              </div>
                            )}

                            <h3
                              className={`text-lg font-medium ${
                                notification.read ? "" : "text-lebanese-navy"
                              }`}
                            >
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </h3>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <BellIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          No notifications yet
                        </h3>
                        <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                          You’ll be notified here when there are updates on your
                          projects or investor inquiries.
                        </p>
                      </div>
                    )}
                  </div>
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
