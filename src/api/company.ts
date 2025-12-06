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
  description?: string;
  logo?: string;
  sector?: string;
  location?: string;
  foundedYear?: number;
  email?: string;
  contactName?: string;
  teamMembers?: Array<{
    id?: number;
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
  }>;
  documents?: string[];
  financials?: Array<{
    id: number;
    year: number;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  socialMedia?: {
    website?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  status?: "PENDING" | "APPROVED" | "PENDING_DOCS" | "FULLY_VERIFIED" | "REJECTED";
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
    "/companies/me/profile",
    {
      timeout: 30000, // 30 seconds timeout
    }
  );
  if (response.data.status === 200) {
    return response.data.data.profile;
  }
  throw new Error("Failed to fetch company profile");
};

export const getCompanyProfileById = async (id: number | string): Promise<CompanyProfile> => {
  const response = await apiClient.get<ApiResponse<{ profile: CompanyProfile }>>(
    `/companies/${id}`
  );
  if (response.data.status === 200) {
    return response.data.data.profile;
  }
  throw new Error("Failed to fetch company profile");
};

export interface UpdateCompanyProfileRequest {
  name?: string;
  description?: string;
  logo?: string;
  sector?: string;
  location?: string;
  foundedYear?: number;
  teamMembers?: Array<{
    id?: number;
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
  }>;
  socialMedia?: {
    website?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const updateCompanyProfile = async (
  request: UpdateCompanyProfileRequest
): Promise<CompanyProfile> => {
  const response = await apiClient.put<ApiResponse<{ profile: CompanyProfile }>>(
    "/companies/me/profile",
    request
  );
  if (response.data.status === 200) {
    return response.data.data.profile;
  }
  throw new Error(response.data.message || "Failed to update company profile");
};

export const changeCompanyPassword = async (
  request: ChangePasswordRequest
): Promise<void> => {
  await apiClient.put<ApiResponse<{}>>(
    "/companies/me/change-password",
    request
  );
};

export const uploadCompanyProfileImage = async (
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication required. Please sign in again.');
  }

  const response = await apiClient.post<ApiResponse<{ imageUrl: string }>>(
    "/companies/me/profile-image",
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      timeout: 60000,
    }
  );
  return response.data.data.imageUrl;
};

