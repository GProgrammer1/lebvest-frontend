import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardPage from "@/components/DashboardPage";
import { useInvestorDashboard } from "@/hooks/useInvestorQueries";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";

const Dashboard = () => {
  const { data: dashboard, isLoading, error, refetch } = useInvestorDashboard();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-6">
          <DashboardSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full py-24">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-2">Unable to load dashboard</h2>
            <p className="text-gray-500 mb-6">
              {error instanceof Error ? error.message : "We couldn't load your dashboard data. Please try again."}
            </p>
            <Button onClick={() => refetch()} className="bg-lebanese-navy hover:bg-opacity-90">
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
