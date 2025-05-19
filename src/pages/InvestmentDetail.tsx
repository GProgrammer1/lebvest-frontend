
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvestmentDetail from "@/components/InvestmentDetail";
import { mockInvestments } from "@/lib/mockData";

const InvestmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const investment = mockInvestments.find(inv => inv.id === id);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {investment ? (
        <main className="flex-grow py-12">
          <InvestmentDetail investment={investment} />
        </main>
      ) : (
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Investment Not Found</h3>
              <p className="text-gray-500 mb-6">The investment opportunity you're looking for doesn't exist or has been removed.</p>
              <a href="/investments" className="text-lebanese-navy hover:underline">Browse all investments</a>
            </div>
          </div>
        </main>
      )}
      
      <Footer />
    </div>
  );
};

export default InvestmentDetailPage;
