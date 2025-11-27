
import React, { useState } from "react";
import { InvestorProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockInvestments } from "@/lib/mockData";
import { Link } from "react-router-dom";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface DashboardPageProps {
  investor: InvestorProfile;
  onGoalCreated?: () => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0 
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const DashboardPage: React.FC<DashboardPageProps> = ({ investor, onGoalCreated }) => {
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTargetAmount, setGoalTargetAmount] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const { toast } = useToast();

  // Find full investments from mock data
  const investorInvestments = investor.investments.map(investment => {
    const fullInvestment = mockInvestments.find(inv => inv.id === investment.investmentId);
    return {
      ...investment,
      details: fullInvestment
    };
  });

  // Find watchlist items from mock data
  const watchlistItems = investor.watchlist.map(id => {
    return mockInvestments.find(inv => inv.id === id);
  }).filter(item => item !== undefined);

  const handleCreateGoal = async () => {
    if (!goalTitle.trim() || !goalTargetAmount || !goalDeadline) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "error",
      });
      return;
    }

    const targetAmount = parseFloat(goalTargetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      toast({
        title: "Error",
        description: "Target amount must be a positive number",
        variant: "error",
      });
      return;
    }

    setIsCreatingGoal(true);
    try {
      const response = await apiClient.post<ResponsePayload>("/investors/me/goals", {
        title: goalTitle,
        targetAmount: targetAmount,
        deadline: goalDeadline,
      });

      if (response.data.status === 201) {
        toast({
          title: "Success",
          description: "Goal created successfully",
          variant: "success",
        });
        setIsGoalDialogOpen(false);
        setGoalTitle("");
        setGoalTargetAmount("");
        setGoalDeadline("");
        if (onGoalCreated) {
          onGoalCreated();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create goal",
        variant: "error",
      });
    } finally {
      setIsCreatingGoal(false);
    }
  };

  const handleEditGoal = (goal: { id: string; title: string; targetAmount: number; deadline: string }) => {
    setEditingGoalId(goal.id);
    setGoalTitle(goal.title);
    setGoalTargetAmount(goal.targetAmount.toString());
    // Format date for input (YYYY-MM-DD)
    const deadlineDate = goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : "";
    setGoalDeadline(deadlineDate);
    setIsEditGoalDialogOpen(true);
  };

  const handleUpdateGoal = async () => {
    if (!editingGoalId) return;

    if (!goalTitle.trim() || !goalTargetAmount || !goalDeadline) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "error",
      });
      return;
    }

    const targetAmount = parseFloat(goalTargetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      toast({
        title: "Error",
        description: "Target amount must be a positive number",
        variant: "error",
      });
      return;
    }

    setIsUpdatingGoal(true);
    try {
      const response = await apiClient.put<ResponsePayload>(`/investors/me/goals/${editingGoalId}`, {
        title: goalTitle,
        targetAmount: targetAmount,
        deadline: goalDeadline,
      });

      if (response.data.status === 200) {
        toast({
          title: "Success",
          description: "Goal updated successfully",
          variant: "success",
        });
        setIsEditGoalDialogOpen(false);
        setEditingGoalId(null);
        setGoalTitle("");
        setGoalTargetAmount("");
        setGoalDeadline("");
        if (onGoalCreated) {
          onGoalCreated();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update goal",
        variant: "error",
      });
    } finally {
      setIsUpdatingGoal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome, {investor.name}</h1>
          <p className="text-gray-600">Here's an overview of your investments and opportunities.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-lebanese-navy hover:bg-opacity-90">
            Find New Investments
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lebanese-navy">{formatCurrency(investor.portfolioValue)}</div>
            <p className="text-sm text-gray-500">
              {investor.portfolioValue > investor.totalInvested ? (
                <span className="text-lebanese-green">
                  +{formatCurrency(investor.portfolioValue - investor.totalInvested)} profit
                </span>
              ) : (
                <span className="text-lebanese-red">
                  -{formatCurrency(investor.totalInvested - investor.portfolioValue)} loss
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(investor.totalInvested)}</div>
            <p className="text-sm text-gray-500">Across {investor.investments.length} investments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Total Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lebanese-green">{formatCurrency(investor.totalReturns)}</div>
            <p className="text-sm text-gray-500">
              {((investor.totalReturns / investor.totalInvested) * 100).toFixed(1)}% return
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
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
            <div className="grid grid-cols-1 gap-6">
              {investorInvestments.map((investment) => (
                <Card key={investment.investmentId} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {investment.details && (
                      <div className="w-full md:w-1/4 bg-gray-200">
                        <img
                          src={investment.details.imageUrl && investment.details.imageUrl.trim() !== ""
                            ? investment.details.imageUrl
                            : "https://via.placeholder.com/200x200/1e3a8a/ffffff?text=Investment"}
                          alt={investment.details.title}
                          className="w-full h-full object-cover"
                          style={{ maxHeight: '200px' }}
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/200x200/1e3a8a/ffffff?text=Investment";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                        <div>
                          <Link to={`/investments/${investment.investmentId}`} className="text-lg font-semibold hover:underline">
                            {investment.details ? investment.details.title : `Investment #${investment.investmentId}`}
                          </Link>
                          <p className="text-sm text-gray-500 mb-2">
                            {investment.details ? investment.details.companyName : 'Loading...'}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {investment.details && (
                              <>
                                <Badge variant="outline" className="capitalize">
                                  {investment.details.category.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {investment.details.location.replace('_', ' ')}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <p className="text-sm text-gray-500">Current Value</p>
                          <p className="text-xl font-bold">
                            {formatCurrency(investment.currentValue)}
                          </p>
                          <p className={`text-sm ${investment.currentValue >= investment.amount ? 'text-green-600' : 'text-red-600'}`}>
                            {investment.currentValue >= investment.amount ? '+' : ''}
                            {(((investment.currentValue - investment.amount) / investment.amount) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Amount Invested</p>
                          <p className="font-medium">{formatCurrency(investment.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Investment Date</p>
                          <p className="font-medium">{formatDate(investment.date)}</p>
                        </div>
                        {investment.details && (
                          <div>
                            <p className="text-sm text-gray-500">Expected Return</p>
                            <p className="font-medium">{investment.details.expectedReturn}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="watchlist" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Watchlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlistItems.map((item) => item && (
                <Card key={item.id} className="overflow-hidden">
                  <div className="h-40 bg-gray-200">
                    <img
                      src={item.imageUrl && item.imageUrl.trim() !== ""
                        ? item.imageUrl
                        : "https://via.placeholder.com/400x200/1e3a8a/ffffff?text=Investment+Opportunity"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x200/1e3a8a/ffffff?text=Investment+Opportunity";
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <Link to={`/investments/${item.id}`} className="text-lg font-semibold hover:underline">
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-500 mb-3">{item.companyName}</p>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Target</span>
                      <span className="font-medium">{formatCurrency(item.targetAmount)}</span>
                    </div>
                    <Progress value={(item.raisedAmount / item.targetAmount) * 100} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span>{((item.raisedAmount / item.targetAmount) * 100).toFixed(0)}% raised</span>
                      <span>Closes {formatDate(item.deadline)}</span>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                      <Button size="sm" className="bg-lebanese-navy hover:bg-opacity-90">
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
              {investor.goals.map((goal) => {
                const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
                
                return (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{goal.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">Progress</span>
                            <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2 mb-1" />
                          <div className="flex justify-between text-sm">
                            <span>{formatCurrency(goal.currentAmount)}</span>
                            <span>{formatCurrency(goal.targetAmount)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Deadline</span>
                          <span className="text-sm">{formatDate(goal.deadline)}</span>
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditGoal(goal)}
                          >
                            Edit Goal
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              <Card className="flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 h-48">
                <Button variant="ghost" onClick={() => setIsGoalDialogOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Goal
                </Button>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Notifications</h2>
            <div className="space-y-4">
              {investor.notifications.map((notification) => (
                <Card key={notification.id} className={`${notification.read ? 'bg-white' : 'bg-blue-50'} transition-colors`}>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="mr-4 mt-0.5">
                        {notification.type === 'new_opportunity' && (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        {notification.type === 'update' && (
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        {notification.type === 'threshold' && (
                          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        {notification.type === 'news' && (
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        {notification.relatedInvestmentId && (
                          <div className="mt-2">
                            <Link 
                              to={`/investments/${notification.relatedInvestmentId}`} 
                              className="text-lebanese-navy hover:underline text-sm"
                            >
                              View Investment →
                            </Link>
                          </div>
                        )}
                      </div>
                      {!notification.read && (
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
      </Tabs>
      
      {/* Recommended Investments */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockInvestments.slice(0, 3).map((investment) => (
            <Card key={investment.id} className="overflow-hidden">
              <div className="h-40 bg-gray-200">
                <img
                  src={investment.imageUrl && investment.imageUrl.trim() !== ""
                    ? investment.imageUrl
                    : "https://via.placeholder.com/400x200/1e3a8a/ffffff?text=Investment+Opportunity"}
                  alt={investment.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x200/1e3a8a/ffffff?text=Investment+Opportunity";
                  }}
                />
              </div>
              <CardContent className="p-4">
                <Link to={`/investments/${investment.id}`} className="text-lg font-semibold hover:underline">
                  {investment.title}
                </Link>
                <p className="text-sm text-gray-500 mb-2">{investment.companyName}</p>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Expected Return</span>
                  <span className="font-semibold text-lebanese-green">{investment.expectedReturn}%</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm">Min. Investment</span>
                  <span className="font-semibold">{formatCurrency(investment.minInvestment)}</span>
                </div>
                <Button className="w-full bg-lebanese-navy hover:bg-opacity-90">
                  View Opportunity
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Create Goal Dialog */}
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Investment Goal</DialogTitle>
            <DialogDescription>
              Set a target amount and deadline for your investment goal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                placeholder="e.g., Save for retirement"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-amount">Target Amount ($)</Label>
              <Input
                id="goal-amount"
                type="number"
                placeholder="10000"
                value={goalTargetAmount}
                onChange={(e) => setGoalTargetAmount(e.target.value)}
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-deadline">Deadline</Label>
              <Input
                id="goal-deadline"
                type="date"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsGoalDialogOpen(false);
                setGoalTitle("");
                setGoalTargetAmount("");
                setGoalDeadline("");
              }}
              disabled={isCreatingGoal}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGoal}
              disabled={isCreatingGoal}
              className="bg-lebanese-navy hover:bg-opacity-90"
            >
              {isCreatingGoal ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditGoalDialogOpen} onOpenChange={setIsEditGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Investment Goal</DialogTitle>
            <DialogDescription>
              Update your investment goal details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-goal-title">Goal Title</Label>
              <Input
                id="edit-goal-title"
                placeholder="e.g., Save for retirement"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-goal-amount">Target Amount ($)</Label>
              <Input
                id="edit-goal-amount"
                type="number"
                placeholder="10000"
                value={goalTargetAmount}
                onChange={(e) => setGoalTargetAmount(e.target.value)}
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-goal-deadline">Deadline</Label>
              <Input
                id="edit-goal-deadline"
                type="date"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditGoalDialogOpen(false);
                setEditingGoalId(null);
                setGoalTitle("");
                setGoalTargetAmount("");
                setGoalDeadline("");
              }}
              disabled={isUpdatingGoal}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateGoal}
              disabled={isUpdatingGoal}
              className="bg-lebanese-navy hover:bg-opacity-90"
            >
              {isUpdatingGoal ? "Updating..." : "Update Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
