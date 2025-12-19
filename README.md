# LebVest Frontend

**LebVest** is a comprehensive investment platform designed specifically for the Lebanese market, connecting investors with companies and projects seeking funding. The platform facilitates investment opportunities across various sectors including Real Estate, Technology, Healthcare, Agriculture, and more.

## 📋 Table of Contents

- [Overview](#overview)
- [User Roles & Features](#user-roles--features)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Integration](#api-integration)
- [Authentication & Authorization](#authentication--authorization)
- [Payment Processing](#payment-processing)
- [Real-time Features](#real-time-features)
- [AI Chatbot](#ai-chatbot)
- [Development Guide](#development-guide)
- [Available Scripts](#available-scripts)

---

## 🎯 Overview

LebVest is a full-featured investment platform that enables:

- **Investors** to discover, analyze, and invest in Lebanese opportunities
- **Companies** to list projects, manage funding, and track investor engagement
- **Administrators** to oversee platform operations, verify users, and manage approvals

The platform includes sophisticated features like AI-powered investment predictions, real-time notifications, secure payment processing via Stripe, and an intelligent chatbot assistant.

---

## 👥 User Roles & Features

### 🔵 Investor Role

Investors can access a comprehensive investment management system:

#### Investment Discovery
- **Browse Investments**: View all available investment opportunities with detailed information
- **Advanced Filtering**: Filter by:
  - Category (Real Estate, Government Bonds, Startup, Personal Project, SME, Agriculture, Technology, Education, Healthcare, Energy, Tourism, Retail)
  - Risk Level (Low, Medium, High)
  - Location (Beirut, Mount Lebanon, North, South, Bekaa, Nabatieh, Baalbek Hermel, Akkar)
  - Sector (Technology, Healthcare, Finance, Real Estate, Consumer, Energy, Industrial, Agriculture, Education, Tourism, Retail, Other)
  - Investment Type (Equity, Debt, Crowdfunding)
  - Expected Return Range
  - Minimum/Maximum Investment Amount
- **Search Functionality**: Full-text search with autocomplete suggestions
- **Investment Details**: View comprehensive information including:
  - Company information and team members
  - Financial statements and projections
  - Risk assessments and AI predictions
  - Expected returns and duration
  - Project documents and updates
  - Funding progress and investor count

#### Portfolio Management
- **Dashboard**: Comprehensive overview showing:
  - Portfolio value and total invested
  - Total returns and performance metrics
  - Active investments with current values
  - Watchlist items
  - Investment goals and progress
  - Personalized recommendations
- **Investment Tracking**: Monitor all investments with:
  - Investment amount and date
  - Current value calculations
  - Return percentages
  - Investment status
- **Watchlist**: Save investments for later review
- **Investment Goals**: Set and track financial goals with:
  - Target amounts
  - Current progress
  - Deadline tracking

#### Investment Process
- **Multi-Step Investment Flow**:
  1. **Amount Selection**: Choose investment amount (must meet minimum)
  2. **Risk Acknowledgment**: Review and acknowledge investment risks
  3. **Payment Processing**: Secure payment via Stripe integration
  4. **Confirmation**: Receive confirmation and investment details
- **Payment Integration**: Secure Stripe checkout with:
  - Credit/debit card processing
  - Payment intent creation
  - Transaction tracking
  - Payment success/failure handling

#### Profile & Settings
- **Public Profile**: Optional public profile for other users to view
- **Profile Management**: Update name, email, bio, profile image
- **Investment Preferences**: Configure preferred:
  - Categories
  - Risk levels
  - Locations
- **Notifications**: Manage notification preferences and view notification history
- **Password Management**: Change password securely

#### Payout Management
- **Payout Requests**: Request payouts for matured investments
- **Payout History**: View complete payout history with:
  - Principal amounts
  - Return amounts
  - Total payouts
  - Transaction IDs
  - Completion dates

#### Social Features
- **Investor Comparison**: Compare profiles and performance with other investors
- **Public Profiles**: View other investors' public profiles

### 🏢 Company Role

Companies can manage their presence and fundraising on the platform:

#### Company Profile
- **Profile Management**: Create and maintain company profile with:
  - Company name, description, and logo
  - Sector and location
  - Founded year
  - Team members with roles and bios
  - Social media links (website, LinkedIn, Facebook, Twitter, Instagram)
- **Financial Information**: Upload and manage:
  - Annual financial statements (revenue, expenses, profit)
  - Management accounts
  - Bank statements

#### Project Management
- **List Projects**: Create investment opportunities with:
  - Project title and description
  - Category and sector classification
  - Risk level assessment
  - Expected return percentage
  - Minimum and target investment amounts
  - Investment duration
  - Funding stage
  - Project images
  - Team information
  - Financial projections
  - Supporting documents
- **Project Review**: Submit projects for admin review and approval
- **Funding Tracking**: Monitor:
  - Total raised amount
  - Funding progress percentage
  - Number of investors
  - Time remaining until deadline

#### Verification Process
- **Company Verification**: Submit comprehensive verification documents:
  - **Legal Documents**:
    - Certificate of Incorporation
    - Articles of Association
    - Tax Registration Certificate
    - Proof of Registered Address
  - **Ownership & Control**:
    - Shareholder structure
    - UBO (Ultimate Beneficial Owner) identification
    - Director identification
    - Authorized signatory identification
    - Board resolution
    - PEP/Sanctions declaration
  - **Finance & Banking**:
    - Bank account confirmation
    - Financial statements (1-3 years)
    - Management accounts
    - Bank statements (3-6 months)
    - Source of funds declaration
- **Verification Status**: Track verification status (PENDING, APPROVED, PENDING_DOCS, FULLY_VERIFIED, REJECTED)

#### Payout Management
- **Payout Requests**: View and manage payout requests from investors
- **Evidence Submission**: Submit payout evidence documents
- **Payout Tracking**: Monitor payout request status and history

#### Settings
- **Profile Settings**: Update company information
- **Password Management**: Change password
- **Profile Image**: Upload and update company logo

### 🛡️ Admin Role

Administrators have comprehensive platform oversight:

#### Dashboard & Analytics
- **Platform Statistics**:
  - Total investors, companies, and investments
  - Daily and monthly investment volumes
  - Top performing projects
  - Investments by category and risk level
- **Pending Approvals**:
  - Company signup requests
  - Investor signup requests
  - Project proposals
  - Verification requests
- **Payout Management**:
  - Pending payout requests
  - Pending returns
  - Payout approval workflow

#### User Management
- **User Overview**: View all platform users
- **User Details**: Comprehensive user profiles with:
  - Personal information
  - Investment history
  - KYC status and classification
  - Activity logs
- **KYC Management**: Update investor KYC classification:
  - RETAIL
  - QUALIFIED
  - INSTITUTIONAL
- **Approval Workflow**: Approve or reject:
  - Company registrations
  - Investor registrations
  - Project proposals
  - Verification requests

#### Notification Management
- **Admin Notifications**: Receive and manage:
  - Signup requests
  - Project proposals
  - Verification requests
  - Application statistics updates
- **Notification Actions**: Accept or reject requests with notes

#### Real-time Monitoring
- **User Activity**: Monitor user online/offline status via WebSocket
- **Live Updates**: Real-time updates on platform activity

---

## ✨ Key Features

### 🔍 Investment Discovery & Search

- **Advanced Search**: Full-text search across investment titles, descriptions, and company names
- **Search Suggestions**: Autocomplete suggestions for better search experience
- **Smart Filtering**: Multi-criteria filtering with real-time results
- **Sorting Options**: Sort by relevance, date, amount, return, etc.
- **Pagination**: Efficient pagination for large result sets

### 🤖 AI-Powered Features

- **Investment Predictions**: AI-generated profit predictions and risk assessments
- **Confidence Scores**: AI confidence ratings for predictions
- **Personalized Recommendations**: AI-driven investment recommendations based on user preferences
- **Chatbot Assistant**: Intelligent chatbot powered by Google Gemini with:
  - Platform information and guidance
  - Investment advice and explanations
  - Web search integration for current events
  - Context-aware conversations

### 💳 Payment Processing

- **Stripe Integration**: Secure payment processing with:
  - Payment intents
  - Card validation
  - 3D Secure support
  - Payment confirmation
  - Transaction history
- **Multi-Step Payment Flow**: Guided payment process with risk acknowledgment
- **Payment Tracking**: Real-time payment status updates

### 🔔 Real-time Notifications

- **WebSocket Integration**: Real-time notification delivery
- **Notification Types**:
  - New investment opportunities
  - Investment updates
  - Threshold alerts
  - News and announcements
- **Notification Management**: Mark as read, filter, and manage preferences

### 📊 Analytics & Reporting

- **Investor Analytics**: Portfolio performance, returns, and investment history
- **Company Analytics**: Funding progress, investor engagement, project performance
- **Admin Analytics**: Platform-wide statistics and trends

### 📄 Document Management

- **Document Upload**: Secure file uploads for:
  - Company verification documents
  - Project documents
  - Financial statements
  - Payout evidence
- **Document Viewing**: In-app document viewer
- **Document Organization**: Categorized document storage

### 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different access levels for Investors, Companies, and Admins
- **Password Management**: Secure password reset and change functionality
- **Session Management**: Automatic session handling and token refresh
- **API Security**: Secure API communication with authentication headers

---

## 🏗️ Technical Architecture

### Frontend Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **Routing**: React Router DOM 6.26.2
- **State Management**:
  - **Zustand 5.0.9**: Global state management (authentication, preferences, notifications)
  - **TanStack Query 5.76.1**: Server state management and data fetching
- **UI Framework**: 
  - **shadcn/ui**: Component library built on Radix UI primitives
  - **Tailwind CSS 3.4.11**: Utility-first CSS framework
- **Form Management**: 
  - **React Hook Form 7.53.0**: Form state management
  - **Zod 3.23.8**: Schema validation
- **HTTP Client**: Axios 1.9.0
- **Real-time Communication**: 
  - **STOMP.js 7.2.1**: STOMP protocol over WebSocket
  - **SockJS 1.6.1**: WebSocket fallback support
- **Payment Processing**: 
  - **Stripe.js 2.4.0**: Stripe payment integration
  - **@stripe/react-stripe-js 2.4.0**: React Stripe components
- **Charts & Visualization**: Recharts 2.12.7
- **Date Handling**: date-fns 3.6.0
- **Icons**: Lucide React 0.462.0
- **Notifications**: Sonner 1.7.4 (Toast notifications)

### Backend Integration

- **API Base URL**: Configurable via environment variables
- **API Client**: Centralized Axios instance with:
  - Automatic authentication header injection
  - Request/response interceptors
  - Error handling
  - Timeout configuration
- **WebSocket Endpoint**: STOMP over SockJS for real-time features

### AI Integration

- **Google Gemini API**: 
  - Multiple model support (gemini-2.5-flash, gemini-1.5-flash, gemini-pro)
  - Web search grounding for current information
  - Conversation history management
  - Error handling and fallback

---

## 📁 Project Structure

```
lebvest-frontend/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── api/                   # API client and endpoint definitions
│   │   ├── common/
│   │   │   └── apiClient.ts   # Centralized Axios instance with interceptors
│   │   ├── admin.ts           # Admin API endpoints
│   │   ├── company.ts         # Company API endpoints
│   │   ├── investment.ts      # Investment API endpoints
│   │   ├── investor.ts        # Investor API endpoints
│   │   └── payout.ts          # Payout API endpoints
│   │
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components (reusable UI primitives)
│   │   ├── ChatBot.tsx        # AI chatbot component
│   │   ├── ChatDialogContent.tsx
│   │   ├── DashboardPage.tsx # Investor dashboard
│   │   ├── ErrorBoundary.tsx  # Error boundary component
│   │   ├── FileUploadWithPreview.tsx
│   │   ├── Footer.tsx
│   │   ├── Icons.tsx
│   │   ├── InvestmentCard.tsx
│   │   ├── InvestmentDetail.tsx
│   │   ├── InvestmentFilters.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── MultiStepInvestmentModal.tsx # Investment flow
│   │   ├── Navbar.tsx
│   │   ├── PayoutHistory.tsx
│   │   ├── ProjectForm.tsx
│   │   └── ViewDocumentsDialog.tsx
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx     # Mobile detection hook
│   │   ├── use-toast.ts       # Toast notification hook
│   │   ├── useAdminQueries.ts # Admin data fetching hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useCompanyQueries.ts
│   │   ├── useInvestmentQueries.ts
│   │   ├── useInvestorQueries.ts
│   │   ├── usePayoutQueries.ts
│   │   └── useWebSocket.ts    # WebSocket connection hook
│   │
│   ├── lib/                   # Utilities and configurations
│   │   ├── mockData.ts        # Mock data for development
│   │   ├── react-query-config.ts # React Query configuration
│   │   ├── types.ts           # TypeScript type definitions
│   │   └── utils.ts           # Utility functions
│   │
│   ├── pages/                 # Page components (routes)
│   │   ├── About.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminUserDetail.tsx
│   │   ├── CompanyDashboard.tsx
│   │   ├── CompanyProfile.tsx
│   │   ├── CompanySettings.tsx
│   │   ├── CompanyVerification.tsx
│   │   ├── CompareInvestors.tsx
│   │   ├── Dashboard.tsx      # Investor dashboard page
│   │   ├── FAQ.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Index.tsx          # Landing page
│   │   ├── InvestmentDetail.tsx
│   │   ├── Investments.tsx    # Investment listing page
│   │   ├── InvestorProfile.tsx
│   │   ├── InvestorSettings.tsx
│   │   ├── ListProject.tsx
│   │   ├── NotFound.tsx
│   │   ├── orders.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── PaymentSuccessPage.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── ProjectReview.tsx
│   │   ├── Register.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── SignIn.tsx
│   │   └── TermsOfService.tsx
│   │
│   ├── services/              # External service integrations
│   │   ├── geminiService.ts   # Google Gemini AI service
│   │   └── webSearchService.ts
│   │
│   ├── store/                 # Zustand stores
│   │   └── useAuthStore.ts    # Authentication state store
│   │
│   ├── util/                  # Utility functions
│   │   └── jwtUtil.ts         # JWT token utilities
│   │
│   ├── App.tsx                # Main app component with routing
│   ├── App.css
│   ├── index.css              # Global styles
│   └── main.tsx               # Application entry point
│
├── .gitignore
├── components.json            # shadcn/ui configuration
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── README.md                  # This file
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts             # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm** or **yarn** or **bun**: Package manager
- **Git**: Version control

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd lebvest-frontend
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
bun install
```

3. **Configure environment variables** (see [Environment Configuration](#environment-configuration))

4. **Start the development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified in `vite.config.ts`).

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:8080
# or
REACT_APP_API_URL=http://localhost:8080

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# WebSocket Configuration (optional, defaults to API URL)
VITE_WS_URL=ws://localhost:8080/ws

# Gemini AI Configuration (for chatbot)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Environment Variable Notes

- The API client uses `REACT_APP_API_URL` as the primary base URL, with a fallback to `http://localhost:8080`
- Stripe publishable key must start with `pk_test_` or `pk_live_`
- WebSocket URL is constructed from the API URL if not explicitly set
- Gemini API key is required for the chatbot feature to work

---

## 🔌 API Integration

### API Client Architecture

The application uses a centralized API client (`src/api/common/apiClient.ts`) that:

- **Automatic Authentication**: Injects JWT tokens from localStorage into request headers
- **Request Interceptors**: Handles FormData and sets appropriate headers
- **Response Interceptors**: Processes responses and handles errors
- **Error Handling**: 
  - Automatically redirects to login on 401 Unauthorized
  - Removes invalid tokens
  - Provides consistent error messages
- **Timeout Configuration**: 30-second default timeout (configurable per request)

### API Endpoints Structure

The API is organized by domain:

- **Authentication**: `/auth/login`, `/auth/register`, `/auth/forgot-password`, etc.
- **Investments**: `/investments`, `/investments/:id`, `/investments/:id/invest`, etc.
- **Investors**: `/investors/me/*` (dashboard, profile, investments, watchlist, goals, notifications)
- **Companies**: `/companies/me/*` (profile, verification, projects, payouts)
- **Admin**: `/admin/*` (analytics, user management, approvals, payouts)
- **Payouts**: `/api/investors/me/payouts/*`, `/api/companies/me/payouts/*`, `/api/admin/payouts/*`

### Response Format

All API responses follow a consistent format:

```typescript
{
  status: number;
  message: string;
  data: T;
  timestamp: string;
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login**: User submits email, password, and role (Investor/Company/Admin)
2. **Token Storage**: JWT token stored in localStorage as `authToken`
3. **Role Storage**: User role stored in localStorage as `role`
4. **Automatic Header Injection**: API client automatically adds `Authorization: Bearer <token>` to requests
5. **Session Management**: Token validated on each request; 401 responses trigger logout

### Role-Based Routing

- **Investor**: Redirected to `/dashboard` after login
- **Company**: Redirected to `/company-dashboard` after login
- **Admin**: Redirected to `/admin-dashboard` after login

### Protected Routes

Routes are protected based on authentication state and role. Unauthenticated users are redirected to `/signin`.

### Password Management

- **Forgot Password**: Email-based password reset with token
- **Reset Password**: Token-validated password reset
- **Change Password**: Authenticated password change with current password verification

---

## 💳 Payment Processing

### Stripe Integration

The application integrates Stripe for secure payment processing:

1. **Payment Intent Creation**: Backend creates a payment intent for the investment amount
2. **Stripe Elements**: Frontend uses Stripe Elements for secure card input
3. **Payment Confirmation**: Stripe handles 3D Secure and payment confirmation
4. **Success Handling**: Redirect to success page with payment confirmation

### Payment Flow

1. User selects investment amount
2. User acknowledges risks
3. Payment modal opens with Stripe Elements
4. User enters card details
5. Payment intent is confirmed
6. User is redirected to success page
7. Investment is recorded in the system

### Payment Security

- **PCI Compliance**: Card details never touch the application server
- **Tokenization**: Stripe handles card tokenization
- **3D Secure**: Supported for additional security
- **Payment Validation**: Amount validation and minimum investment checks

---

## 🔔 Real-time Features

### WebSocket Integration

The application uses WebSocket (STOMP over SockJS) for real-time features:

- **Connection Management**: Automatic connection with JWT authentication
- **Reconnection Logic**: Exponential backoff reconnection on disconnect
- **Heartbeat**: Periodic heartbeat to maintain connection and track user activity
- **Topic Subscriptions**: Role-based topic subscriptions (e.g., `/topic/user-activity` for admins)

### Real-time Notifications

- **Delivery**: Instant notification delivery via WebSocket
- **Types**: New opportunities, updates, thresholds, news
- **Management**: Mark as read, filter, and notification preferences

### User Activity Tracking

- **Online Status**: Track user online/offline status
- **Last Seen**: Record last activity timestamp
- **Activity Monitoring**: Admin dashboard shows real-time user activity

---

## 🤖 AI Chatbot

### Gemini Integration

The chatbot is powered by Google Gemini API with the following features:

- **Model Support**: Multiple model fallback (gemini-2.5-flash → gemini-1.5-flash → gemini-pro)
- **Web Search**: Google Search Grounding for current information
- **Conversation History**: Maintains context across conversation
- **Error Handling**: Graceful error handling with user-friendly messages

### Chatbot Capabilities

- **Platform Information**: Answers questions about LebVest features and usage
- **Investment Guidance**: Provides general investment information
- **Current Events**: Uses web search for up-to-date information
- **Context Awareness**: Maintains conversation context

### Configuration

Set `VITE_GEMINI_API_KEY` in your `.env` file to enable the chatbot.

---

## 💻 Development Guide

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with React hooks and refresh plugins
- **Prettier**: Recommended for code formatting (not enforced)

### Component Development

- **shadcn/ui Components**: Use components from `src/components/ui/` for consistency
- **TypeScript**: All components should be typed
- **Error Boundaries**: Wrap components in error boundaries where appropriate
- **Loading States**: Always handle loading and error states

### State Management

- **Server State**: Use TanStack Query for all server data
- **Client State**: Use Zustand for global client state (auth, preferences)
- **Local State**: Use React `useState` for component-local state

### API Integration

- **Custom Hooks**: Create custom hooks in `hooks/` directory for API calls
- **Query Keys**: Use consistent query key structure for cache management
- **Mutations**: Use mutations for create/update/delete operations
- **Optimistic Updates**: Implement optimistic updates where appropriate

### Testing

- **Component Testing**: Test components in isolation
- **Integration Testing**: Test user flows end-to-end
- **API Mocking**: Mock API responses for testing

---

## 📜 Available Scripts

### Development

```bash
npm run dev
```
Starts the development server with hot module replacement at `http://localhost:3000`.

### Production Build

```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

```bash
npm run build:dev
```
Creates a development build (unoptimized, with source maps).

### Preview

```bash
npm run preview
```
Previews the production build locally.

### Linting

```bash
npm run lint
```
Runs ESLint to check for code quality issues.

---

## 🔧 Configuration Files

### Vite Configuration (`vite.config.ts`)

- **Port**: 3000 (configurable)
- **Host**: `::` (all interfaces)
- **Path Aliases**: `@/` maps to `src/`
- **Plugins**: React SWC, Lovable Tagger (development only)

### TypeScript Configuration

- **Strict Mode**: Enabled
- **Path Aliases**: Configured for `@/` imports
- **Module Resolution**: Node16
- **Target**: ES2020

### Tailwind Configuration

- **Content**: Scans `src/` directory for class usage
- **Theme**: Custom theme with Lebanese color scheme
- **Plugins**: Typography plugin for rich text

---

## 🚨 Error Handling

### Error Boundaries

The application uses React Error Boundaries to catch and handle errors gracefully:

- **Global Error Boundary**: Wraps the entire application
- **Route-Level Boundaries**: Additional boundaries for route-level error handling
- **User-Friendly Messages**: Errors are displayed with helpful messages and retry options

### API Error Handling

- **401 Unauthorized**: Automatic logout and redirect to sign-in
- **403 Forbidden**: Display permission error
- **404 Not Found**: Display not found message
- **500 Server Error**: Display server error with retry option
- **Network Errors**: Display network error with retry option

---

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured experience
- **Tablet**: Optimized layouts
- **Mobile**: Mobile-first design with touch-friendly interactions

### Mobile Detection

The `use-mobile` hook detects mobile devices and adjusts UI accordingly.

---

## 🔒 Security Considerations

### Client-Side Security

- **Token Storage**: JWT tokens stored in localStorage (consider httpOnly cookies for production)
- **XSS Protection**: React's built-in XSS protection
- **Input Validation**: Client-side validation with Zod schemas
- **HTTPS**: Always use HTTPS in production

### Best Practices

- **Never commit secrets**: Use environment variables
- **Validate inputs**: Both client and server-side validation
- **Sanitize outputs**: Prevent XSS attacks
- **Rate limiting**: Implement rate limiting on API calls
- **CSP Headers**: Use Content Security Policy headers

---

## 📚 Additional Resources

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)

### Support

For issues, questions, or contributions, please refer to the project's issue tracker or contact the development team.

---

## 📄 License

[Add your license information here]

---

## 👥 Contributors

[Add contributor information here]

---

**Built with ❤️ for the Lebanese investment community**
