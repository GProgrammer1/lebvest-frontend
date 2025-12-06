
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectForm from "@/components/ProjectForm";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, AlertTriangle } from "lucide-react";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

const ListProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyStatus, setCompanyStatus] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const formDataRef = useRef<any>(null);

  // Check company verification status
  useEffect(() => {
    const checkCompanyStatus = async () => {
      try {
        const profileResponse = await apiClient.get<ResponsePayload>("/companies/me/profile");
        const status = profileResponse.data?.data?.profile?.status;
        setCompanyStatus(status || null);
      } catch (error) {
        console.error("Error checking company status:", error);
        // If not a company or error, allow access (will be blocked by backend if needed)
        setCompanyStatus(null);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    checkCompanyStatus();
  }, []);
  
  const handleNextStep = async () => {
    if (step < 3) {
      // Validate current step before moving to next
      const formData = await formDataRef.current?.getFormData();
      if (formData) {
        setStep((prev) => (prev === 1 ? 2 : 3) as 1 | 2 | 3);
      } else {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly",
          variant: "error",
        });
      }
    } else {
      // Submit on step 3
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const formData = await formDataRef.current?.getFormData();
    if (!formData) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and agree to the terms",
        variant: "error",
      });
      return;
    }

    // Validate terms agreed
    if (!formData.termsAgreed) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate deadline (e.g., 90 days from now)
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 90);
      const deadlineStr = deadline.toISOString().split('T')[0];

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.location) {
        toast({
          title: "Error",
          description: "Please complete all basic information fields",
          variant: "error",
        });
        setIsSubmitting(false);
        return;
      }

      if (!formData.investmentType || !formData.targetAmount || !formData.minInvestment) {
        toast({
          title: "Error",
          description: "Please complete all business details fields",
          variant: "error",
        });
        setIsSubmitting(false);
        return;
      }

      const requestData = {
        title: formData.title,
        description: formData.description,
        category: formData.category.toUpperCase().replace(/\s+/g, '_'),
        riskLevel: "MEDIUM", // Default risk level
        expectedReturn: formData.expectedReturn || 10,
        minInvestment: parseFloat(formData.minInvestment),
        targetAmount: parseFloat(formData.targetAmount),
        location: formData.location.toUpperCase().replace(/\s+/g, '_'),
        investmentType: formData.investmentType.toUpperCase().replace(/\s+/g, '_'),
        durationMonths: formData.duration || 36,
        deadline: deadlineStr,
        imageUrl: formData.imageUrl || null,
        fundingStage: formData.fundingStage || null,
        highlights: formData.highlights || [],
      };

      const response = await apiClient.post<ResponsePayload>("/companies/me/investments", requestData);

      if (response.data.status === 201) {
        toast({
          title: "Success",
          description: "Investment opportunity created successfully!",
          variant: "success",
        });
        navigate("/company-dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create investment opportunity",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="bg-lebanese-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">List Your Project or Business</h1>
          <p className="text-xl">Connect with investors and get the funding you need to grow.</p>
        </div>
      </div>
      
      <main className="flex-grow py-8 sm:py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Block APPROVED companies (step 1 only) from listing projects */}
          {!isLoadingStatus && (companyStatus === "APPROVED" || companyStatus === "PENDING_DOCS") && (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Complete Verification Required
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Your company has been approved (Step 1), but you need to complete the full verification process (Step 2) before you can list projects.
                  <br /><br />
                  Please complete your verification documents to become fully verified and start posting projects.
                </p>
                <Button
                  onClick={() => navigate("/company-verification")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  size="lg"
                >
                  Complete Verification
                </Button>
              </div>
            </div>
          )}

          {/* Show form only for FULLY_VERIFIED companies */}
          {!isLoadingStatus && companyStatus === "FULLY_VERIFIED" && (
            <>
              {/* Success message for fully verified companies */}
              <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-green-800 mb-1">
                      Company Fully Verified
                    </h3>
                    <p className="text-sm text-green-700">
                      Your company is fully verified. You can now post projects and connect with investors.
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress tracker */}
              <div className="flex items-center justify-between mb-8 sm:mb-12 w-full">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-lebanese-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                    1
                  </div>
                  <span className="mt-2 text-xs sm:text-sm text-center">Basic Info</span>
                </div>
                <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-gray-200 relative">
                  <div className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-lebanese-green' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-lebanese-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2
                  </div>
                  <span className="mt-2 text-xs sm:text-sm text-center">Business Details</span>
                </div>
                <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-gray-200 relative">
                  <div className={`h-full transition-all duration-300 ${step >= 3 ? 'bg-lebanese-green' : 'bg-gray-200'}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? 'bg-lebanese-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                    3
                  </div>
                  <span className="mt-2 text-xs sm:text-sm text-center">Documents & Submit</span>
                </div>
              </div>
              
              {/* Form content */}
              <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
                <ProjectForm step={step} ref={formDataRef} />
                
                {/* Navigation buttons */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                  {step > 1 && (
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto order-2 sm:order-1"
                      onClick={() => setStep((prev) => (prev === 3 ? 2 : 1) as 1 | 2 | 3)}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                  )}
                  <Button 
                    onClick={handleNextStep}
                    className="bg-lebanese-navy hover:bg-opacity-90 w-full sm:w-auto order-1 sm:order-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : step === 3 ? 'Submit Project' : 'Next Step'}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Loading state */}
          {isLoadingStatus && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ListProject;
