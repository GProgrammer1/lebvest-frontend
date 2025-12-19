# LebVest Frontend

A comprehensive investment platform frontend connecting investors with companies and projects in Lebanon. Built with React, TypeScript, and modern web technologies.

## Table of Contents

- [Overview](#overview)
- [User Roles](#user-roles)
- [Key Workflows](#key-workflows)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Payment Processing](#payment-processing)
- [Real-time Features](#real-time-features)

---

## Overview

LebVest is a fintech platform that facilitates investment opportunities in Lebanon. The platform connects three main user types:

- **Investors**: Discover, analyze, and invest in projects across various sectors
- **Companies**: List projects, manage funding campaigns, and track investor engagement
- **Administrators**: Oversee platform operations, verify users, and manage approvals

The platform handles complex workflows including investment state management, payment processing, company verification pipelines, and real-time notifications.

---

## User Roles

### Investor
Investors can browse investment opportunities, manage their portfolio, and make investments through a secure payment flow. They have access to:
- Investment discovery and search
- Portfolio dashboard with performance metrics
- Investment tracking and watchlist
- Investment goals and preferences
- Payout requests and history
- Public profile (optional)

### Company
Companies can list projects, manage their profile, and track funding progress. They must complete a two-step verification process:
- **Step 1**: Initial approval by admin
- **Step 2**: Full verification with legal documents, ownership info, and financial statements

Only fully verified companies can list projects. Companies can:
- Manage company profile and team information
- List and manage investment projects
- Track funding progress and investor engagement
- Submit payout evidence for investor requests
- View financial analytics

### Administrator
Admins have full platform oversight and can:
- View platform analytics and statistics
- Approve/reject company registrations and verifications
- Approve/reject investor signups
- Review and approve project proposals
- Manage payout requests
- Update investor KYC classifications (RETAIL, QUALIFIED, INSTITUTIONAL)
- Monitor user activity in real-time

---

## Key Workflows

### Investment Workflow

1. **Discovery**: Investor browses investments, uses filters (category, risk, location, sector, type, return range), or searches
2. **Details**: View comprehensive investment information including company info, financials, documents, and AI predictions
3. **Investment Process**:
   - Select investment amount (must meet minimum)
   - Acknowledge investment risks
   - Choose payment method (Stripe)
   - Backend creates investment request and payment intent
   - Complete payment via Stripe Elements
   - Receive confirmation
4. **Tracking**: Investment appears in portfolio dashboard with current value and returns

### Company Verification Workflow

1. **Registration**: Company signs up and creates profile
2. **Step 1 Approval**: Admin reviews and approves company registration
   - Status: `APPROVED` (can access dashboard but cannot list projects)
3. **Step 2 Verification**: Company submits verification documents:
   - **Legal Documents**: Certificate of Incorporation, Articles of Association, Tax Registration, Proof of Address
   - **Ownership & Control**: Shareholder structure, UBO IDs, Director IDs, Authorized Signatory IDs, Board Resolution, PEP/Sanctions Declaration
   - **Finance & Banking**: Bank account confirmation, Financial statements (1-3 years), Management accounts, Bank statements (3-6 months), Source of funds declaration
4. **Admin Review**: Admin reviews documents and approves/rejects
   - Status: `FULLY_VERIFIED` (can now list projects)
   - Status: `PENDING_DOCS` (needs more documents)
   - Status: `REJECTED` (verification rejected)

### Project Listing Workflow

1. **Verification Check**: System checks if company is `FULLY_VERIFIED`
2. **Project Creation**: Company fills out project form with:
   - Title, description, category, sector
   - Risk level, expected return, investment type
   - Minimum and target investment amounts
   - Duration, funding stage, deadline
   - Team information, financial projections
   - Supporting documents and images
3. **Submission**: Project submitted for admin review
4. **Admin Approval**: Admin reviews and approves/rejects project
5. **Live**: Approved project appears in investment listings

### Payout Workflow

1. **Investor Request**: Investor requests payout for matured investment
2. **Company Evidence**: Company submits payout evidence documents
3. **Admin Review**: Admin reviews evidence and payout request
4. **Approval**: Admin approves payout
5. **Processing**: Backend processes payout via Stripe
6. **Completion**: Payout completed, investor receives funds

---

## Features

### Investment Discovery
- **Advanced Search**: Full-text search with autocomplete suggestions
- **Multi-criteria Filtering**: Filter by category, risk level, location, sector, investment type, return range, amount range
- **Sorting**: Sort by relevance, date, amount, expected return
- **Pagination**: Efficient pagination for large result sets
- **Investment Details**: Comprehensive view with company info, financials, documents, team, updates, and AI predictions

### Portfolio Management
- **Dashboard**: Overview of portfolio value, total invested, total returns
- **Active Investments**: List of all investments with current values and return percentages
- **Watchlist**: Save investments for later review
- **Investment Goals**: Set and track financial goals with target amounts and deadlines
- **Recommendations**: AI-powered personalized investment recommendations

### Payment Processing
- **Stripe Integration**: Secure payment processing with Stripe Elements
- **Multi-step Flow**: Amount selection → Risk acknowledgment → Payment → Confirmation
- **Payment Intent**: Backend creates payment intent, frontend handles confirmation
- **3D Secure**: Supported for additional security
- **Transaction Tracking**: Full payment history and status tracking

### Real-time Notifications
- **WebSocket Integration**: STOMP over SockJS for real-time delivery
- **Notification Types**: New opportunities, investment updates, threshold alerts, news
- **Notification Management**: Mark as read, filter, manage preferences
- **User Activity**: Real-time user online/offline status (admin view)

### AI Chatbot
- **Google Gemini Integration**: Powered by Gemini API with multiple model fallback
- **Web Search**: Google Search Grounding for current information
- **Conversation History**: Maintains context across conversation
- **Platform Guidance**: Answers questions about LebVest features and usage

### Document Management
- **File Upload**: Secure file uploads for verification documents, project documents, financial statements
- **Document Viewer**: In-app document viewing
- **Document Organization**: Categorized document storage and management

### Analytics & Reporting
- **Investor Analytics**: Portfolio performance, returns, investment history
- **Company Analytics**: Funding progress, investor engagement, project performance
- **Admin Analytics**: Platform-wide statistics, top projects, investment trends, pending approvals

---

## Technology Stack

### Core Framework
- **React 18.3.1**: UI library
- **TypeScript**: Type safety
- **Vite 5.4.1**: Build tool and dev server

### Routing & State Management
- **React Router DOM 6.26.2**: Client-side routing
- **TanStack Query 5.76.1**: Server state management, caching, and data fetching
- **Zustand 5.0.9**: Global client state (authentication, preferences, notifications)

### UI & Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS 3.4.11**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

### Forms & Validation
- **React Hook Form 7.53.0**: Form state management
- **Zod 3.23.8**: Schema validation

### HTTP & Real-time
- **Axios 1.9.0**: HTTP client with interceptors
- **STOMP.js 7.2.1**: STOMP protocol for WebSocket
- **SockJS 1.6.1**: WebSocket fallback support

### Payments
- **Stripe.js 2.4.0**: Stripe payment integration
- **@stripe/react-stripe-js 2.4.0**: React Stripe components

### AI & External Services
- **Google Gemini API**: AI chatbot with web search
- **Recharts 2.12.7**: Data visualization
- **date-fns 3.6.0**: Date manipulation

### Development Tools
- **ESLint**: Code linting
- **TypeScript ESLint**: TypeScript-specific linting
- **React Query Devtools**: Development tools for TanStack Query

---

## Project Structure

```
src/
├── api/                    # API client and endpoint definitions
│   ├── common/
│   │   └── apiClient.ts   # Centralized Axios instance with interceptors
│   ├── admin.ts           # Admin API endpoints
│   ├── company.ts         # Company API endpoints
│   ├── investment.ts      # Investment API endpoints
│   ├── investor.ts        # Investor API endpoints
│   └── payout.ts          # Payout API endpoints
│
├── components/            # React components
│   ├── ui/                # shadcn/ui components (reusable primitives)
│   ├── ChatBot.tsx        # AI chatbot component
│   ├── DashboardPage.tsx  # Investor dashboard
│   ├── InvestmentCard.tsx # Investment card component
│   ├── InvestmentDetail.tsx
│   ├── InvestmentFilters.tsx
│   ├── MultiStepInvestmentModal.tsx  # Investment flow modal
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useInvestmentQueries.ts  # Investment data fetching
│   ├── useInvestorQueries.ts   # Investor data fetching
│   ├── useCompanyQueries.ts     # Company data fetching
│   ├── useAdminQueries.ts      # Admin data fetching
│   ├── usePayoutQueries.ts     # Payout data fetching
│   └── useWebSocket.ts         # WebSocket connection hook
│
├── lib/                   # Utilities and configurations
│   ├── types.ts           # TypeScript type definitions
│   ├── utils.ts           # Utility functions
│   ├── react-query-config.ts  # React Query configuration
│   └── mockData.ts        # Mock data for development
│
├── pages/                 # Page components (routes)
│   ├── Index.tsx          # Landing page
│   ├── SignIn.tsx          # Login page
│   ├── Register.tsx        # Registration page
│   ├── Dashboard.tsx       # Investor dashboard
│   ├── CompanyDashboard.tsx # Company dashboard
│   ├── AdminDashboard.tsx  # Admin dashboard
│   ├── Investments.tsx     # Investment listing
│   ├── InvestmentDetail.tsx
│   ├── CompanyVerification.tsx
│   ├── ListProject.tsx
│   ├── PaymentPage.tsx
│   └── ...
│
├── services/              # External service integrations
│   ├── geminiService.ts   # Google Gemini AI service
│   └── webSearchService.ts
│
├── store/                 # Zustand stores
│   └── useAuthStore.ts    # Authentication state store
│
├── util/                  # Utility functions
│   └── jwtUtil.ts         # JWT token utilities
│
├── App.tsx                # Main app component with routing
└── main.tsx               # Application entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or bun

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd lebvest-frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file**:
```env
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. **Start development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

---

## API Integration

### API Client Architecture

The application uses a centralized API client (`src/api/common/apiClient.ts`) built on Axios:

- **Automatic Authentication**: JWT tokens from localStorage are automatically injected into request headers
- **Request Interceptors**: Handle FormData, set appropriate headers
- **Response Interceptors**: Process responses, handle errors
- **Error Handling**: 
  - 401 Unauthorized → Automatic logout and redirect to sign-in
  - Invalid tokens are removed
  - Consistent error messages
- **Timeout**: 30-second default timeout (configurable per request)

### API Endpoints

The API is organized by domain:

- **Authentication**: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`
- **Investments**: 
  - `GET /investments` - List investments with filters
  - `GET /investments/:id` - Get investment details
  - `POST /investments/:id/invest` - Create investment request
  - `POST /investments/:id/watchlist` - Add to watchlist
  - `DELETE /investments/:id/watchlist` - Remove from watchlist
  - `GET /api/investments/search` - Search investments
- **Investors**: 
  - `GET /investors/me/dashboard` - Investor dashboard
  - `GET /investors/me/profile` - Get profile
  - `PUT /investors/me/profile` - Update profile
  - `GET /investors/me/investments` - Get investments
  - `GET /investors/me/watchlist` - Get watchlist
  - `GET /investors/me/goals` - Get goals
  - `GET /investors/me/notifications` - Get notifications
- **Companies**: 
  - `GET /companies/me/profile` - Get company profile
  - `PUT /companies/me/profile` - Update profile
  - `GET /companies/me/verification` - Get verification status
  - `POST /companies/me/verification` - Submit verification documents
  - `POST /companies/me/projects` - Create project
- **Admin**: 
  - `GET /admin/analytics` - Platform analytics
  - `GET /admin/queues/company-approvals` - Pending company approvals
  - `GET /admin/queues/investor-approvals` - Pending investor approvals
  - `POST /admin/approve-verification/:companyId` - Approve company verification
  - `PUT /admin/investors/:id/kyc` - Update investor KYC
- **Payments**: 
  - `POST /payment/create-payment-intent` - Create Stripe payment intent
- **Payouts**: 
  - `POST /api/investors/me/payouts/request/:investmentId` - Create payout request
  - `GET /api/investors/me/payouts` - Get payout requests
  - `GET /api/companies/me/payouts` - Get company payouts
  - `POST /api/admin/payouts/:id/approve` - Approve payout

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

## Authentication

### Authentication Flow

1. User submits email, password, and role (Investor/Company/Admin) to `/auth/login`
2. Backend validates credentials and returns JWT token and role
3. Frontend stores token in localStorage as `authToken` and role as `role`
4. API client automatically injects `Authorization: Bearer <token>` header in all requests
5. On 401 responses, token is removed and user is redirected to `/signin`

### Role-Based Routing

- **Investor**: Redirected to `/dashboard` after login
- **Company**: Redirected to `/company-dashboard` after login
- **Admin**: Redirected to `/admin-dashboard` after login

### Protected Routes

Routes are protected based on authentication state. Unauthenticated users are redirected to `/signin` with optional redirect parameter.

### Password Management

- **Forgot Password**: User requests password reset via email
- **Reset Password**: User resets password using token from email link
- **Change Password**: Authenticated users can change password with current password verification

---

## Payment Processing

### Stripe Integration Flow

1. **Investment Request Creation**: When investor initiates investment, frontend calls `POST /investments/:id/invest` with amount
2. **Payment Intent**: Backend creates investment request and returns `requestId`
3. **Payment Intent Creation**: Frontend calls `POST /payment/create-payment-intent` with `requestId`
4. **Stripe Elements**: Frontend renders Stripe Elements for secure card input
5. **Payment Confirmation**: User enters card details, Stripe handles 3D Secure if required
6. **Success**: On successful payment, user is redirected to `/payment-success/:requestId`
7. **Backend Processing**: Backend processes payment and records investment

### Payment Security

- **PCI Compliance**: Card details never touch the application server
- **Tokenization**: Stripe handles card tokenization
- **3D Secure**: Supported for additional security
- **Validation**: Amount validation and minimum investment checks on both frontend and backend

---

## Real-time Features

### WebSocket Integration

The application uses WebSocket (STOMP over SockJS) for real-time features:

- **Connection**: Automatic connection with JWT authentication on app load
- **Reconnection**: Exponential backoff reconnection on disconnect (max 5 attempts)
- **Heartbeat**: 30-second intervals to maintain connection and track user activity
- **Topic Subscriptions**: Role-based subscriptions
  - `/topic/user-activity` - Admin user activity monitoring
  - `/topic/notifications` - User notifications
- **Connection Management**: Automatic cleanup on component unmount

### Real-time Notifications

- **Delivery**: Instant notification delivery via WebSocket
- **Types**: New opportunities, investment updates, threshold alerts, news
- **Management**: Mark as read, filter by type, manage preferences
- **Persistence**: Notifications stored in backend, synced on connection

### User Activity Tracking

- **Online Status**: Track user online/offline status via heartbeat
- **Last Seen**: Record last activity timestamp
- **Activity Monitoring**: Admin dashboard shows real-time user activity (online/offline, last seen)

---

## Environment Variables

Required environment variables:

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:8080`)
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (must start with `pk_test_` or `pk_live_`)
- `VITE_GEMINI_API_KEY` - Google Gemini API key (required for chatbot)

Optional:

- `VITE_WS_URL` - WebSocket URL (defaults to API URL + `/ws`)

---

## Error Handling

### Error Boundaries

- **Global Error Boundary**: Wraps entire application in `App.tsx`
- **Route-Level Boundaries**: Additional boundaries for route-level error handling
- **User-Friendly Messages**: Errors displayed with helpful messages and retry options

### API Error Handling

- **401 Unauthorized**: Automatic logout and redirect to sign-in
- **403 Forbidden**: Display permission error message
- **404 Not Found**: Display not found message
- **500 Server Error**: Display server error with retry option
- **Network Errors**: Display network error with retry option

---

## Security Considerations

- **JWT Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
- **XSS Protection**: React's built-in XSS protection
- **Input Validation**: Client-side validation with Zod schemas
- **HTTPS**: Always use HTTPS in production
- **Secrets**: Never commit secrets, use environment variables
- **Rate Limiting**: Backend implements rate limiting on API calls

---

## License

[Add your license information here]
