
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvestmentDetail from "@/components/InvestmentDetail";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";
import { Investment } from "@/lib/types";

const InvestmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestment = async () => {
      if (!id) {
        setError("Invalid investment ID");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<ResponsePayload>(`/investments/${id}`);
        if (response.data.status === 200) {
          const inv = response.data.data.investment;
          // Map backend DTO to frontend Investment type
          const mappedInvestment: Investment = {
            id: inv.id?.toString() || "",
            title: inv.title || "",
            companyName: inv.companyName || "",
            companyId: inv.companyId || inv.company?.id,
            description: inv.description || "",
            category: inv.category?.toLowerCase() || "",
            sector: inv.sector?.toLowerCase() || "",
            location: inv.location?.toLowerCase().replace(/\s+/g, '_') || "",
            riskLevel: inv.riskLevel?.toLowerCase() || "medium",
            expectedReturn: inv.expectedReturn || 0,
            minInvestment: Number(inv.minInvestment || 0),
            targetAmount: Number(inv.targetAmount || 0),
            raisedAmount: Number(inv.raisedAmount || 0),
            deadline: inv.deadline || "",
            imageUrl: inv.imageUrl || "",
            investmentType: inv.investmentType?.toLowerCase() || "",
            duration: inv.durationMonths || 0,
            fundingStage: inv.fundingStage || "",
            highlights: inv.highlights || [],
            financials: [],
            team: [],
            documents: [],
            updates: inv.updates?.map((u: any) => ({
              date: u.updateDate || u.date || "",
              title: u.title || "",
              content: u.content || ""
            })) || [],
            aiPrediction: {
              profitPrediction: inv.expectedReturn || 0,
              confidenceScore: 75,
              riskAssessment: `This investment has a ${inv.riskLevel?.toLowerCase() || 'medium'} risk level.`
            }
          };
          setInvestment(mappedInvestment);
        } else {
          setError("Investment not found");
        }
      } catch (err: any) {
        console.error("Error fetching investment:", err);
        setError(err.response?.data?.message || "Failed to load investment");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12 flex items-center justify-center">
          <div className="text-center">
            <div>Loading investment details...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Investment Not Found</h3>
              <p className="text-gray-500 mb-6">{error || "The investment opportunity you're looking for doesn't exist or has been removed."}</p>
              <button 
                onClick={() => navigate("/investments")}
                className="text-lebanese-navy hover:underline"
              >
                Browse all investments
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12">
        <InvestmentDetail investment={investment} onInvestmentSuccess={() => navigate("/dashboard")} />
      </main>
      <Footer />
    </div>
  );
};

export default InvestmentDetailPage;
