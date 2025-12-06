
export type InvestmentCategory =
  | 'Real Estate'
  | 'Government Bonds'
  | 'Startup'
  | 'Personal Project'
  | 'Sme'
  | 'Agriculture'
  | 'Technology'
  | 'Education'
  | 'Healthcare'
  | 'Energy'
  | 'Tourism'
  | 'Retail';


export type Role = 'Investor' | 'Admin' | 'Company';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export type InvestmentType = 'Equity' | 'Debt' | 'Crowdfunding';

export type InvestmentSector =
  | 'Technology'
  | 'Healthcare'
  | 'Finance'
  | 'Real Estate'
  | 'Consumer'
  | 'Energy'
  | 'Industrial'
  | 'Agriculture'
  | 'Education'
  | 'Tourism'
  | 'Retail'
  | 'Other';


export type Location =
  | 'Beirut'
  | 'Mount Lebanon'
  | 'North'
  | 'South'
  | 'Bekaa'
  | 'Nabatieh'
  | 'Baalbek Hermel'
  | 'Akkar';


export interface Investment {
  id: string;
  title: string;
  companyName: string;
  description: string;
  category: InvestmentCategory;
  riskLevel: RiskLevel;
  expectedReturn: number; // percentage
  minInvestment: number; // in USD
  targetAmount: number; // in USD
  raisedAmount: number; // in USD
  location: Location;
  sector: InvestmentSector;
  investmentType: InvestmentType;
  duration: number; // in months
  imageUrl: string;
  highlights: string[];
  aiPrediction: {
    profitPrediction: number; // percentage
    riskAssessment: string;
    confidenceScore: number; // 0-100
  };
  fundingStage: string;
  deadline: string; // ISO date string
  createdAt: string; // ISO date string
  team: {
    name: string;
    role: string;
    bio: string;
    imageUrl?: string;
  }[];
  financials: {
    revenue: number;
    expenses: number;
    profit: number;
    year: number;
  }[];
  documents: {
    title: string;
    type: string;
    url: string;
  }[];
  updates: {
    date: string;
    title: string;
    content: string;
  }[];
}

export interface InvestorProfile {
  id: string;
  name: string;
  email: string;
  portfolioValue: number;
  totalInvested: number;
  totalReturns: number;
  investmentPreferences: {
    categories: InvestmentCategory[];
    riskLevels: RiskLevel[];
    sectors: InvestmentSector[];
    locations: Location[];
  };
  investments: {
    investmentId: string;
    amount: number;
    date: string;
    currentValue: number;
  }[];
  watchlist: string[]; // Investment IDs
  notifications: {
    id: string;
    type: 'new_opportunity' | 'update' | 'threshold' | 'news';
    title: string;
    message: string;
    date: string;
    read: boolean;
    relatedInvestmentId?: string;
  }[];
  goals: {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
  }[];
}

export interface FilterOptions {
  category?: InvestmentCategory;
  riskLevel?: RiskLevel;
  minReturn?: number;
  location?: Location;
  sector?: InvestmentSector;
  investmentType?: InvestmentType;
  minAmount?: number;
  maxAmount?: number;
}

export interface AdminNotification {
  type: AdminNotificationType;
  id: number;
  message: string;
  createdAt: Date | string;
  adminId: number;
  isRead: boolean;
  isAccepted: Boolean | null;
  title: string;
  reqId?: number;
  companyId?: number;
  documentUrls?: string[];
}

export type AdminNotificationType =
  | "SIGNUP_REQUEST"
  | "PROJECT_PROPOSAL"
  | "VERIFICATION_REQUEST"
  | "APP_STAT_UPDATE"


export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  description: string;
  founded: string; // year
  location: Location;
  sector: InvestmentSector;
  team: {
    name: string;
    role: string;
    bio: string;
    imageUrl?: string;
  }[];
  investments: Investment[];
  documents: {
    title: string;
    type: string;
    url: string;
  }[];
  financials: {
    revenue: number;
    expenses: number;
    profit: number;
    year: number;
  }[];
  socialMedia: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  investors: {
    investorId: string;
    amount: number;
    date: string;
  }[];
  fundingHistory: {
    round: string;
    amount: number;
    date: string;
    investors: string[];
  }[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface InvestmentSummary {
  id: number;
  title: string;
  companyName: string;
  category: string;
  riskLevel: string;
  expectedReturn: number;
  minInvestment: number;
  targetAmount: number;
  raisedAmount: number;
  location: string;
  investmentType: string;
  durationMonths: number;
  imageUrl?: string | null;
  fundingStage?: string | null;
  deadline: string;
  createdAt: string;
}

export interface InvestorInvestmentSummary {
  id: number;
  amount: number;
  currentValue: number;
  investedAt: string;
  investment: InvestmentSummary;
}

export interface InvestorNotificationSummary {
  id: number;
  type: "new_opportunity" | "update" | "threshold" | "news" | string | null;
  title: string;
  message: string;
  notifiedAt: string;
  read: boolean;
  relatedInvestmentId?: number | null;
}

export interface InvestorGoalSummary {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface InvestorPreferencesSummary {
  categories: string[];
  riskLevels: string[];
  locations: string[];
}

export interface InvestorSummary {
  id: number;
  name: string;
  email: string;
  portfolioValue: number;
  totalInvested: number;
  totalReturns: number;
  preferences: InvestorPreferencesSummary;
}

export interface InvestorDashboard {
  investor: InvestorSummary;
  investments: InvestorInvestmentSummary[];
  watchlist: InvestmentSummary[];
  notifications: InvestorNotificationSummary[];
  goals: InvestorGoalSummary[];
  recommendations: InvestmentSummary[];
}

export interface ResponsePayload {
  status: number;
  message: string;
  data: { [key: string]: any }
  timestamp: Date;
}

export interface ErrorPayload {
  path: string;
  status: number;
  message: string;
  timestamp: Date;
}
