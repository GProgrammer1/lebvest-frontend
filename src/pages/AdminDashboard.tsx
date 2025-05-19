import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  ShieldAlert,
  FileText,
  BarChart4,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@radix-ui/react-checkbox";

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "investor",
    status: "active",
    joinDate: "2023-05-15",
  },
  {
    id: 2,
    name: "Tech Innovations LLC",
    email: "contact@techinno.com",
    role: "company",
    status: "active",
    joinDate: "2023-06-22",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "investor",
    status: "inactive",
    joinDate: "2023-07-10",
  },
  {
    id: 4,
    name: "Cedar Investments",
    email: "info@cedarinvest.com",
    role: "company",
    status: "active",
    joinDate: "2023-08-05",
  },
  {
    id: 5,
    name: "Admin User",
    email: "admin@lebvest.com",
    role: "admin",
    status: "active",
    joinDate: "2023-04-01",
  },
  {
    id: 6,
    name: "Rachel Green",
    email: "rachel@example.com",
    role: "investor",
    status: "pending",
    joinDate: "2023-09-18",
  },
];

// Mock data for projects
const mockProjects = [
  {
    id: 101,
    name: "Beirut Tech Hub",
    company: "Tech Innovations LLC",
    category: "technology",
    status: "active",
    submittedDate: "2023-06-30",
  },
  {
    id: 102,
    name: "Cedar Heights Residences",
    company: "Cedar Investments",
    category: "real_estate",
    status: "pending_review",
    submittedDate: "2023-08-10",
  },
  {
    id: 103,
    name: "Sustainable Agriculture Initiative",
    company: "Green Fields Co.",
    category: "agriculture",
    status: "rejected",
    submittedDate: "2023-07-22",
  },
  {
    id: 104,
    name: "Education Tech Platform",
    company: "EduLearn",
    category: "education",
    status: "active",
    submittedDate: "2023-09-05",
  },
];

// Mock metrics
const mockMetrics = {
  totalUsers: 782,
  activeInvestors: 516,
  registeredCompanies: 124,
  totalProjects: 87,
  activeProjects: 42,
  totalInvestments: "$4.8M",
  monthlyGrowth: {
    users: "+8.5%",
    projects: "+12.3%",
    investments: "+5.7%",
  },
};

