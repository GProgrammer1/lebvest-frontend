import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardPage from "@/components/DashboardPage";
import { InvestorProfile } from "@/lib/types";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

const Dashboard = () => {
  const [investor, setInvestor] = useState<InvestorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get<ResponsePayload>(
          "/investors/me/dashboard"
        );
        if (response.data.status === 200) {
          const dashboardData = response.data.data.dashboard;
          // Map backend dashboard DTO to InvestorProfile type
          const investorProfile: InvestorProfile = {
            id: dashboardData.investor?.id?.toString() || "",
            name: dashboardData.investor?.name || "",
            email: dashboardData.investor?.email || "",
            portfolioValue: Number(dashboardData.investor?.portfolioValue || 0),
            totalInvested: Number(dashboardData.investor?.totalInvested || 0),
            totalReturns: Number(dashboardData.investor?.totalReturns || 0),
            investmentPreferences: {
              categories: Array.from(
                dashboardData.investor?.preferences?.categories || []
              ),
              riskLevels: Array.from(
                dashboardData.investor?.preferences?.riskLevels || []
              ),
              sectors: [],
              locations: Array.from(
                dashboardData.investor?.preferences?.locations || []
              ),
            },
            investments:
              dashboardData.investments?.map((inv: any) => ({
                investmentId: inv.investment?.id?.toString() || "",
                amount: Number(inv.amount || 0),
                date: inv.investedAt || "",
                currentValue: Number(inv.currentValue || 0),
              })) || [],
            watchlist:
              dashboardData.watchlist
                ?.map((item: any) => item.id?.toString())
                .filter((id: string) => id) || [],
            notifications:
              dashboardData.notifications?.map((notif: any) => ({
                id: notif.id?.toString() || "",
                type: notif.type || "update",
                title: notif.title || "",
                message: notif.message || "",
                date: notif.notifiedAt || "",
                read: notif.read || false,
                relatedInvestmentId: notif.relatedInvestmentId?.toString(),
              })) || [],
            goals:
              dashboardData.goals?.map((goal: any) => ({
                id: goal.id?.toString() || "",
                title: goal.title || "",
                targetAmount: Number(goal.targetAmount || 0),
                currentAmount: Number(goal.currentAmount || 0),
                deadline: goal.deadline || "",
              })) || [],
          };
          setInvestor(investorProfile);
        }
      } catch (error) {
        console.error("Error fetching investor dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div>Failed to load dashboard</div>
        </main>
        <Footer />
      </div>
    );
  }

  const refreshDashboard = async () => {
    try {
      const response = await apiClient.get<ResponsePayload>(
        "/investors/me/dashboard"
      );
      if (response.data.status === 200) {
        const dashboardData = response.data.data.dashboard;
        // Map backend dashboard DTO to InvestorProfile type
        const investorProfile: InvestorProfile = {
          id: dashboardData.investor?.id?.toString() || "",
          name: dashboardData.investor?.name || "",
          email: dashboardData.investor?.email || "",
          portfolioValue: Number(dashboardData.investor?.portfolioValue || 0),
          totalInvested: Number(dashboardData.investor?.totalInvested || 0),
          totalReturns: Number(dashboardData.investor?.totalReturns || 0),
          investmentPreferences: {
            categories: Array.from(
              dashboardData.investor?.preferences?.categories || []
            ),
            riskLevels: Array.from(
              dashboardData.investor?.preferences?.riskLevels || []
            ),
            sectors: [],
            locations: Array.from(
              dashboardData.investor?.preferences?.locations || []
            ),
          },
          investments:
            dashboardData.investments?.map((inv: any) => ({
              investmentId: inv.investment?.id?.toString() || "",
              amount: Number(inv.amount || 0),
              date: inv.investedAt || "",
              currentValue: Number(inv.currentValue || 0),
            })) || [],
          watchlist:
            dashboardData.watchlist
              ?.map((item: any) => item.id?.toString())
              .filter((id: string) => id) || [],
          notifications:
            dashboardData.notifications?.map((notif: any) => ({
              id: notif.id?.toString() || "",
              type: notif.type || "update",
              title: notif.title || "",
              message: notif.message || "",
              date: notif.notifiedAt || "",
              read: notif.read || false,
              relatedInvestmentId: notif.relatedInvestmentId?.toString(),
            })) || [],
          goals:
            dashboardData.goals?.map((goal: any) => ({
              id: goal.id?.toString() || "",
              title: goal.title || "",
              targetAmount: Number(goal.targetAmount || 0),
              currentAmount: Number(goal.currentAmount || 0),
              deadline: goal.deadline || "",
            })) || [],
        };
        setInvestor(investorProfile);
      }
    } catch (error) {
      console.error("Error refreshing investor dashboard:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <DashboardPage investor={investor} onGoalCreated={refreshDashboard} />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
