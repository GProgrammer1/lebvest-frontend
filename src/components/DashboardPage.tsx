import React, { useState } from "react";
import { InvestorDashboard } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useMarkNotificationAsRead, useAcceptedInvestmentRequests } from "@/hooks/useInvestorQueries";
import { useToast } from "@/components/ui/use-toast";
import { PayoutHistory } from "@/components/PayoutHistory";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useCreatePayoutRequest } from "@/hooks/usePayoutQueries";

interface DashboardPageProps {
  dashboard: InvestorDashboard;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DashboardPage: React.FC<DashboardPageProps> = ({ dashboard }) => {
  const {
    investor,
    investments,
    watchlist,
    notifications,
    goals,
    recommendations,
  } = dashboard;
  const investorInvestments = investments;
  const watchlistItems = watchlist;
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notificationsState, setNotificationsState] = useState(notifications);
  const { data: acceptedRequests = [], isLoading: loadingRequests } = useAcceptedInvestmentRequests();
  const markAsRead = useMarkNotificationAsRead();
  const createPayoutRequest = useCreatePayoutRequest();

  const acceptedRequestsCount = acceptedRequests.length;

  const handlePayNow = (requestId: number) => {
    navigate(`/payment/${requestId}`);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead.mutateAsync(notificationId);
      setNotificationsState((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Prepare chart data
  const portfolioData = investorInvestments.map((inv) => ({
    name: inv.investment?.title?.slice(0, 20) || `Investment #${inv.id}`,
    invested: inv.amount,
    current: inv.currentValue,
    return: inv.currentValue - inv.amount,
  }));

  const categoryData = investorInvestments.reduce((acc, inv) => {
    const category = inv.investment?.category || "Other";
    acc[category] = (acc[category] || 0) + inv.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
  }));

  const COLORS = ["#1e3a5f", "#2d5a87", "#4a90c2", "#6bb3e0", "#8cc8f0"];

  const monthlyReturns = investorInvestments.map((inv) => {
    const months = Math.max(1, Math.floor((Date.now() - new Date(inv.investedAt).getTime()) / (1000 * 60 * 60 * 24 * 30)));
    return {
      name: inv.investment?.title?.slice(0, 15) || `Inv #${inv.id}`,
      return: months > 0 ? ((inv.currentValue - inv.amount) / inv.amount / months) * 100 : 0,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome, {investor.name}</h1>
          <p className="text-gray-600">
            Here's an overview of your investments and opportunities.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button asChild variant="outline">
            <Link to="/investor-settings">Settings</Link>
          </Button>
          <Button className="bg-lebanese-navy hover:bg-opacity-90">
            Find New Investments
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lebanese-navy">
              {formatCurrency(investor.portfolioValue)}
            </div>
            <p className="text-sm text-gray-500">
              {investor.portfolioValue > investor.totalInvested ? (
                <span className="text-lebanese-green">
                  +
                  {formatCurrency(
                    investor.portfolioValue - investor.totalInvested
                  )}{" "}
                  profit
                </span>
              ) : (
                <span className="text-lebanese-red">
                  -
                  {formatCurrency(
                    investor.totalInvested - investor.portfolioValue
                  )}{" "}
                  loss
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Invested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(investor.totalInvested)}
            </div>
            <p className="text-sm text-gray-500">
              Across {investments.length} investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lebanese-green">
              {formatCurrency(investor.totalReturns)}
            </div>
            <p className="text-sm text-gray-500">
              {investor.totalInvested > 0
                ? (
                    (investor.totalReturns / investor.totalInvested) *
                    100
                  ).toFixed(1)
                : "0.0"}
              % return
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="portfolio" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="payment-requests" className="relative">
            Payment Requests
            {acceptedRequestsCount > 0 && (
              <Badge className="ml-2 bg-green-500 hover:bg-green-600 text-white">
                {acceptedRequestsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-8">
          {/* Charts Section */}
          {investorInvestments.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={portfolioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="invested" fill="#1e3a5f" name="Invested" />
                      <Bar dataKey="current" fill="#4a90c2" name="Current Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Portfolio by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Investment Returns Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyReturns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="return" stroke="#1e3a5f" strokeWidth={2} name="Monthly Return %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
            <div className="grid grid-cols-1 gap-6">
              {investorInvestments.map((investment) => {
                const details = investment.investment;
                return (
                  <Card key={investment.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {details && details.imageUrl && (
                        <div className="w-full md:w-1/4">
                          <img
                            src={details.imageUrl}
                            alt={details.title}
                            className="w-full h-full object-cover"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                          <div>
                            <Link
                              to={`/investments/${
                                details?.id ?? investment.id
                              }`}
                              className="text-lg font-semibold hover:underline"
                            >
                              {details
                                ? details.title
                                : `Investment #${investment.id}`}
                            </Link>
                            <p className="text-sm text-gray-500 mb-2">
                              {details ? details.companyName : "Loading..."}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {details && (
                                <>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {details.category.replace("_", " ")}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {details.location.replace("_", " ")}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 text-right">
                            <p className="text-sm text-gray-500">
                              Current Value
                            </p>
                            <p className="text-xl font-bold">
                              {formatCurrency(investment.currentValue)}
                            </p>
                            <p
                              className={`text-sm ${
                                investment.currentValue >= investment.amount
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {investment.currentValue >= investment.amount
                                ? "+"
                                : ""}
                              {investment.amount > 0
                                ? (
                                    ((investment.currentValue -
                                      investment.amount) /
                                      investment.amount) *
                                    100
                                  ).toFixed(1)
                                : "0.0"}
                              %
                            </p>
                            {(investment as any).maturityDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Maturity: {formatDate((investment as any).maturityDate)}
                              </p>
                            )}
                            {(investment as any).isMatured && !(investment as any).payoutRequested && (
                              <Button
                                size="sm"
                                className="mt-2"
                                onClick={async () => {
                                  try {
                                    await createPayoutRequest.mutateAsync(investment.id);
                                    toast({
                                      title: "Success",
                                      description: "Payout request created successfully",
                                    });
                                  } catch (error: any) {
                                    toast({
                                      title: "Error",
                                      description: error.response?.data?.message || "Failed to create payout request",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                Request Payout
                              </Button>
                            )}
                            {(investment as any).payoutRequested && (
                              <Badge className="mt-2" variant="outline">
                                Payout Requested
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Amount Invested
                            </p>
                            <p className="font-medium">
                              {formatCurrency(investment.amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Investment Date
                            </p>
                            <p className="font-medium">
                              {formatDate(investment.investedAt)}
                            </p>
                          </div>
                          {details && (
                            <div>
                              <p className="text-sm text-gray-500">
                                Expected Return
                              </p>
                              <p className="font-medium">
                                {details.expectedReturn}%
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Watchlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="h-40">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Link
                      to={`/investments/${item.id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-500 mb-3">
                      {item.companyName}
                    </p>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Target</span>
                      <span className="font-medium">
                        {formatCurrency(item.targetAmount)}
                      </span>
                    </div>
                    <Progress
                      value={
                        item.targetAmount > 0
                          ? (item.raisedAmount / item.targetAmount) * 100
                          : 0
                      }
                      className="h-2 mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span>
                        {item.targetAmount > 0
                          ? (
                              (item.raisedAmount / item.targetAmount) *
                              100
                            ).toFixed(0)
                          : "0"}
                        % raised
                      </span>
                      <span>Closes {formatDate(item.deadline)}</span>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        className="bg-lebanese-navy hover:bg-opacity-90"
                      >
                        Invest
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Investment Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const progressPercentage =
                  goal.targetAmount > 0
                    ? (goal.currentAmount / goal.targetAmount) * 100
                    : 0;

                return (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{goal.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">
                              Progress
                            </span>
                            <span className="text-sm font-medium">
                              {progressPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className="h-2 mb-1"
                          />
                          <div className="flex justify-between text-sm">
                            <span>{formatCurrency(goal.currentAmount)}</span>
                            <span>{formatCurrency(goal.targetAmount)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Deadline
                          </span>
                          <span className="text-sm">
                            {formatDate(goal.deadline)}
                          </span>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            Edit Goal
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Card className="flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 h-48">
                <Button variant="ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Goal
                </Button>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment-requests" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Accepted Investment Requests</h2>
            {loadingRequests ? (
              <div className="text-center py-12">
                <div>Loading payment requests...</div>
              </div>
            ) : acceptedRequests.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {acceptedRequests.map((request) => (
                  <Card key={request.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold mb-2">
                            {request.investmentTitle}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <strong>Amount:</strong> {formatCurrency(Number(request.amount))}
                            </p>
                            <p>
                              <strong>Accepted:</strong> {formatDate(request.acceptedAt)}
                            </p>
                            {request.message && (
                              <p>
                                <strong>Company Message:</strong> {request.message}
                              </p>
                            )}
                          </div>
                          <Badge className="mt-2 bg-green-500">
                            Accepted - Ready to Pay
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="bg-lebanese-navy hover:bg-opacity-90"
                            onClick={() => handlePayNow(request.id)}
                          >
                            Pay Now
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to={`/investments/${request.investmentId}`}>
                              View Project
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Badge className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No accepted requests
                </h3>
                <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                  When companies accept your investment requests, they will appear here for payment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Notifications</h2>
            <div className="space-y-4">
              {notificationsState.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${
                    notification.read ? "bg-white" : "bg-blue-50"
                  } transition-colors`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="mr-4 mt-0.5">
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
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                              />
                            </svg>
                          </div>
                        )}
                        {notification.type === "investment_accepted" && (
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.notifiedAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        {notification.relatedInvestmentId && (
                          <div className="mt-2 flex gap-2">
                            <Link
                              to={`/investments/${notification.relatedInvestmentId}`}
                              className="text-lebanese-navy hover:underline text-sm"
                            >
                              View Investment →
                            </Link>
                            {notification.type === "investment_accepted" && (
                              <Button
                                size="sm"
                                className="bg-lebanese-navy hover:bg-opacity-90 text-white ml-2"
                                onClick={() => {
                                  // Find the request ID from accepted requests (only unpaid ones)
                                  const request = acceptedRequests.find(
                                    (r: any) => r.investmentId === notification.relatedInvestmentId && r.status !== "PAID"
                                  );
                                  if (request) {
                                    handlePayNow(request.id);
                                  } else {
                                    // If not found (already paid or not in list), navigate to payment requests tab
                                    navigate("/dashboard", { state: { tab: "payment-requests" } });
                                  }
                                }}
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="ml-4 flex items-center gap-2">
                          <Badge className="bg-blue-500">New</Badge>
                          {notification.type !== "investment_accepted" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as Read
                            </Button>
                          )}
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
          <PayoutHistory userType="investor" />
        </TabsContent>
      </Tabs>

      {/* Recommended Investments */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        {recommendations.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
            Check back soon for personalized investment ideas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((investment) => (
              <Card key={investment.id} className="overflow-hidden">
                <div className="h-40">
                  <img
                    src={investment.imageUrl || "/placeholder.svg"}
                    alt={investment.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <Link
                    to={`/investments/${investment.id}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {investment.title}
                  </Link>
                  <p className="text-sm text-gray-500 mb-2">
                    {investment.companyName}
                  </p>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Expected Return</span>
                    <span className="font-semibold text-lebanese-green">
                      {investment.expectedReturn}%
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm">Min. Investment</span>
                    <span className="font-semibold">
                      {formatCurrency(investment.minInvestment)}
                    </span>
                  </div>
                  <Button className="w-full bg-lebanese-navy hover:bg-opacity-90">
                    View Opportunity
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
