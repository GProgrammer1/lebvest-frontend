
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

// Mock data for investors
const mockInvestors = [
  {
    id: "inv1",
    name: "John Smith",
    portfolioSize: 150000,
    riskLevel: "medium",
    sectors: ["real_estate", "technology"],
    active: true,
  },
  {
    id: "inv2",
    name: "Sarah Johnson",
    portfolioSize: 300000,
    riskLevel: "high",
    sectors: ["startup", "healthcare"],
    active: true,
  },
  {
    id: "inv3",
    name: "Michael Brown",
    portfolioSize: 75000,
    riskLevel: "low",
    sectors: ["government_bonds", "real_estate"],
    active: true,
  },
  {
    id: "inv4",
    name: "Jessica Lee",
    portfolioSize: 250000,
    riskLevel: "medium",
    sectors: ["technology", "education"],
    active: true,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [minPortfolio, setMinPortfolio] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  const filteredInvestors = mockInvestors.filter((investor) => {
    // Apply search filter
    if (
      searchQuery &&
      !investor.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Apply risk level filter
    if (riskFilter && investor.riskLevel !== riskFilter) {
      return false;
    }

    // Apply min portfolio filter
    if (minPortfolio && investor.portfolioSize < parseInt(minPortfolio)) {
      return false;
    }

    // Apply sector filter
    if (sectorFilter && !investor.sectors.includes(sectorFilter)) {
      return false;
    }

    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
              <h1 className="text-2xl font-bold text-lebanese-navy">Company Dashboard</h1>
              <p className="text-gray-600">Find potential investors for your projects</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-lebanese-navy hover:bg-opacity-90">
                Update Company Profile
              </Button>
            </div>
          </div>

          <Tabs defaultValue="investors" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="investors">Find Investors</TabsTrigger>
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                      <Select value={riskFilter} onValueChange={setRiskFilter}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All levels</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={minPortfolio} onValueChange={setMinPortfolio}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Min portfolio size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any amount</SelectItem>
                          <SelectItem value="50000">$50,000+</SelectItem>
                          <SelectItem value="100000">$100,000+</SelectItem>
                          <SelectItem value="250000">$250,000+</SelectItem>
                          <SelectItem value="500000">$500,000+</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={sectorFilter} onValueChange={setSectorFilter}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Sector interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All sectors</SelectItem>
                          <SelectItem value="real_estate">Real Estate</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="startup">Startups</SelectItem>
                          <SelectItem value="government_bonds">Gov. Bonds</SelectItem>
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
                        {filteredInvestors.length > 0 ? (
                          filteredInvestors.map((investor) => (
                            <TableRow key={investor.id}>
                              <TableCell className="font-medium">{investor.name}</TableCell>
                              <TableCell>{formatCurrency(investor.portfolioSize)}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  investor.riskLevel === "low" 
                                    ? "bg-blue-100 text-blue-700" 
                                    : investor.riskLevel === "medium" 
                                    ? "bg-yellow-100 text-yellow-700" 
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {investor.riskLevel.charAt(0).toUpperCase() + investor.riskLevel.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell>
                                {investor.sectors.map((sector) => (
                                  <span 
                                    key={sector}
                                    className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700 mr-1 mb-1"
                                  >
                                    {sector.replace('_', ' ')}
                                  </span>
                                ))}
                              </TableCell>
                              <TableCell>
                                <Link to={`/investor-profile/${investor.id}`}>
                                  <Button variant="outline" size="sm">View Profile</Button>
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
                    <Button className="bg-lebanese-navy hover:bg-opacity-90">
                      + New Project
                    </Button>
                  </div>
                  
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Filter className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
                    <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                      Get started by creating your first investment project to attract funding
                    </p>
                    <div className="mt-6">
                      <Button>Create Your First Project</Button>
                    </div>
                  </div>
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
                        <div className="text-sm font-medium text-gray-500">Profile Views</div>
                        <div className="text-3xl font-bold mt-2">124</div>
                        <div className="text-sm text-green-600 mt-1">+12% from last month</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-sm font-medium text-gray-500">Investor Inquiries</div>
                        <div className="text-3xl font-bold mt-2">8</div>
                        <div className="text-sm text-green-600 mt-1">+3 new this week</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-sm font-medium text-gray-500">Funding Progress</div>
                        <div className="text-3xl font-bold mt-2">$0</div>
                        <div className="text-sm text-gray-500 mt-1">No active funding rounds</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">Detailed analytics coming soon</h3>
                        <p className="mt-1 text-gray-500 max-w-md mx-auto">
                          Create and publish your first project to start collecting detailed analytics and insights
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
