import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, CreditCard, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { useCreateInvestmentRequest } from "@/hooks/useInvestmentQueries";
import { useToast } from "@/components/ui/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

const getStripePublishableKey = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!key || key === "pk_test_..." || key.includes("...")) {
    return null;
  }
  if (!key.startsWith("pk_test_") && !key.startsWith("pk_live_")) {
    return null;
  }
  return key.trim();
};

const stripePublishableKey = getStripePublishableKey();
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface MultiStepInvestmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment: {
    id: number;
    title: string;
    minInvestment: number;
    targetAmount: number;
    raisedAmount: number;
    expectedReturn: number;
    riskLevel: string;
  };
  onSuccess?: () => void;
}

type Step = "amount" | "risks" | "payment" | "stripe" | "confirmation";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const StripeCheckoutForm = ({
  requestId,
  amount,
  onSuccess,
  onBack,
}: {
  requestId: number;
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
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
      } else {
        onSuccess();
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
      <PaymentElement />
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 bg-lebanese-navy hover:bg-opacity-90">
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
};

export const MultiStepInvestmentModal = ({
  open,
  onOpenChange,
  investment,
  onSuccess,
}: MultiStepInvestmentModalProps) => {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState<number>(investment.minInvestment);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeReady, setStripeReady] = useState(false);

  const createRequest = useCreateInvestmentRequest();
  const { toast } = useToast();

  const steps: { key: Step; title: string }[] = [
    { key: "amount", title: "Choose Amount" },
    { key: "risks", title: "Confirm Risks" },
    { key: "payment", title: "Payment Method" },
    { key: "stripe", title: "Payment" },
    { key: "confirmation", title: "Confirmation" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Initialize Stripe
  React.useEffect(() => {
    if (stripePromise) {
      stripePromise
        .then((stripe) => {
          if (stripe) {
            setStripeReady(true);
          }
        })
        .catch((err) => {
          console.error("Stripe initialization error:", err);
        });
    }
  }, []);

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= investment.minInvestment) {
      setAmount(numValue);
    }
  };

  const handleNext = async () => {
    if (step === "amount") {
      const finalAmount = customAmount ? parseFloat(customAmount) : amount;
      if (finalAmount < investment.minInvestment) {
        toast({
          title: "Invalid Amount",
          description: `Minimum investment is ${formatCurrency(investment.minInvestment)}`,
          variant: "destructive",
        });
        return;
      }
      setAmount(finalAmount);
      setStep("risks");
    } else if (step === "risks") {
      if (!riskAcknowledged) {
        toast({
          title: "Required",
          description: "Please acknowledge the risks before proceeding",
          variant: "destructive",
        });
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
      if (!paymentMethod) {
        toast({
          title: "Required",
          description: "Please select a payment method",
          variant: "destructive",
        });
        return;
      }
      if (paymentMethod === "stripe") {
        // Create investment request first
        try {
          const result = await createRequest.mutateAsync({
            investmentId: investment.id,
            amount,
          });
          
          if (result.data?.requestId) {
            setRequestId(result.data.requestId);
            // Get Stripe client secret
            try {
              const response = await apiClient.post<ResponsePayload>(
                `/payment/create-payment-intent`,
                { requestId: result.data.requestId }
              );
              if (response.data.status === 200) {
                setClientSecret(response.data.data.clientSecret);
                setStep("stripe");
              } else {
                throw new Error("Failed to create payment intent");
              }
            } catch (error: any) {
              toast({
                title: "Payment Error",
                description: error.response?.data?.message || "Failed to initialize payment",
                variant: "destructive",
              });
            }
          }
        } catch (error: any) {
          toast({
            title: "Investment Request Failed",
            description: error.response?.data?.message || "Failed to create investment request",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleBack = () => {
    if (step === "risks") {
      setStep("amount");
    } else if (step === "payment") {
      setStep("risks");
    } else if (step === "stripe") {
      setStep("payment");
    }
  };

  const handleClose = () => {
    if (step === "confirmation") {
      setStep("amount");
      setAmount(investment.minInvestment);
      setCustomAmount("");
      setRiskAcknowledged(false);
      setPaymentMethod(null);
      setRequestId(null);
      setClientSecret(null);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } else {
      onOpenChange(false);
    }
  };

  const quickAmounts = [
    investment.minInvestment,
    investment.minInvestment * 2,
    investment.minInvestment * 5,
    investment.minInvestment * 10,
  ].filter((amt) => amt <= investment.targetAmount - investment.raisedAmount);

  const renderStepContent = () => {
    switch (step) {
      case "amount":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Investment Amount</Label>
              <p className="text-sm text-gray-500 mt-1">
                Minimum: {formatCurrency(investment.minInvestment)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant={amount === quickAmount ? "default" : "outline"}
                  className={amount === quickAmount ? "bg-lebanese-navy hover:bg-opacity-90" : ""}
                  onClick={() => handleAmountSelect(quickAmount)}
                >
                  {formatCurrency(quickAmount)}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Or enter custom amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min={investment.minInvestment}
                step="100"
              />
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Your Investment:</span>
                  <span className="text-lg font-bold text-lebanese-navy">
                    {formatCurrency(amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Expected Return:</span>
                  <span className="text-sm font-medium text-lebanese-green">
                    {formatCurrency(amount * (investment.expectedReturn / 100))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "risks":
        return (
          <div className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please read and acknowledge the risks associated with this investment.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Investment Risks</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Investments are subject to market risks</li>
                  <li>Returns are not guaranteed</li>
                  <li>You may lose part or all of your investment</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>This investment is not insured by any government agency</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Risk Level: {investment.riskLevel}</h4>
                <Badge
                  variant={
                    investment.riskLevel === "High"
                      ? "destructive"
                      : investment.riskLevel === "Medium"
                      ? "default"
                      : "secondary"
                  }
                >
                  {investment.riskLevel} Risk
                </Badge>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="risk-acknowledge"
                  checked={riskAcknowledged}
                  onChange={(e) => setRiskAcknowledged(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="risk-acknowledge" className="text-sm">
                  I acknowledge that I have read and understand the risks associated with this
                  investment. I am investing at my own risk.
                </label>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Select Payment Method</Label>
            </div>

            <div className="space-y-3">
              <Card
                className={`cursor-pointer transition-all ${
                  paymentMethod === "stripe"
                    ? "border-lebanese-navy border-2"
                    : "hover:border-gray-300"
                }`}
                onClick={() => setPaymentMethod("stripe")}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    paymentMethod === "stripe" ? "bg-lebanese-navy" : "bg-gray-100"
                  }`}>
                    <CreditCard className={`h-5 w-5 ${
                      paymentMethod === "stripe" ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">Secure payment via Stripe</div>
                  </div>
                  {paymentMethod === "stripe" && (
                    <CheckCircle2 className="h-5 w-5 text-lebanese-navy" />
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Your payment is secured and encrypted</span>
              </div>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="text-xl font-bold text-lebanese-navy">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "stripe":
        if (!stripePromise || !stripeReady || !clientSecret) {
          return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
              <p>Initializing payment form...</p>
            </div>
          );
        }

        const options = {
          clientSecret,
          appearance: {
            theme: "stripe" as const,
            variables: {
              colorPrimary: "#1e3a5f",
              borderRadius: "8px",
            },
          },
        };

        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Payment Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Project:</span>
                  <span className="font-medium">{investment.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              </div>
            </div>

            <Elements stripe={stripePromise} options={options}>
              <StripeCheckoutForm
                requestId={requestId!}
                amount={amount}
                onSuccess={() => setStep("confirmation")}
                onBack={handleBack}
              />
            </Elements>
          </div>
        );

      case "confirmation":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-gray-600">
                Your investment request has been submitted and payment has been processed.
              </p>
            </div>
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Investment Amount:</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Project:</span>
                    <span className="font-medium">{investment.title}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-sm text-gray-500">
              You will receive a confirmation email shortly. The company will review your request
              and notify you of the status.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invest in {investment.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{steps[currentStepIndex].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderStepContent()}

          {step !== "stripe" && step !== "confirmation" && (
            <div className="flex gap-2">
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={
                  (step === "amount" && amount < investment.minInvestment) ||
                  (step === "risks" && !riskAcknowledged) ||
                  (step === "payment" && !paymentMethod) ||
                  createRequest.isPending
                }
                className="flex-1 bg-lebanese-navy hover:bg-opacity-90"
              >
                {createRequest.isPending ? "Processing..." : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {step === "confirmation" && (
            <Button
              onClick={handleClose}
              className="w-full bg-lebanese-navy hover:bg-opacity-90"
            >
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

