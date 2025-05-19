
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, ArrowLeft, UserIcon, Building2Icon, Calendar, Clock, DollarSign, GlobeIcon, BarChart4 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { InvestmentSector, InvestmentCategory, Location } from "@/lib/types";

// Mock project data
const mockProjects = [
  {
    id: "project1",
    title: "Beirut Tech Hub",
    companyName: "Tech Innovations LLC",
    companyId: "company1",
    description: "A modern co-working and innovation space in central Beirut designed to foster technology startups and create a community of entrepreneurs.",
    longDescription: "The Beirut Tech Hub will be a state-of-the-art facility spanning 2,000 square meters in Downtown Beirut. The space will feature flexible workspaces, private offices, meeting rooms, event spaces, and a tech lab with the latest equipment. Our vision is to create Lebanon's premier innovation center that attracts talent, investors, and companies from across the MENA region.\n\nThe hub will offer membership plans ranging from hot desks to dedicated offices, as well as hosting regular networking events, workshops, and startup competitions. We've already secured partnerships with major technology companies who will provide resources and mentorship to our member startups.",
    category: "real_estate" as InvestmentCategory,
    sector: "technology" as InvestmentSector,
    riskLevel: "medium",
    expectedReturn: 15.5,
    minInvestment: 25000,
    targetAmount: 2000000,
    raisedAmount: 0,
    location: "beirut" as Location,
    duration: 36, // months
    status: "pending_review",
    submittedDate: "2025-05-10T14:30:00",
    deadline: "2025-08-15T23:59:59",
    highlights: [
      "Prime location in Beirut Digital District",
      "Expected 95% occupancy within 12 months",
      "Pre-interest from 15+ technology startups",
      "Partnership with international tech accelerator"
    ],
    team: [
      {
        name: "Nabil Haddad",
        role: "Founder & CEO",
        bio: "Former Google executive with 12 years experience in tech and real estate development",
        imageUrl: "/placeholder.svg"
      },
      {
        name: "Sarah Khoury",
        role: "Operations Director",
        bio: "Previously managed multiple co-working spaces across the Middle East",
        imageUrl: "/placeholder.svg"
      }
    ],
    financials: [
      { revenue: 400000, expenses: 310000, profit: 90000, year: 1 },
      { revenue: 820000, expenses: 580000, profit: 240000, year: 2 },
      { revenue: 1250000, expenses: 750000, profit: 500000, year: 3 }
    ],
    documents: [
      { title: "Business Plan", type: "pdf", url: "#" },
      { title: "Financial Projections", type: "excel", url: "#" },
      { title: "Location Blueprints", type: "pdf", url: "#" }
    ]
  },
  {
    id: "project2",
    title: "Cedar Heights Residences",
    companyName: "Cedar Investments",
    companyId: "company2", 
    description: "Luxury residential apartment complex in Mount Lebanon featuring modern amenities with sustainability at its core.",
    longDescription: "Cedar Heights Residences is a premium real estate development set in the scenic hills of Mount Lebanon, just 20 minutes from Beirut. The project consists of 45 luxury apartments spread across three buildings surrounded by landscaped gardens and offering panoramic mountain and sea views.\n\nEach residence features high-end finishes, smart home technology, energy-efficient design, and spacious layouts. Community amenities include a swimming pool, fitness center, children's playground, and 24/7 security. The development incorporates sustainable practices such as solar power, water recycling systems, and locally-sourced materials.\n\nConstruction is set to begin in Q3 2025 with completion expected by Q4 2027. Pre-sales have already secured commitment for 25% of the units.",
    category: "real_estate" as InvestmentCategory,
    sector: "real_estate" as InvestmentSector,
    riskLevel: "medium",
    expectedReturn: 12.8,
    minInvestment: 50000,
    targetAmount: 8000000,
    raisedAmount: 0,
    location: "mount_lebanon" as Location,
    duration: 60, // months
    status: "pending_review",
    submittedDate: "2025-05-08T09:45:00",
    deadline: "2025-07-30T23:59:59",
    highlights: [
      "Prime location with mountain and sea views",
      "25% of units already reserved through pre-sales",
      "Eco-friendly design with sustainability features",
      "Strong real estate market in the area with consistent appreciation"
    ],
    team: [
      {
        name: "Omar Bishara",
        role: "Development Director",
        bio: "20+ years experience in luxury real estate development across Lebanon",
        imageUrl: "/placeholder.svg"
      },
      {
        name: "Maya Saloum",
        role: "Chief Architect",
        bio: "Award-winning architect specializing in sustainable luxury designs",
        imageUrl: "/placeholder.svg"
      }
    ],
    financials: [
      { revenue: 0, expenses: 1200000, profit: -1200000, year: 1 },
      { revenue: 3500000, expenses: 2100000, profit: 1400000, year: 2 },
      { revenue: 5800000, expenses: 1800000, profit: 4000000, year: 3 }
    ],
    documents: [
      { title: "Project Prospectus", type: "pdf", url: "#" },
      { title: "Architectural Designs", type: "pdf", url: "#" },
      { title: "Construction Timeline", type: "pdf", url: "#" },
      { title: "Market Analysis", type: "pdf", url: "#" }
    ]
  }
];

const ProjectReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch project data
    setLoading(true);
    setTimeout(() => {
      const foundProject = mockProjects.find(p => p.id === id);
      setProject(foundProject || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleReviewSubmit = () => {
    if (!reviewAction) {
      toast({
        title: "Action required",
        description: "Please select either Approve or Reject before submitting",
        variant: "destructive"
      });
      return;
    }

    if (reviewAction === "reject" && !reviewNotes.trim()) {
      toast({
        title: "Review notes required",
        description: "Please provide feedback explaining the rejection reason",
        variant: "destructive"
      });
      return;
    }

    // Submit the review (mock)
    const actionText = reviewAction === "approve" ? "approved" : "rejected";
    
    toast({
      title: `Project ${actionText}`,
      description: `You have successfully ${actionText} this project submission`,
    });
    
    setTimeout(() => {
      navigate("/admin-dashboard");
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p className="text-lg">Loading project details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-900">Project Not Found</h2>
              <p className="mt-2 text-gray-500">
                The project you're looking for doesn't exist or has been removed.
              </p>
              <Button className="mt-4" asChild>
                <Link to="/admin-dashboard">Return to Dashboard</Link>
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
        <title>Project Review | LebVest Admin</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" asChild className="pl-0 mb-4">
            <Link to="/admin-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-lebanese-navy">Project Review</h1>
              <p className="text-gray-600">
                Review submission details and approve or reject this project
              </p>
            </div>
            <Badge className="bg-yellow-500">Pending Review</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="border-b bg-muted/50">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Building2Icon className="h-4 w-4 mr-1" />
                    {project.companyName} • Submitted on {formatDate(project.submittedDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-6">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="team">Team</TabsTrigger>
                      <TabsTrigger value="financials">Financials</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-6">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Project Summary</h3>
                        <p className="text-gray-700">{project.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-2">Extended Description</h3>
                        <div className="text-gray-700 whitespace-pre-line">
                          {project.longDescription}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-lg mb-2">Highlights</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {project.highlights.map((highlight: string, index: number) => (
                            <li key={index} className="text-gray-700">{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <div className="flex items-start space-x-3">
                            <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Investment Details</h4>
                              <div className="space-y-2 mt-2">
                                <div>
                                  <span className="text-sm text-gray-500">Category:</span>
                                  <p className="font-medium capitalize">{project.category.replace('_', ' ')}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Sector:</span>
                                  <p className="font-medium capitalize">{project.sector.replace('_', ' ')}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Risk Level:</span>
                                  <p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelBadgeClass(project.riskLevel)}`}>
                                      {project.riskLevel.charAt(0).toUpperCase() + project.riskLevel.slice(1)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-start space-x-3">
                            <BarChart4 className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Financial Targets</h4>
                              <div className="space-y-2 mt-2">
                                <div>
                                  <span className="text-sm text-gray-500">Target Amount:</span>
                                  <p className="font-medium">{formatCurrency(project.targetAmount)}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Minimum Investment:</span>
                                  <p className="font-medium">{formatCurrency(project.minInvestment)}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Expected Return:</span>
                                  <p className="font-medium">{project.expectedReturn}%</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-start space-x-3">
                            <GlobeIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Location</h4>
                              <div className="space-y-2 mt-2">
                                <div>
                                  <span className="text-sm text-gray-500">Region:</span>
                                  <p className="font-medium capitalize">{project.location.replace('_', ' ')}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-start space-x-3">
                            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Timeline</h4>
                              <div className="space-y-2 mt-2">
                                <div>
                                  <span className="text-sm text-gray-500">Duration:</span>
                                  <p className="font-medium">{project.duration} months</p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Funding Deadline:</span>
                                  <p className="font-medium">{formatDate(project.deadline)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="team">
                      <div className="space-y-6">
                        <h3 className="font-medium text-lg">Project Team</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {project.team.map((member: any, index: number) => (
                            <Card key={index} className="overflow-hidden">
                              <div className="flex sm:flex-col md:flex-row items-start">
                                <div className="sm:w-full md:w-1/3 p-4">
                                  <div className="w-20 h-20 rounded-full mx-auto overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {member.imageUrl ? (
                                      <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <UserIcon className="h-12 w-12 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                                <div className="p-4 sm:w-full md:w-2/3">
                                  <h4 className="font-medium text-lg">{member.name}</h4>
                                  <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                                  <p className="text-sm text-gray-700">{member.bio}</p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="financials">
                      <div className="space-y-6">
                        <h3 className="font-medium text-lg">Financial Projections</h3>
                        <div className="overflow-x-auto border rounded-md">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Year
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Projected Revenue
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Projected Expenses
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Projected Profit
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {project.financials.map((year: any, index: number) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Year {year.year}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {formatCurrency(year.revenue)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {formatCurrency(year.expenses)}
                                  </td>
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${year.profit >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}`}>
                                    {formatCurrency(year.profit)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="documents">
                      <div className="space-y-6">
                        <h3 className="font-medium text-lg">Submitted Documents</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {project.documents.map((doc: any, index: number) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 flex items-center justify-center bg-lebanese-navy/10 rounded">
                                  <span className="uppercase text-xs font-bold text-lebanese-navy">
                                    {doc.type}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{doc.title}</h4>
                                  <Button variant="link" className="h-6 p-0" asChild>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                      View document
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Review Decision</CardTitle>
                  <CardDescription>
                    Review the project details and make your decision
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Review Notes</label>
                    <Textarea
                      placeholder="Add your review notes here. If rejecting the project, provide clear reasons..."
                      className="min-h-[150px]"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Action</label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className={`border-2 ${reviewAction === "approve" ? "border-green-500 bg-green-50" : ""}`}
                        onClick={() => setReviewAction("approve")}
                      >
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className={`border-2 ${reviewAction === "reject" ? "border-red-500 bg-red-50" : ""}`}
                        onClick={() => setReviewAction("reject")}
                      >
                        <X className="mr-2 h-4 w-4 text-red-600" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleReviewSubmit}
                  >
                    Submit Review
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectReview;
