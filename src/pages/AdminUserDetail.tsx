
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, User, Mail, Calendar, Shield, CheckCircle, XCircle, Lock, Unlock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";
import { Building2, FileCheck, FileX } from "lucide-react";

interface UserDetail {
  id: number;
  name: string;
  email: string;
  roles: string[];
  status: string;
  createdAt: string;
  lastLogin?: string;
  enabled: boolean;
  locked: boolean;
  companyStatus?: string;
  verificationDocumentsApproved?: boolean;
  companyId?: number;
}

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "User ID is missing.",
          variant: "destructive",
        });
        navigate("/admin-dashboard");
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiClient.get<ResponsePayload>(`/admin/users/${id}`);
        if (response.data.status === 200) {
          setUser(response.data.data.user);
        } else {
          toast({
            title: "Error",
            description: "Failed to load user details.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching user details:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load user details.",
          variant: "destructive",
        });
        navigate("/admin-dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, navigate, toast]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "locked":
        return <Badge className="bg-red-700">Locked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCompanyStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    // Handle both enum names (PENDING, APPROVED, etc.) and display names (Pending, Approved, etc.)
    const statusUpper = status.toUpperCase();
    const statusNormalized = statusUpper.replace(/_/g, "_");
    
    if (statusUpper === "PENDING" || status === "Pending") {
      return <Badge className="bg-yellow-500">Pending</Badge>;
    } else if (statusUpper === "APPROVED" || status === "Approved") {
      return <Badge className="bg-blue-500">Approved</Badge>;
    } else if (statusUpper === "PENDING_DOCS" || status === "Pending Documentation") {
      return <Badge className="bg-orange-500">Pending Documentation</Badge>;
    } else if (statusUpper === "FULLY_VERIFIED" || status === "Fully Verified") {
      return <Badge className="bg-green-500">Fully Verified</Badge>;
    } else if (statusUpper === "REJECTED" || status === "Rejected") {
      return <Badge className="bg-red-500">Rejected</Badge>;
    } else {
      return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCompanyStatusDescription = (status?: string) => {
    if (!status) return "Status unknown";
    
    // Handle both enum names (PENDING, APPROVED, etc.) and display names (Pending, Approved, etc.)
    const statusUpper = status.toUpperCase();
    
    if (statusUpper === "PENDING" || status === "Pending") {
      return "Initial signup, awaiting admin approval";
    } else if (statusUpper === "APPROVED" || status === "Approved") {
      return "Step 1 approved - can browse but cannot post projects";
    } else if (statusUpper === "PENDING_DOCS" || status === "Pending Documentation") {
      return "Step 2 documents submitted, awaiting admin approval";
    } else if (statusUpper === "FULLY_VERIFIED" || status === "Fully Verified") {
      return "Both steps approved - can post investment projects";
    } else if (statusUpper === "REJECTED" || status === "Rejected") {
      return "Company signup was rejected";
    } else {
      return "Unknown status";
    }
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading User Details | LebVest</title>
        </Helmet>
        <Navbar />
        <main className="flex-grow p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-10 w-32 mb-4" />
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* User Information Card Skeleton */}
            <Card className="mb-6">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Verification Status Card Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>User Not Found | LebVest</title>
        </Helmet>
        <Navbar />
        <main className="flex-grow p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-600">User not found.</p>
              <Button asChild className="mt-4">
                <Link to="/admin-dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Details - {user.name} | LebVest Admin</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/admin-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-lebanese-navy">User Details</h1>
            <p className="text-gray-600 mt-1">View and manage user information</p>
          </div>

          {/* User Information Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
              <CardDescription>Basic user account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-lg font-semibold">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(user.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Name
                  </label>
                  <p className="text-lg">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Roles
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.roles && Array.isArray(user.roles) && user.roles.length > 0 ? (
                      user.roles.map((role, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {typeof role === 'string' ? role : String(role)}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">No roles assigned</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Account Created
                  </label>
                  <p className="text-lg">{formatDate(user.createdAt)}</p>
                </div>
                {user.lastLogin && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <p className="text-lg">{formatDate(user.lastLogin)}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Account State</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.enabled ? (
                      <Badge className="bg-green-500 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Disabled
                      </Badge>
                    )}
                    {user.locked ? (
                      <Badge className="bg-red-700 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Unlock className="h-3 w-3" />
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Verification Status Card - Only show if user is a company */}
          {user.roles && user.roles.some((role: string) => role.toLowerCase() === 'company') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Verification Status
                </CardTitle>
                <CardDescription>Two-step verification process for companies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                      Step 1: Company Signup Status
                    </label>
                    <div className="mt-1">
                      {getCompanyStatusBadge(user.companyStatus)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getCompanyStatusDescription(user.companyStatus)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center gap-1">
                      Step 2: Verification Documents
                      {user.verificationDocumentsApproved !== undefined && (
                        user.verificationDocumentsApproved ? (
                          <FileCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <FileX className="h-4 w-4 text-yellow-500" />
                        )
                      )}
                    </label>
                    <div className="mt-1">
                      {user.verificationDocumentsApproved === true ? (
                        <Badge className="bg-green-500">Approved</Badge>
                      ) : user.verificationDocumentsApproved === false && user.companyStatus ? (
                        <Badge className="bg-yellow-500">Pending Approval</Badge>
                      ) : (
                        <Badge variant="outline">Not Submitted</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {user.verificationDocumentsApproved === true
                        ? "Documents have been reviewed and approved"
                        : user.verificationDocumentsApproved === false && user.companyStatus
                        ? "Documents submitted, awaiting admin review"
                        : "Company has not submitted verification documents yet"}
                    </p>
                  </div>
                  {user.companyId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company ID</label>
                      <p className="text-lg font-semibold">{user.companyId}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminUserDetail;

