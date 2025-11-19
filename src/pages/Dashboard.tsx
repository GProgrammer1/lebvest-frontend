
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardPage from "@/components/DashboardPage";
import { fetchInvestorDashboard } from "@/api/investor";
import { InvestorDashboard } from "@/lib/types";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<InvestorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInvestorDashboard();
      setDashboard(data);
    } catch (err) {
      console.error("Failed to load investor dashboard", err);
      setError("We couldn't load your dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full py-24">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-lebanese-navy border-t-transparent mx-auto" />
            <p className="text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full py-24">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-2">Unable to load dashboard</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={loadDashboard} className="bg-lebanese-navy hover:bg-opacity-90">
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (!dashboard) {
      return (
        <div className="flex items-center justify-center h-full py-24">
          <div className="text-center text-gray-500">
            No dashboard data available right now.
          </div>
        </div>
      );
    }

    return <DashboardPage dashboard={dashboard} />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
