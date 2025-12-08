import { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
// ... imports ...
  useUsers, useProjects, adminKeys
} from "@/hooks/useAdminQueries";
import { useAdminPayouts } from "@/hooks/usePayoutQueries";
// ... imports ...

// ...

  const [usersPage, setUsersPage] = useState(0);
  const [projectsPage, setProjectsPage] = useState(0);

  // React Query hooks for users - Use useMemo to prevent unnecessary re-renders
  const usersParams = useMemo(() => ({
    role: userRoleFilter !== "All" ? userRoleFilter.toUpperCase() as "INVESTOR" | "COMPANY" | "ADMIN" : undefined,
    status: userStatusFilter !== "All" ? userStatusFilter as "active" | "inactive" | "locked" : undefined,
    search: userSearchQuery || undefined,
    page: usersPage,
    size: 20,
  }), [userRoleFilter, userStatusFilter, userSearchQuery, usersPage]);

  const { data: usersData, isLoading: usersLoading, isFetching: usersFetching, error: usersError } = useUsers(usersParams);
  
  // Debug logging
// ...
  
  // React Query hooks for projects - Use useMemo
  const projectsParams = useMemo(() => ({
    status: projectStatusFilter === "All" 
      ? "ALL" as const
      : (projectStatusFilter === "pending_review" 
          ? "PENDING_REVIEW" as const
          : projectStatusFilter === "active"
          ? "APPROVED" as const
          : "REJECTED" as const),
    category: projectCategoryFilter !== "All" 
      ? projectCategoryFilter.toUpperCase().replace(/\s+/g, '_')
      : undefined,
    search: projectSearchQuery || undefined,
    page: projectsPage,
    size: 20,
  }), [projectStatusFilter, projectCategoryFilter, projectSearchQuery, projectsPage]);

  const { data: projectsData, isLoading: projectsLoading, isFetching: projectsFetching, error: projectsError } = useProjects(projectsParams);
  
  // ...

  // WebSocket connection for user activity monitoring (admin only)
  const { isConnected: isWebSocketConnected } = useWebSocket({
    enabled: isAdmin && isAuthenticated,
    onUserActivity: useCallback((message: any) => {
      // OPTIMIZED: Update user's online status in React Query cache directly instead of refetching
      // This prevents full list reload which causes flickering and slowness
      try {
        // Check if message has userId and isOnline status
        const activityData = typeof message === 'string' ? JSON.parse(message) : message;
        const { userId, isOnline, lastSeen } = activityData;
        
        if (userId) {
          // Optimistically update the user in the cache
          queryClient.setQueriesData({ queryKey: adminKeys.users(usersParams) }, (oldData: any) => {
            if (!oldData || !oldData.users) return oldData;
            
            return {
              ...oldData,
              users: oldData.users.map((user: any) => {
                if (user.id === userId) {
                  return { 
                    ...user, 
                    isOnline: isOnline,
                    lastSeen: lastSeen || (isOnline ? new Date().toISOString() : user.lastSeen)
                  };
                }
                return user;
              })
            };
          });
        }
      } catch (e) {
        console.error("Error updating user status from WebSocket:", e);
        // Fallback to invalidation only if update fails, and debounce it
        // queryClient.invalidateQueries({ queryKey: adminKeys.users(usersParams) }); 
      }
    }, [queryClient, usersParams]),
    onConnect: () => {
      // WebSocket connected - user will be marked online via heartbeat
    },
    onDisconnect: () => {
      // WebSocket disconnected - handled silently
    },
  });

  // Reset to first page when filters change
  useEffect(() => {
    setUsersPage(0);
  }, [userRoleFilter, userStatusFilter, userSearchQuery]);

  useEffect(() => {
    setProjectsPage(0);
  }, [projectStatusFilter, projectCategoryFilter, projectSearchQuery]);

  const filteredUsers = users; // Already filtered by API

  const filteredProjects = projects; // Already filtered by API

  const formatDate = (date: string | Date) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date:", date);
      return "Invalid date";
    }

    return parsedDate.toISOString().split("T")[0];
  };

  const {
    data: payload,
    error,
    isSuccess,
    isError,
    isLoading,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/admin/notifications", {
          timeout: 30000, // 30 seconds for admin notifications
        });
        return response.data as ResponsePayload;
      } catch (err: any) {
        console.error("Failed to fetch notificaitons: ", err.message);
        // Return a default response payload to prevent undefined error
        return {
          status: 500,
          message: "Failed to fetch notifications",
          data: { notifications: [] },
          timestamp: new Date(),
        } as ResponsePayload;
      }
    },
  });

  const unreadCount = notifications.filter((noti) => !noti.isRead).length;

  const handleApprove = async (reqId: number, notificationId: number) => {
    try {
      const response = await apiClient.post(
        "/admin/accept-request",
        {
          reqId,
          notificationId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        description:
          "An account will be created for this company and a confirmation email was sent successfully",
        title: "Success!",
        variant: "success",
      });
      setNotifications((prev) =>
        prev.map((noti) =>
          noti.id === notificationId ? { ...noti, isAccepted: true } : noti
        )
      );
    } catch (ex) {
      console.error("Error accepting signup req:", ex.message);
      toast({
        description: "Something went wrong",
        title: "Error!",
        variant: "error",
      });
    }
  };
  const handleApproveVerification = async (companyId: number, notificationId: number) => {
    try {
      const response = await apiClient.post(
        `/admin/approve-verification/${companyId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        description: "Company verification approved. Company can now post projects.",
        title: "Success!",
        variant: "success",
      });
      
      // Update notification state immediately
      setNotifications((prev) =>
        prev.map((noti) =>
          noti.id === notificationId ? { ...noti, isAccepted: true } : noti
        )
      );
      
      // Refetch notifications after a short delay to ensure backend has persisted
      // This ensures the notification stays visible with "Approved" status
      setTimeout(() => {
        if (refetchNotifications) {
          refetchNotifications();
        }
      }, 500);
    } catch (ex: any) {
      console.error("Error approving verification:", ex.message);
      toast({
        description: ex.response?.data?.message || "Something went wrong",
        title: "Error!",
        variant: "error",
      });
    }
  };

  const handleRejectVerification = async (companyId: number, notificationId: number, reason: string) => {
    try {
      const response = await apiClient.post(
        `/admin/reject-verification/${companyId}`,
        { reason },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        description: "Company verification rejected. Company can resubmit documents.",
        title: "Success!",
        variant: "success",
      });
      
      // Update notification state immediately
      setNotifications((prev) =>
        prev.map((noti) =>
          noti.id === notificationId ? { ...noti, isAccepted: false } : noti
        )
      );
      
      setRejectingId(null);
      setRejectionReason("");
      
      // Refetch notifications after a short delay to ensure backend has persisted
      // This ensures the notification stays visible with "Rejected" status
      setTimeout(() => {
        if (refetchNotifications) {
          refetchNotifications();
        }
      }, 500);
    } catch (ex: any) {
      console.error("Error rejecting verification:", ex.message);
      toast({
        description: ex.response?.data?.message || "Something went wrong",
        title: "Error!",
        variant: "error",
      });
    }
  };

  const handleReject = async (
    reqId: number,
    notificationId: number,
    reason: string
  ) => {
    try {
      const response = await apiClient.put(
        "/admin/reject-request",
        {
          reqId,
          notificationId,
          reason,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setNotifications((prev) =>
        prev.map((noti) =>
          noti.id === notificationId ? { ...noti, isAccepted: false } : noti
        )
      );
    } catch (ex) {
      console.error("Error rejecting signup req:", ex.message);
      toast({
        description: "Something went wrong",
        title: "Error!",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (isSuccess && payload?.data?.notifications) {
      console.log("Notifi: ", payload.data.notifications);
      setNotifications(payload.data.notifications);
    } else if (isError || !payload?.data?.notifications) {
      setNotifications([]);
    }
  }, [isSuccess, isError, payload]);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SIGNUP_REQUEST":
        return (
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-blue-600" />
          </div>
        );
      case "PROJECT_PROPOSAL":
        return (
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
        );
      case "VERIFICATION_REQUEST":
        return (
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
        );
      case "APP_STAT_UPDATE":
        return (
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <BarChart4 className="h-6 w-6 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-gray-500" />
          </div>
        );
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("No authToken found in localStorage");
      return;
    }

    // Debug: Try to decode token and see what claims it has
    let decodedToken: any = null;
    try {
      decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log("Token claims:", decodedToken);
      console.log("Available claims:", Object.keys(decodedToken));
      console.log("userId value (direct):", decodedToken?.userId, "type:", typeof decodedToken?.userId);
    } catch (e) {
      console.error("Failed to decode token for debugging:", e);
    }

    let adminId = getClaim("userId", token);
    
    // If userId is not found via getClaim, try to get it from the decoded token directly
    if (!adminId && decodedToken) {
      // Try different possible keys and handle number/string conversion
      const userIdValue = decodedToken.userId ?? decodedToken.id ?? decodedToken.user_id;
      if (userIdValue !== null && userIdValue !== undefined) {
        adminId = String(userIdValue);
        console.log("Found adminId from decoded token directly:", adminId);
      }
    }
    
    if (!adminId) {
      console.error("Could not extract admin ID from token. Token exists but userId claim is missing or empty.");
      console.error("Token structure:", decodedToken);
      console.error("userId from decodedToken:", decodedToken?.userId);
      // Try alternative claim names
      const idClaim = getClaim("id", token);
      const subClaim = getClaim("sub", token);
      console.log("Tried alternative claims - id:", idClaim, "sub:", subClaim);
      return;
    }
    
    console.log("Successfully extracted adminId:", adminId);

    // Get API URL from environment variable or use default
    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';
    // Remove trailing slash if present
    const baseUrl = apiUrl.replace(/\/$/, '');
    // Pass token as query parameter since EventSource doesn't support custom headers
    const sseUrl = `${baseUrl}/sse/admin/company-signups?adminId=${adminId}&token=${encodeURIComponent(token)}`;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000; // 3 seconds

    const connect = () => {
      try {
        eventSource = new EventSource(sseUrl);

        eventSource.addEventListener("company-signup", (event: MessageEvent) => {
          try {
            console.log("New event:", event);
            const newRequest = JSON.parse(event.data);
            console.log("New company signup request received via SSE:", newRequest);
            setNotifications((prev) => [...prev, newRequest]);
            reconnectAttempts = 0; // Reset on successful message
          } catch (err) {
            console.error("Failed to parse SSE data:", err);
          }
        });

        eventSource.addEventListener("verification-request", (event: MessageEvent) => {
          try {
            console.log("New verification request event:", event);
            const newRequest = JSON.parse(event.data);
            console.log("New verification request received via SSE:", newRequest);
            setNotifications((prev) => [...prev, newRequest]);
            reconnectAttempts = 0; // Reset on successful message
          } catch (err) {
            console.error("Failed to parse SSE data:", err);
          }
        });

        eventSource.addEventListener("project-proposal", (event: MessageEvent) => {
          try {
            console.log("New project proposal event:", event);
            const newRequest = JSON.parse(event.data);
            console.log("New project proposal received via SSE:", newRequest);
            setNotifications((prev) => [...prev, newRequest]);
            reconnectAttempts = 0; // Reset on successful message
          } catch (err) {
            console.error("Failed to parse SSE data:", err);
          }
        });

        eventSource.onopen = () => {
          console.log("SSE connection opened");
          reconnectAttempts = 0; // Reset on successful connection
        };

        eventSource.onerror = (err) => {
          console.error("SSE connection error:", err);
          
          // Only reconnect if we haven't exceeded max attempts
          if (reconnectAttempts < maxReconnectAttempts && eventSource?.readyState === EventSource.CLOSED) {
            reconnectAttempts++;
            console.log(`Attempting to reconnect SSE (attempt ${reconnectAttempts}/${maxReconnectAttempts})...`);
            
            if (eventSource) {
              eventSource.close();
            }
            
            reconnectTimeout = setTimeout(() => {
              connect();
            }, reconnectDelay * reconnectAttempts); // Exponential backoff
          } else if (reconnectAttempts >= maxReconnectAttempts) {
            console.error("Max SSE reconnection attempts reached. Please refresh the page.");
            if (eventSource) {
              eventSource.close();
            }
          }
        };
      } catch (error) {
        console.error("Error creating SSE connection:", error);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isAuthenticated, isAdmin]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return (
          <Badge variant="outline" className="text-gray-500">
            Inactive
          </Badge>
        );
      case "locked":
        return <Badge className="bg-red-500">Locked</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  async function handleMarkAsRead(id: number) {
    try {
      const response = await apiClient.put(`/admin/read-notification/${id}`, {}, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const payload = response.data as ResponsePayload;
      
      // The backend returns data as a Map with "notification" key
      const notificationData = payload.data as any;
      const notification = notificationData?.notification as AdminNotification;
      
      if (notification) {
        // Update local state immediately for instant UI feedback
        setNotifications((prev) =>
          prev.map((noti) =>
            noti.id === notification.id ? { ...noti, ...notification, isRead: true } : noti
          )
        );
        
        // Refetch notifications to ensure consistency with backend
        if (refetchNotifications) {
          refetchNotifications();
        }
        
        toast({
          title: "Success!",
          description: "Notification marked as read",
          variant: "default",
        });
      } else {
        throw new Error("Notification data not found in response");
      }
    } catch (ex: any) {
      console.error("Error reading notification:", ex);
      
      const errorMessage = ex.response?.data?.message || ex.message || "Something went wrong. Please try again";
      
      toast({
        title: "Error!",
        description: errorMessage,
        variant: "error",
      });
    }
  }

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
              <TabsTrigger value="notifications">
                {unreadCount > 0 && (
                  <Badge
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white"
                    style={{ marginRight: "5px" }}
                  >
                    {unreadCount}
                  </Badge>
                )}
                Notifications
              </TabsTrigger>
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
                            value as "All" | "Investor" | "Company" | "Admin"
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All roles</SelectItem>
                          <SelectItem value="Investor">Investor</SelectItem>
                          <SelectItem value="Company">Company</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={userStatusFilter}
                        onValueChange={(value) =>
                          setUserStatusFilter(
                            value as "All" | "active" | "inactive" | "pending"
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All statuses</SelectItem>
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
                          <TableHead>Online</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersLoading || usersFetching ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin text-lebanese-navy" />
                                <span className="text-sm text-gray-500">Loading users...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : usersError ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6">
                              <div className="flex flex-col items-center justify-center gap-2 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                <span className="text-sm">
                                  Error loading users: {usersError instanceof Error ? usersError.message : "Unknown error"}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.location.reload()}
                                  className="mt-2"
                                >
                                  Retry
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredUsers.length > 0 ? (
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
                                {user.roles && Array.from(user.roles).length > 0 
                                  ? Array.from(user.roles)[0].toString().toLowerCase()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(user.status)}
                              </TableCell>
                              <TableCell>
                                {user.isOnline === true ? (
                                  <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                                    <Circle className="h-2 w-2 fill-current" />
                                    Online
                                  </Badge>
                                ) : user.isOnline === false ? (
                                  <Badge variant="outline" className="text-gray-500">
                                    Offline
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-gray-400">
                                    Unknown
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                              </TableCell>
                              <TableCell className="space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/admin/users/${user.id}`}>
                                    View
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-200 hover:border-red-300 hover:bg-red-50"
                                  onClick={async () => {
                                    try {
                                      const newStatus = user.status === "active" ? "inactive" : "active";
                                      await apiClient.put(`/admin/users/${user.id}/status`, {
                                        status: newStatus
                                      });
                                      toast({
                                        title: "Success",
                                        description: `User ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
                                        variant: "success",
                                      });
                                      // Invalidate and refetch users query
                                      queryClient.invalidateQueries({ queryKey: adminKeys.users(usersParams) });
                                    } catch (error: any) {
                                      toast({
                                        title: "Error",
                                        description: error.response?.data?.message || "Failed to update user status",
                                        variant: "error",
                                      });
                                    }
                                  }}
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
                            <TableCell colSpan={8} className="text-center py-6">
                              No users match your filter criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {usersTotalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        Showing {usersPage * 20 + 1} to {Math.min((usersPage + 1) * 20, usersTotalElements)} of {usersTotalElements} users
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUsersPage(prev => Math.max(0, prev - 1))}
                          disabled={usersPage === 0 || usersLoading}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUsersPage(prev => prev + 1)}
                          disabled={usersPage >= usersTotalPages - 1 || usersLoading || usersFetching}
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
                              | "All"
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
                          <SelectItem value="All">All categories</SelectItem>
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
                              | "All"
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
                          <SelectItem value="All">All statuses</SelectItem>
                          <SelectItem value="pending_review">
                            Pending Review
                          </SelectItem>
                          <SelectItem value="active">Approved</SelectItem>
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
                        {projectsLoading || projectsFetching ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin text-lebanese-navy" />
                                <span className="text-sm text-gray-500">Loading projects...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : projectsError ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                              <div className="flex flex-col items-center justify-center gap-2 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                <span className="text-sm">
                                  Error loading projects: {projectsError instanceof Error ? projectsError.message : "Unknown error"}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.location.reload()}
                                  className="mt-2"
                                >
                                  Retry
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredProjects.length > 0 ? (
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
                                {project.category.replace(/_/g, " ")}
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
                                {project.status === "pending_review" && (
                                  <Button variant="outline" size="sm" asChild>
                                    <Link to={`/project-review/${project.id}`}>
                                      Review
                                    </Link>
                                  </Button>
                                )}
                                {project.status !== "pending_review" && (
                                  <span className="text-sm text-gray-500">
                                    {project.status === "approved" ? "Approved" : project.status === "rejected" ? "Rejected" : project.status}
                                  </span>
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
                  {projectsTotalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        Showing {projectsPage * 20 + 1} to {Math.min((projectsPage + 1) * 20, projectsTotalElements)} of {projectsTotalElements} projects
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProjectsPage(prev => Math.max(0, prev - 1))}
                          disabled={projectsPage === 0 || projectsLoading || projectsFetching}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProjectsPage(prev => prev + 1)}
                          disabled={projectsPage >= projectsTotalPages - 1 || projectsLoading || projectsFetching}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <EnhancedAnalytics />
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

            <TabsContent value="notifications">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Platform Notifications
                </h2>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`transition-colors ${
                        notification.isRead ? "bg-white" : "bg-yellow-50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex">
                          <div className="mr-4 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between">
                                <h4 className="font-semibold">
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {formatDate(notification.createdAt)}
                                </span>
                              </div>

                              <p className="text-gray-600 mt-1">
                                {notification.message}
                              </p>

                              {/* {notification.adminId && (
                                <div className="mt-2">
                                  <Link
                                    to={`/admin/related/${notification.admin_id}`}
                                    className="text-lebanese-navy hover:underline text-sm"
                                  >
                                    View Details →
                                  </Link>
                                </div>
                              )} */}
                              {!notification.isRead && (
                                <div className="mt-2 flex justify-start">
                                  <Button
                                    size="sm"
                                    className="bg-lebanese-navy hover:opacity-90 text-white justify-self-start"
                                    onClick={() =>
                                      handleMarkAsRead(notification.id)
                                    }
                                  >
                                    Mark as Read
                                  </Button>
                                </div>
                              )}
                              {/* View Documents Button */}
                              {notification.documentUrls && notification.documentUrls.length > 0 && (
                                <div className="mt-2 flex justify-start">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1"
                                    onClick={() => {
                                      setSelectedDocuments(notification.documentUrls || []);
                                      setSelectedDocumentTitle(notification.title);
                                      setViewDocumentsOpen(true);
                                    }}
                                  >
                                    <FileText className="h-4 w-4" />
                                    View Documents ({notification.documentUrls.length})
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Bottom Right Actions */}
                            <div className="flex justify-end mt-4">
                              {notification.type === "SIGNUP_REQUEST" &&
                                (notification.isAccepted === null ? (
                                  <div className="flex flex-col items-end gap-2 w-full">
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                        onClick={() =>
                                          handleApprove(
                                            notification.reqId,
                                            notification.id
                                          )
                                        }
                                      >
                                        <CheckCircle className="mr-1 h-4 w-4" />{" "}
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          handleRejectClick(notification.id)
                                        }
                                      >
                                        <AlertCircle className="mr-1 h-4 w-4" />{" "}
                                        Reject
                                      </Button>
                                    </div>

                                    {/* Rejection Reason Textbox */}
                                    {rejectingId === notification.id && (
                                      <div className="w-full max-w-md mt-2">
                                        <textarea
                                          className="w-full border rounded p-2 text-sm"
                                          rows={3}
                                          placeholder="Provide reason for rejection..."
                                          value={rejectionReason}
                                          onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                          }
                                        />
                                        <div className="flex justify-end mt-2">
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={!rejectionReason.trim()}
                                            onClick={() =>
                                              handleSubmitRejection(
                                                notification.reqId,
                                                notification.id
                                              )
                                            }
                                          >
                                            Submit Rejection
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : notification.isAccepted ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Approved
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <Ban className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Rejected
                                    </span>
                                  </div>
                                ))}
                              
                              {notification.type === "VERIFICATION_REQUEST" &&
                                (notification.isAccepted === null ? (
                                  <div className="flex flex-col items-end gap-2 w-full">
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (notification.companyId) {
                                            handleApproveVerification(
                                              notification.companyId,
                                              notification.id
                                            );
                                          } else {
                                            toast({
                                              description: "Company ID not found in notification",
                                              title: "Error!",
                                              variant: "error",
                                            });
                                          }
                                        }}
                                      >
                                        <CheckCircle className="mr-1 h-4 w-4" />{" "}
                                        Approve Verification
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleRejectClick(notification.id);
                                        }}
                                      >
                                        <AlertCircle className="mr-1 h-4 w-4" />{" "}
                                        Reject
                                      </Button>
                                    </div>

                                    {/* Rejection Reason Textbox */}
                                    {rejectingId === notification.id && (
                                      <div className="w-full max-w-md mt-2">
                                        <textarea
                                          className="w-full border rounded p-2 text-sm"
                                          rows={3}
                                          placeholder="Provide reason for rejection..."
                                          value={rejectionReason}
                                          onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                          }
                                        />
                                        <div className="flex justify-end mt-2">
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            disabled={!rejectionReason.trim() || !notification.companyId}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              if (notification.companyId) {
                                                handleRejectVerification(
                                                  notification.companyId,
                                                  notification.id,
                                                  rejectionReason
                                                );
                                              } else {
                                                toast({
                                                  description: "Company ID not found in notification",
                                                  title: "Error!",
                                                  variant: "error",
                                                });
                                              }
                                            }}
                                          >
                                            Submit Rejection
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : notification.isAccepted ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Verification Approved
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <Ban className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Verification Rejected
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {!notification.isRead && (
                            <div className="ml-4">
                              <Badge className="bg-blue-500">New</Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payouts">
              <PayoutHistory userType="admin" />
            </TabsContent>

            <TabsContent value="kyc">
              <InvestorKycManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <ViewDocumentsDialog
        open={viewDocumentsOpen}
        onOpenChange={setViewDocumentsOpen}
        documentUrls={selectedDocuments}
        title={selectedDocumentTitle}
      />
    </div>
  );
};

// Enhanced Analytics Component
const EnhancedAnalytics = () => {
  const { data: analytics, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Enhanced Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.totalInvestors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.totalCompanies}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics.totalInvestments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Invested Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${analytics.totalInvestedToday.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Raised</TableHead>
                  <TableHead>Investors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.topProjects.slice(0, 5).map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.companyName}</TableCell>
                    <TableCell>
                      ${project.raisedAmount.toLocaleString()} / ${project.targetAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{project.investorCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Pending Company Approvals</span>
                <Badge>{analytics.pendingCompanyApprovals}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Pending Investor Approvals</span>
                <Badge>{analytics.pendingInvestorApprovals}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Pending Payouts</span>
                <Badge>{analytics.pendingPayouts}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Pending Returns</span>
                <Badge>{analytics.pendingReturns}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Investments by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(analytics.investmentsByCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between">
                  <span>{category}</span>
                  <Badge>{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investments by Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(analytics.investmentsByRiskLevel).map(([risk, count]) => (
                <div key={risk} className="flex justify-between">
                  <span>{risk}</span>
                  <Badge>{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Investor KYC Management Component
const InvestorKycManagement = () => {
  const { data: pendingInvestors, isLoading } = usePendingInvestorApprovals(0, 20);
  const updateKyc = useUpdateInvestorKyc();
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [classification, setClassification] = useState<"RETAIL" | "QUALIFIED" | "INSTITUTIONAL">("RETAIL");
  const [kycNotes, setKycNotes] = useState("");
  const { toast } = useToast();

  const handleUpdateKyc = async () => {
    if (!selectedInvestor) return;
    try {
      await updateKyc.mutateAsync({
        investorId: selectedInvestor.id,
        request: { classification, kycNotes },
      });
      toast({
        title: "Success",
        description: "Investor KYC updated successfully",
      });
      setSelectedInvestor(null);
      setKycNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update KYC",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Investor KYC Management</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pending Investor Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvestors?.data?.investors?.map((investor: any) => (
                  <TableRow key={investor.id}>
                    <TableCell>{investor.name}</TableCell>
                    <TableCell>{investor.email}</TableCell>
                    <TableCell>
                      <Badge variant={investor.enabled ? "default" : "destructive"}>
                        {investor.enabled ? "Active" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedInvestor(investor);
                              setClassification("RETAIL");
                              setKycNotes("");
                            }}
                          >
                            Update KYC
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Investor KYC</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Classification</Label>
                              <Select
                                value={classification}
                                onValueChange={(value) =>
                                  setClassification(value as "RETAIL" | "QUALIFIED" | "INSTITUTIONAL")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="RETAIL">Retail</SelectItem>
                                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                                  <SelectItem value="INSTITUTIONAL">Institutional</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>KYC Notes</Label>
                              <Textarea
                                value={kycNotes}
                                onChange={(e) => setKycNotes(e.target.value)}
                                placeholder="Add notes about this investor..."
                              />
                            </div>
                            <Button onClick={handleUpdateKyc}>Update</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
