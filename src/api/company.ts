import apiClient from "@/api/common/apiClient";
import { ApiResponse } from "@/lib/types";

export interface CompanyVerificationRequest {
  // A. Company Legal Documents
  certificateOfIncorporation?: string;
  articlesOfAssociation?: string;
  taxRegistrationCertificate?: string;
  proofOfRegisteredAddress?: string;

  // B. Ownership & Control
  shareholderStructure?: string;
  uboIds?: string[]; // IDs of All UBOs
  directorIds?: string[]; // IDs of Directors
  authorizedSignatoryIds?: string[]; // IDs of Authorized Signatory
  boardResolution?: string;
  pepSanctionsDeclaration?: string;

  // C. Finance & Banking
  bankAccountConfirmation?: string;
  financialStatements?: string[]; // Latest 1–3 years Financial Statements
  managementAccounts?: string[]; // Latest management accounts (if startup)
  bankStatements?: string[]; // 3–6 months bank statements
  sourceOfFundsDeclaration?: string;
}

export interface CompanyProfile {
  id: number;
  name: string;
  status: "PENDING" | "APPROVED" | "PENDING_DOCS" | "FULLY_VERIFIED" | "REJECTED";
  // ... other fields
}

export const submitCompanyVerification = async (
  data: CompanyVerificationRequest
): Promise<void> => {
  const response = await apiClient.post<ApiResponse<void>>(
    "/companies/me/verification",
    data
  );
  if (response.data.status !== 201) {
    throw new Error(response.data.message || "Failed to submit verification documents");
  }
};

export const getCompanyVerification = async (): Promise<CompanyVerificationRequest | null> => {
  const response = await apiClient.get<ApiResponse<{ documents: CompanyVerificationRequest | null }>>(
    "/companies/me/verification"
  );
  if (response.data.status === 200) {
    return response.data.data.documents;
  }
  return null;
};

export const getCompanyProfile = async (): Promise<CompanyProfile> => {
  const response = await apiClient.get<ApiResponse<{ profile: CompanyProfile }>>(
    "/companies/me/profile"
  );
  if (response.data.status === 200) {
    return response.data.data.profile;
  }
  throw new Error("Failed to fetch company profile");
};