const AdminDashboard = () => {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<
    "all" | "investor" | "company" | "admin"
  >("all");
  const [userStatusFilter, setUserStatusFilter] = useState<
    "all" | "active" | "inactive" | "pending"
  >("all");

  // Projects
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<
    "all" | "technology" | "real_estate" | "agriculture" | "education"
  >("all");
  const [projectStatusFilter, setProjectStatusFilter] = useState<
    "all" | "active" | "pending_review" | "rejected"
  >("all");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter((user) => {
    // Apply search filter
    if (
      userSearchQuery &&
      !user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    ) {
      return false;
    }
    if (userRoleFilter !== "all" && user.role !== userRoleFilter) {
      return false;
    }
    if (userStatusFilter !== "all" && user.status !== userStatusFilter)
      return false;

    // Apply role filter
    if (userRoleFilter && user.role !== userRoleFilter) {
      return false;
    }

    // Apply status filter
    if (userStatusFilter && user.status !== userStatusFilter) {
      return false;
    }

    return true;
  });

  const filteredProjects = mockProjects.filter((project) => {
    // Apply search filter
    if (
      projectSearchQuery &&
      !project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) &&
      !project.company.toLowerCase().includes(projectSearchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      projectCategoryFilter !== "all" &&
      project.category !== projectCategoryFilter
    )
      return false;
    if (projectStatusFilter !== "all" && project.status !== projectStatusFilter)
      return false;
    // Apply category filter
    if (projectCategoryFilter && project.category !== projectCategoryFilter) {
      return false;
    }

    // Apply status filter
    if (projectStatusFilter && project.status !== projectStatusFilter) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return (
          <Badge variant="outline" className="text-gray-500">
            Inactive
          </Badge>
        );
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Admin Dashboard | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ShieldAlert className="mr-2 h-8 w-8 text-lebanese-navy" />
              <div>
                <h1 className="text-2xl font-bold text-lebanese-navy">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Platform management and oversight
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Total Users
                    </div>
                    <div className="text-3xl font-bold">
                      {mockMetrics.totalUsers}
                    </div>
                  </div>
                  <Users className="h-10 w-10 text-lebanese-navy bg-lebanese-navy/10 p-2 rounded-full" />
                </div>
                <div className="text-sm text-green-600 mt-2">
                  {mockMetrics.monthlyGrowth.users} this month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Active Projects
                    </div>
                    <div className="text-3xl font-bold">
                      {mockMetrics.activeProjects}
                    </div>
                  </div>
                  <FileText className="h-10 w-10 text-lebanese-navy bg-lebanese-navy/10 p-2 rounded-full" />
                </div>
                <div className="text-sm text-green-600 mt-2">
                  {mockMetrics.monthlyGrowth.projects} this month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Total Investments
                    </div>
                    <div className="text-3xl font-bold">
                      {mockMetrics.totalInvestments}
                    </div>
                  </div>
                  <BarChart4 className="h-10 w-10 text-lebanese-navy bg-lebanese-navy/10 p-2 rounded-full" />
                </div>
                <div className="text-sm text-green-600 mt-2">
                  {mockMetrics.monthlyGrowth.investments} this month
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="projects">Project Moderation</TabsTrigger>
              <TabsTrigger value="reports">Analytics & Reports</TabsTrigger>
              <TabsTrigger value="settings">Platform Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">User Management</CardTitle>
                  <CardDescription>
                    Manage platform users, review applications, and control
                    access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search users by name or email..."
                        className="pl-9"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Select
                        value={userRoleFilter}
                        onValueChange={(value) =>
                          setUserRoleFilter(
                            value as "all" | "investor" | "company" | "admin"
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All roles</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={userStatusFilter}
                        onValueChange={(value) =>
                          setUserStatusFilter(
                            value as "all" | "active" | "inactive" | "pending"
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-mono">
                                {user.id}
                              </TableCell>
                              <TableCell className="font-medium">
                                {user.name}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell className="capitalize">
                                {user.role}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(user.status)}
                              </TableCell>
                              <TableCell>
                                {new Date(user.joinDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="space-x-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-200 hover:border-red-300 hover:bg-red-50"
                                >
                                  {user.status === "active"
                                    ? "Deactivate"
                                    : "Activate"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                              No users match your filter criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Project Moderation</CardTitle>
                  <CardDescription>
                    Review and approve project submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search projects..."
                        className="pl-9"
                        value={projectSearchQuery}
                        onChange={(e) => setProjectSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Select
                        value={projectCategoryFilter}
                        onValueChange={(value) =>
                          setProjectCategoryFilter(
                            value as
                              | "all"
                              | "technology"
                              | "real_estate"
                              | "agriculture"
                              | "education"
                          )
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All categories</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="real_estate">
                            Real Estate
                          </SelectItem>
                          <SelectItem value="agriculture">
                            Agriculture
                          </SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={projectStatusFilter}
                        onValueChange={(value) =>
                          setProjectStatusFilter(
                            value as
                              | "all"
                              | "active"
                              | "pending_review"
                              | "rejected"
                          )
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending_review">
                            Pending Review
                          </SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Project Name</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.length > 0 ? (
                          filteredProjects.map((project) => (
                            <TableRow key={project.id}>
                              <TableCell className="font-mono">
                                {project.id}
                              </TableCell>
                              <TableCell className="font-medium">
                                {project.name}
                              </TableCell>
                              <TableCell>{project.company}</TableCell>
                              <TableCell className="capitalize">
                                {project.category.replace("_", " ")}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(project.status)}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  project.submittedDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="space-x-2">
                                <Button variant="outline" size="sm">
                                  Review
                                </Button>
                                {project.status === "pending_review" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-green-200 hover:border-green-300 hover:bg-green-50"
                                    >
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-red-200 hover:border-red-300 hover:bg-red-50"
                                    >
                                      <AlertCircle className="mr-1 h-3 w-3" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                              No projects match your filter criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Analytics & Reports</CardTitle>
                  <CardDescription>
                    Platform performance metrics and reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          User Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Users:</span>
                            <span className="font-medium">
                              {mockMetrics.totalUsers}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Active Investors:
                            </span>
                            <span className="font-medium">
                              {mockMetrics.activeInvestors}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Registered Companies:
                            </span>
                            <span className="font-medium">
                              {mockMetrics.registeredCompanies}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              User Growth (Monthly):
                            </span>
                            <span className="font-medium text-green-600">
                              {mockMetrics.monthlyGrowth.users}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Project Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total Projects:
                            </span>
                            <span className="font-medium">
                              {mockMetrics.totalProjects}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Active Projects:
                            </span>
                            <span className="font-medium">
                              {mockMetrics.activeProjects}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total Investments:
                            </span>
                            <span className="font-medium">
                              {mockMetrics.totalInvestments}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Investment Growth (Monthly):
                            </span>
                            <span className="font-medium text-green-600">
                              {mockMetrics.monthlyGrowth.investments}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="outline">Export User Report</Button>
                    <Button variant="outline">Export Investment Report</Button>
                    <Button className="bg-lebanese-navy hover:bg-opacity-90">
                      Generate Full Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Platform Settings</CardTitle>
                  <CardDescription>
                    Configure system behaviors, thresholds, and integrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Project Moderation */}
                    <div>
                      <h3 className="font-medium text-lg mb-3">
                        Project Moderation
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h4 className="font-medium">
                              Auto-Approve Threshold
                            </h4>
                            <p className="text-sm text-gray-500">
                              If funding goal ≥ this %, auto-approve project
                              listing
                            </p>
                          </div>
                          <div className="w-[100px]">
                            <Input
                              type="number"
                              defaultValue={80}
                              className="text-right"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pb-3">
                          <div>
                            <h4 className="font-medium">
                              Maximum Pending Duration
                            </h4>
                            <p className="text-sm text-gray-500">
                              Days before pending projects are auto-rejected
                            </p>
                          </div>
                          <div className="w-[100px]">
                            <Input
                              type="number"
                              defaultValue={14}
                              className="text-right"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div>
                      <h3 className="font-medium text-lg mb-3">
                        Notification Settings
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h4 className="font-medium">
                              Funding Threshold Alert
                            </h4>
                            <p className="text-sm text-gray-500">
                              Notify admins when any project reaches this %
                              funded
                            </p>
                          </div>
                          <div className="w-[100px]">
                            <Input
                              type="number"
                              defaultValue={90}
                              className="text-right"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pb-3">
                          <div>
                            <h4 className="font-medium">Daily Digest Time</h4>
                            <p className="text-sm text-gray-500">
                              Send daily summary email at this hour (24h clock)
                            </p>
                          </div>
                          <div className="w-[100px]">
                            <Select defaultValue="08:00">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, h) => (
                                  <SelectItem
                                    key={h}
                                    value={`${String(h).padStart(2, "0")}:00`}
                                  >
                                    {String(h).padStart(2, "0")}:00
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Predictions */}
                    <div>
                      <h3 className="font-medium text-lg mb-3">AI Insights</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h4 className="font-medium">
                              Enable AI Predictions
                            </h4>
                            <p className="text-sm text-gray-500">
                              Toggle on to generate profit/risk forecasts for
                              new listings
                            </p>
                          </div>
                          <Checkbox defaultChecked />
                        </div>
                        <div className="flex items-center justify-between pb-3">
                          <div>
                            <h4 className="font-medium">
                              Confidence Threshold
                            </h4>
                            <p className="text-sm text-gray-500">
                              Only show AI predictions ≥ this score
                            </p>
                          </div>
                          <div className="w-[100px]">
                            <Input
                              type="number"
                              defaultValue={75}
                              className="text-right"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Data Retention */}
                    <div>
                      <h3 className="font-medium text-lg mb-3">
                        Data Retention
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h4 className="font-medium">User Log Retention</h4>
                            <p className="text-sm text-gray-500">
                              Days to keep audit logs before purging
                            </p>
                          </div>
                          <div className="w-[100px]">
                            <Input
                              type="number"
                              defaultValue={90}
                              className="text-right"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-lebanese-navy hover:bg-opacity-90">
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
