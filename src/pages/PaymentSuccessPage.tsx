import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const PaymentSuccessPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<any>(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      if (!requestId) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<ResponsePayload>(
          `/investors/me/investment-requests`
        );
        if (response.data.status === 200) {
          const requests = response.data.data.requests || [];
          const request = requests.find((r: any) => r.id === Number(requestId));
          if (request) {
            setRequestData(request);
          }
        }
      } catch (error) {
        console.error("Error fetching request data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [requestId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <title>Payment Successful | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl border-2 border-green-500">
          <CardHeader className="text-center bg-green-50">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-green-700">Payment Successful!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Your investment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading payment details...</p>
              </div>
            ) : requestData ? (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">Investment Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project:</span>
                      <span className="font-semibold">{requestData.investmentTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(Number(requestData.amount))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-green-600">Paid</span>
                    </div>
                    {requestData.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Date:</span>
                        <span className="font-semibold">
                          {new Date(requestData.paidAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>What's next?</strong> The company has been notified of your payment.
                    You can track your investment progress in your dashboard.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    className="flex-1 bg-lebanese-navy hover:bg-opacity-90"
                    asChild
                  >
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/investments/${requestData.investmentId}`}>
                      View Project
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Payment processed successfully!</p>
                <Button
                  className="bg-lebanese-navy hover:bg-opacity-90"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
