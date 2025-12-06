import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe - Get publishable key from environment
const getStripePublishableKey = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!key || key === "pk_test_..." || key.includes("...")) {
    console.error("⚠️ Stripe publishable key not configured! Please set VITE_STRIPE_PUBLISHABLE_KEY in .env file");
    return null;
  }
  // Validate key format
  if (!key.startsWith("pk_test_") && !key.startsWith("pk_live_")) {
    console.error("⚠️ Invalid Stripe publishable key format! Key must start with 'pk_test_' or 'pk_live_'");
    return null;
  }
  return key.trim();
};

const stripePublishableKey = getStripePublishableKey();
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const CheckoutForm = ({ requestId, amount, investmentTitle }: { requestId: number; amount: number; investmentTitle: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "An error occurred");
        setLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success/${requestId}`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during payment");
      setLoading(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
        <p>Loading payment form...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        onReady={() => {
          console.log("PaymentElement is ready");
        }}
      />
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-lebanese-navy hover:bg-opacity-90 text-white"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${formatCurrency(amount)}`
        )}
      </Button>
    </form>
  );
};

const PaymentPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<any>(null);
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    // Verify Stripe is loaded
    if (stripePromise) {
      stripePromise
        .then((stripe) => {
          if (stripe) {
            setStripeReady(true);
          } else {
            setError("Failed to initialize Stripe. Please check your publishable key.");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Stripe initialization error:", err);
          setError("Failed to load Stripe. Please refresh the page.");
          setLoading(false);
        });
    } else {
      setError("Stripe publishable key is not configured.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!requestId) {
        setError("Invalid request ID");
        setLoading(false);
        return;
      }

      if (!stripeReady) {
        return; // Wait for Stripe to be ready
      }

      try {
        const response = await apiClient.post<ResponsePayload>(
          `/payments/investment-requests/${requestId}/create-payment-intent`
        );

        if (response.data.status === 200) {
          setClientSecret(response.data.data.clientSecret);
          
          // Fetch request details
          const requestResponse = await apiClient.get<ResponsePayload>(
            `/investors/me/investment-requests/accepted`
          );
          if (requestResponse.data.status === 200) {
            const requests = requestResponse.data.data.requests || [];
            const request = requests.find((r: any) => r.id === Number(requestId));
            if (request) {
              setRequestData(request);
            }
          }
        } else {
          setError(response.data.message || "Failed to initialize payment");
        }
      } catch (err: any) {
        console.error("Error creating payment intent:", err);
        setError(err.response?.data?.message || "Failed to initialize payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (stripeReady) {
      fetchPaymentIntent();
    }
  }, [requestId, stripeReady]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-lebanese-navy" />
              <p>Initializing payment...</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!stripePublishableKey) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2 text-red-600">Configuration Error</h2>
              <p className="text-gray-600 mb-4">
                Stripe publishable key is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your .env file.
              </p>
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2 text-red-600">Payment Error</h2>
              <p className="text-gray-600 mb-4">{error || "Failed to initialize payment"}</p>
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2 text-red-600">Stripe Initialization Error</h2>
              <p className="text-gray-600 mb-4">Failed to initialize Stripe. Please check your publishable key configuration.</p>
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#1e3a8a", // Lebanese navy color
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <title>Payment | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-lebanese-navy">
            <CardHeader className="bg-lebanese-navy text-white">
              <CardTitle className="text-2xl">Complete Your Investment</CardTitle>
              <CardDescription className="text-white/90">
                Secure payment powered by Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {requestData && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Investment Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Project:</strong> {requestData.investmentTitle}</p>
                    <p><strong>Amount:</strong> {formatCurrency(Number(requestData.amount))}</p>
                  </div>
                </div>
              )}

              {stripePromise && stripeReady && clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm
                    requestId={Number(requestId)}
                    amount={requestData ? Number(requestData.amount) : 0}
                    investmentTitle={requestData?.investmentTitle || "Investment"}
                  />
                </Elements>
              )}
              {(!stripePromise || !stripeReady) && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                  <p>Initializing payment form...</p>
                </div>
              )}

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Your payment is secured by Stripe. We never store your card details.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPage;
