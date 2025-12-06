import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInvestorPayouts, useInvestorPayoutHistory, useCreatePayoutRequest } from "@/hooks/usePayoutQueries";
import { useCompanyPayouts, useSubmitPayoutEvidence } from "@/hooks/usePayoutQueries";
import { useAdminPayouts, useApprovePayout, useRejectPayout } from "@/hooks/usePayoutQueries";
import { useToast } from "@/components/ui/use-toast";
import { PayoutRequestDto, PayoutHistoryDto } from "@/api/payout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface PayoutHistoryProps {
  userType: "investor" | "company" | "admin";
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    PENDING: "outline",
    SUBMITTED: "default",
    VERIFYING: "default",
    APPROVED: "default",
    REJECTED: "destructive",
    COMPLETED: "default",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
};

export const PayoutHistory: React.FC<PayoutHistoryProps> = ({ userType }) => {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequestDto | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  // Investor hooks
  const { data: investorPayouts = [], isLoading: investorLoading } = useInvestorPayouts(selectedStatus);
  const { data: investorHistory = [] } = useInvestorPayoutHistory();
  const createPayoutRequest = useCreatePayoutRequest();

  // Company hooks
  const { data: companyPayouts = [], isLoading: companyLoading } = useCompanyPayouts(selectedStatus);
  const submitEvidence = useSubmitPayoutEvidence();

  // Admin hooks
  const { data: adminPayouts = [], isLoading: adminLoading } = useAdminPayouts(selectedStatus);
  const approvePayout = useApprovePayout();
  const rejectPayout = useRejectPayout();

  const payouts = userType === "investor" ? investorPayouts : userType === "company" ? companyPayouts : adminPayouts;
  const loading = userType === "investor" ? investorLoading : userType === "company" ? companyLoading : adminLoading;

  const handleCreatePayoutRequest = async (investorInvestmentId: number) => {
    try {
      await createPayoutRequest.mutateAsync(investorInvestmentId);
      toast({
        title: "Success",
        description: "Payout request created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create payout request",
        variant: "destructive",
      });
    }
  };

  const handleSubmitEvidence = async () => {
    if (!selectedPayout || !evidenceFile) return;
    try {
      await submitEvidence.mutateAsync({
        payoutRequestId: selectedPayout.id,
        evidenceFile,
      });
      toast({
        title: "Success",
        description: "Evidence submitted successfully",
      });
      setSelectedPayout(null);
      setEvidenceFile(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit evidence",
        variant: "destructive",
      });
    }
  };

  const handleApprovePayout = async () => {
    if (!selectedPayout) return;
    try {
      await approvePayout.mutateAsync({
        payoutRequestId: selectedPayout.id,
        request: adminNotes ? { adminNotes } : undefined,
      });
      toast({
        title: "Success",
        description: "Payout approved successfully",
      });
      setSelectedPayout(null);
      setAdminNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve payout",
        variant: "destructive",
      });
    }
  };

  const handleRejectPayout = async () => {
    if (!selectedPayout || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Rejection reason is required",
        variant: "destructive",
      });
      return;
    }
    try {
      await rejectPayout.mutateAsync({
        payoutRequestId: selectedPayout.id,
        request: { rejectionReason },
      });
      toast({
        title: "Success",
        description: "Payout rejected successfully",
      });
      setSelectedPayout(null);
      setRejectionReason("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject payout",
        variant: "destructive",
      });
    }
  };

  if (userType === "investor") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Payout Requests</h2>
          <div className="flex gap-2">
            <Button
              variant={selectedStatus === undefined ? "default" : "outline"}
              onClick={() => setSelectedStatus(undefined)}
            >
              All
            </Button>
            <Button
              variant={selectedStatus === "PENDING" ? "default" : "outline"}
              onClick={() => setSelectedStatus("PENDING")}
            >
              Pending
            </Button>
            <Button
              variant={selectedStatus === "SUBMITTED" ? "default" : "outline"}
              onClick={() => setSelectedStatus("SUBMITTED")}
            >
              Submitted
            </Button>
            <Button
              variant={selectedStatus === "COMPLETED" ? "default" : "outline"}
              onClick={() => setSelectedStatus("COMPLETED")}
            >
              Completed
            </Button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : payouts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No payout requests found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payouts.map((payout) => (
              <Card key={payout.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{payout.investmentTitle}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Company: {payout.companyName}
                      </p>
                    </div>
                    {getStatusBadge(payout.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">{formatCurrency(payout.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Return</p>
                      <p className="font-semibold">{formatCurrency(payout.expectedReturn)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-semibold">{formatDate(payout.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold">{payout.status}</p>
                    </div>
                  </div>
                  {payout.rejectionReason && (
                    <div className="mt-4 p-3 bg-destructive/10 rounded-md">
                      <p className="text-sm font-semibold text-destructive">Rejection Reason:</p>
                      <p className="text-sm">{payout.rejectionReason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {userType === "investor" && investorHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Payout History</h3>
            <div className="space-y-4">
              {investorHistory.map((history) => (
                <Card key={history.id}>
                  <CardHeader>
                    <CardTitle>{history.investmentTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Principal</p>
                        <p className="font-semibold">{formatCurrency(history.principalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Return</p>
                        <p className="font-semibold">{formatCurrency(history.returnAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Payout</p>
                        <p className="font-semibold">{formatCurrency(history.totalPayout)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="font-semibold">{formatDate(history.completedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (userType === "company") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Payout Requests</h2>
          <div className="flex gap-2">
            <Button
              variant={selectedStatus === undefined ? "default" : "outline"}
              onClick={() => setSelectedStatus(undefined)}
            >
              All
            </Button>
            <Button
              variant={selectedStatus === "PENDING" ? "default" : "outline"}
              onClick={() => setSelectedStatus("PENDING")}
            >
              Pending
            </Button>
            <Button
              variant={selectedStatus === "SUBMITTED" ? "default" : "outline"}
              onClick={() => setSelectedStatus("SUBMITTED")}
            >
              Submitted
            </Button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : payouts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No payout requests found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payouts.map((payout) => (
              <Card key={payout.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{payout.investmentTitle}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Investor: {payout.investorName} ({payout.investorEmail})
                      </p>
                    </div>
                    {getStatusBadge(payout.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">{formatCurrency(payout.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Return</p>
                      <p className="font-semibold">{formatCurrency(payout.expectedReturn)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-semibold">{formatDate(payout.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold">{payout.status}</p>
                    </div>
                  </div>
                  {payout.status === "PENDING" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedPayout(payout)}>Submit Evidence</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Payout Evidence</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="evidence">Evidence File</Label>
                            <Input
                              id="evidence"
                              type="file"
                              onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                            />
                          </div>
                          <Button onClick={handleSubmitEvidence} disabled={!evidenceFile}>
                            Submit
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {payout.payoutEvidenceUrl && (
                    <div className="mt-2">
                      <a
                        href={payout.payoutEvidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Evidence
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Admin view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payout Review</h2>
        <div className="flex gap-2">
          <Button
            variant={selectedStatus === undefined ? "default" : "outline"}
            onClick={() => setSelectedStatus(undefined)}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === "SUBMITTED" ? "default" : "outline"}
            onClick={() => setSelectedStatus("SUBMITTED")}
          >
            Pending Review
          </Button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : payouts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No payout requests found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => (
            <Card key={payout.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{payout.investmentTitle}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Company: {payout.companyName} | Investor: {payout.investorName}
                    </p>
                  </div>
                  {getStatusBadge(payout.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-semibold">{formatCurrency(payout.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Return</p>
                    <p className="font-semibold">{formatCurrency(payout.expectedReturn)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-semibold">{formatDate(payout.submittedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{payout.status}</p>
                  </div>
                </div>
                {payout.payoutEvidenceUrl && (
                  <div className="mb-4">
                    <a
                      href={payout.payoutEvidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Evidence
                    </a>
                  </div>
                )}
                {payout.status === "SUBMITTED" && (
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          onClick={() => {
                            setSelectedPayout(payout);
                            setAdminNotes("");
                          }}
                        >
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approve Payout</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                            <Textarea
                              id="adminNotes"
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Add notes about this approval..."
                            />
                          </div>
                          <Button onClick={handleApprovePayout}>Confirm Approval</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedPayout(payout);
                            setRejectionReason("");
                          }}
                        >
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Payout</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                            <Textarea
                              id="rejectionReason"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Please provide a reason for rejection..."
                              required
                            />
                          </div>
                          <Button onClick={handleRejectPayout} disabled={!rejectionReason.trim()}>
                            Confirm Rejection
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
