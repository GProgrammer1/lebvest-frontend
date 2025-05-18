
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardPage from "@/components/DashboardPage";
import { mockInvestorProfile } from "@/lib/mockData";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <DashboardPage investor={mockInvestorProfile} />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
