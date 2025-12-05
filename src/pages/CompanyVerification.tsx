import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitCompanyVerification, getCompanyVerification, CompanyVerificationRequest } from "@/api/company";
import { CheckCircle, Building2, FileText, Upload } from "lucide-react";
import { Helmet } from "react-helmet";
import apiClient from "@/api/common/apiClient";

const CompanyVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentSection, setCurrentSection] = useState<"A" | "B" | "C">("A");

  const [formData, setFormData] = useState<CompanyVerificationRequest>({
    certificateOfIncorporation: "",
    articlesOfAssociation: "",
    taxRegistrationCertificate: "",
    proofOfRegisteredAddress: "",
    shareholderStructure: "",
    uboIds: [],
    directorIds: [],
    authorizedSignatoryIds: [],
    boardResolution: "",
    pepSanctionsDeclaration: "",
    bankAccountConfirmation: "",
    financialStatements: [],
    managementAccounts: [],
    bankStatements: [],
    sourceOfFundsDeclaration: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [multipleFiles, setMultipleFiles] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const existing = await getCompanyVerification();
        if (existing) {
          setFormData(existing);
          // Set uploaded files state
          if (existing.certificateOfIncorporation) uploadedFiles.certificateOfIncorporation = existing.certificateOfIncorporation;
          if (existing.articlesOfAssociation) uploadedFiles.articlesOfAssociation = existing.articlesOfAssociation;
          if (existing.taxRegistrationCertificate) uploadedFiles.taxRegistrationCertificate = existing.taxRegistrationCertificate;
          if (existing.proofOfRegisteredAddress) uploadedFiles.proofOfRegisteredAddress = existing.proofOfRegisteredAddress;
          if (existing.shareholderStructure) uploadedFiles.shareholderStructure = existing.shareholderStructure;
          if (existing.boardResolution) uploadedFiles.boardResolution = existing.boardResolution;
          if (existing.pepSanctionsDeclaration) uploadedFiles.pepSanctionsDeclaration = existing.pepSanctionsDeclaration;
          if (existing.bankAccountConfirmation) uploadedFiles.bankAccountConfirmation = existing.bankAccountConfirmation;
          if (existing.sourceOfFundsDeclaration) uploadedFiles.sourceOfFundsDeclaration = existing.sourceOfFundsDeclaration;
          if (existing.uboIds) multipleFiles.uboIds = existing.uboIds;
          if (existing.directorIds) multipleFiles.directorIds = existing.directorIds;
          if (existing.authorizedSignatoryIds) multipleFiles.authorizedSignatoryIds = existing.authorizedSignatoryIds;
          if (existing.financialStatements) multipleFiles.financialStatements = existing.financialStatements;
          if (existing.managementAccounts) multipleFiles.managementAccounts = existing.managementAccounts;
          if (existing.bankStatements) multipleFiles.bankStatements = existing.bankStatements;
        }
      } catch (error) {
        console.error("Failed to load existing verification data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadExistingData();
  }, []);

  const handleFileUpload = async (field: keyof CompanyVerificationRequest, file: File): Promise<string> => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    
    try {
      const response = await apiClient.post<{ status: number; message: string; data: { documentUrl: string } }>(
        "/companies/me/documents",
        formDataObj
      );
      
      if (response.data.status === 201) {
        return response.data.data.documentUrl;
      }
      throw new Error(response.data.message || "Upload failed");
    } catch (error: any) {
      console.error("File upload error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload file";
      throw new Error(errorMessage);
    }
  };

  const handleFileChange = async (
    field: keyof CompanyVerificationRequest,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await handleFileUpload(field, file);
      setFormData((prev) => ({ ...prev, [field]: url }));
      setUploadedFiles((prev) => ({ ...prev, [field]: file.name }));
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}`,
        variant: "error",
      });
    }
  };

  const handleMultipleFileChange = async (
    field: keyof CompanyVerificationRequest,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      const urls = await Promise.all(files.map((file) => handleFileUpload(field, file)));
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), ...urls],
      }));
      setMultipleFiles((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), ...files.map(f => f.name)],
      }));
      toast({
        title: "Files Uploaded",
        description: `${files.length} file(s) uploaded successfully`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files",
        variant: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await submitCompanyVerification(formData);
      toast({
        title: "Documents Submitted!",
        description: "Your verification documents have been submitted. Please wait for admin approval.",
        variant: "success",
      });
      navigate("/company-dashboard");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit verification documents",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileUpload = (
    id: string,
    label: string,
    field: keyof CompanyVerificationRequest,
    accept: string = ".pdf,.jpg,.jpeg,.png",
    required: boolean = true
  ) => {
    // Get filename from uploadedFiles (user-friendly name) or extract from documentUrl path
    const uploadedFileName = uploadedFiles[field];
    const documentUrl = formData[field] as string;
    const fileNameFromUrl = documentUrl ? documentUrl.split('/').pop() : null;
    const fileName = uploadedFileName || fileNameFromUrl;
    
    return (
      <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 sm:p-6 text-center overflow-hidden">
        <Label htmlFor={id} className="block mb-2 text-sm font-medium">
          {label} {required && "*"}
        </Label>
        <input
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => handleFileChange(field, e)}
        />
        <button
          type="button"
          className="text-lebanese-navy hover:underline font-medium"
          onClick={() => document.getElementById(id)?.click()}
        >
          {fileName ? "Change file" : "Select file"}
        </button>
        {fileName ? (
          <div className="mt-2 flex items-center justify-center gap-2 text-green-700 text-sm font-medium px-2 w-full min-w-0">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-full break-words overflow-wrap-anywhere" title={fileName}>
              {fileName}
            </span>
          </div>
        ) : (
          <p className="mt-1 text-xs text-gray-500">
            Accepted: {accept.replace(/,/g, ", ")}
          </p>
        )}
      </div>
    );
  };

  const renderMultipleFileUpload = (
    id: string,
    label: string,
    field: keyof CompanyVerificationRequest,
    accept: string = ".pdf,.jpg,.jpeg,.png",
    required: boolean = true
  ) => {
    const files = multipleFiles[field] || [];
    return (
      <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 sm:p-6 text-center overflow-hidden">
        <Label htmlFor={id} className="block mb-2 text-sm font-medium">
          {label} {required && "*"}
        </Label>
        <input
          id={id}
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          onChange={(e) => handleMultipleFileChange(field, e)}
        />
        <button
          type="button"
          className="text-lebanese-navy hover:underline font-medium"
          onClick={() => document.getElementById(id)?.click()}
        >
          {files.length > 0 ? "Add more files" : "Select files"}
        </button>
        {files.length > 0 && (
          <div className="mt-2 space-y-1 px-2 w-full">
            {files.map((fileName, idx) => (
              <div key={idx} className="flex items-center justify-center gap-2 text-green-700 text-sm font-medium w-full min-w-0">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="truncate max-w-full break-words overflow-wrap-anywhere" title={fileName}>
                  {fileName}
                </span>
              </div>
            ))}
          </div>
        )}
        {files.length === 0 && (
          <p className="mt-1 text-xs text-gray-500">
            Accepted: {accept.replace(/,/g, ", ")} (Multiple files allowed)
          </p>
        )}
      </div>
    );
  };

  const renderSectionA = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-lebanese-navy" />
        <h3 className="text-lg font-semibold">A. Company Legal Documents</h3>
      </div>
      {renderFileUpload(
        "certificateOfIncorporation",
        "Certificate of Incorporation / Commercial Register Extract",
        "certificateOfIncorporation"
      )}
      {renderFileUpload(
        "articlesOfAssociation",
        "Articles of Association / Bylaws",
        "articlesOfAssociation"
      )}
      {renderFileUpload(
        "taxRegistrationCertificate",
        "Tax Registration Certificate",
        "taxRegistrationCertificate"
      )}
      {renderFileUpload(
        "proofOfRegisteredAddress",
        "Proof of Registered Address (lease or utility bill)",
        "proofOfRegisteredAddress"
      )}
    </div>
  );

  const renderSectionB = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-lebanese-navy" />
        <h3 className="text-lg font-semibold">B. Ownership & Control</h3>
      </div>
      {renderFileUpload(
        "shareholderStructure",
        "Shareholder Structure (UBOs ≥ 25%)",
        "shareholderStructure"
      )}
      {renderMultipleFileUpload(
        "uboIds",
        "IDs of All UBOs",
        "uboIds"
      )}
      {renderMultipleFileUpload(
        "directorIds",
        "IDs of Directors",
        "directorIds"
      )}
      {renderMultipleFileUpload(
        "authorizedSignatoryIds",
        "IDs of Authorized Signatory",
        "authorizedSignatoryIds"
      )}
      {renderFileUpload(
        "boardResolution",
        "Board Resolution / Power of Attorney",
        "boardResolution"
      )}
      {renderFileUpload(
        "pepSanctionsDeclaration",
        "PEP/Sanctions Declaration Form",
        "pepSanctionsDeclaration"
      )}
    </div>
  );

  const renderSectionC = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-lebanese-navy" />
        <h3 className="text-lg font-semibold">C. Finance & Banking</h3>
      </div>
      {renderFileUpload(
        "bankAccountConfirmation",
        "Bank Account Confirmation (IBAN in the company name)",
        "bankAccountConfirmation"
      )}
      {renderMultipleFileUpload(
        "financialStatements",
        "Latest 1–3 years Financial Statements (audited if possible)",
        "financialStatements"
      )}
      {renderMultipleFileUpload(
        "managementAccounts",
        "Latest Management Accounts (if startup)",
        "managementAccounts",
        ".pdf,.jpg,.jpeg,.png",
        false
      )}
      {renderMultipleFileUpload(
        "bankStatements",
        "3–6 months Bank Statements",
        "bankStatements"
      )}
      {renderFileUpload(
        "sourceOfFundsDeclaration",
        "Source-of-Funds / Source-of-Wealth Declaration",
        "sourceOfFundsDeclaration"
      )}
    </div>
  );

  if (isLoadingData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Complete Company Verification | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="h-6 w-6 text-lebanese-navy" />
              <CardTitle className="text-2xl font-bold text-center text-lebanese-navy">
                Complete Company Verification
              </CardTitle>
            </div>
            <CardDescription className="text-center">
              Upload the required documents to complete your company verification and start posting projects.
              These documents will be reused for all your projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Section Navigation */}
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={currentSection === "A" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSection("A")}
                  className="flex-1"
                >
                  A. Legal
                </Button>
                <Button
                  type="button"
                  variant={currentSection === "B" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSection("B")}
                  className="flex-1"
                >
                  B. Ownership
                </Button>
                <Button
                  type="button"
                  variant={currentSection === "C" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSection("C")}
                  className="flex-1"
                >
                  C. Finance
                </Button>
              </div>

              {/* Render current section */}
              {currentSection === "A" && renderSectionA()}
              {currentSection === "B" && renderSectionB()}
              {currentSection === "C" && renderSectionC()}

              <Button
                type="submit"
                className="w-full bg-lebanese-navy hover:bg-opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Verification Documents"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/company-dashboard")}
              >
                Cancel
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500">
              All documents are securely stored and will be reviewed by our admin team.
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyVerification;
