# LebVest Frontend

**LebVest** is a comprehensive investment platform designed specifically for the Lebanese market, connecting investors with companies and projects seeking funding.

## Why This Project Matters (Backend Perspective)

LebVest is a fintech platform with complex backend workflows including:
- Investment state machines
- Payment consistency and idempotency
- Role-based authorization
- Approval and verification pipelines
- Real-time notification delivery
- Payout lifecycle management

The frontend is designed to reflect and enforce these backend invariants.

## Backend Interaction Highlights

- **Stateless JWT authentication** aligned with Spring Security
- **Optimistic UI updates** coordinated with transactional backend APIs
- **Stripe payment intent lifecycle** mapped to backend investment states
- **SSE/WebSocket notifications** reflecting backend domain events
- **Strict role-based access** mirrored from backend authorization rules

---

## 🎯 Overview

LebVest enables **Investors** to discover and invest in opportunities, **Companies** to list projects and manage funding, and **Administrators** to oversee platform operations. Features include AI-powered predictions, real-time notifications, Stripe payment processing, and an intelligent chatbot.

---

## 👥 User Roles & Features

### 🔵 Investor
- **Investment Discovery**: Browse, search, and filter investments by category, risk, location, sector, and type
- **Portfolio Management**: Dashboard with portfolio value, returns, active investments, watchlist, and goals
- **Investment Flow**: Multi-step process (amount selection → risk acknowledgment → Stripe payment → confirmation)
- **Profile & Settings**: Public profile, preferences, notifications, password management
- **Payout Management**: Request payouts and view payout history

### 🏢 Company
- **Profile Management**: Company profile with team, financials, and social media links
- **Project Management**: List projects, submit for review, track funding progress
- **Verification**: Submit legal documents, ownership info, and financial statements for KYC
- **Payout Management**: View and manage investor payout requests, submit evidence

### 🛡️ Admin
- **Analytics Dashboard**: Platform statistics, top projects, investment trends, pending approvals
- **User Management**: View users, update KYC classifications (RETAIL/QUALIFIED/INSTITUTIONAL), manage approvals
- **Approval Workflows**: Approve/reject company registrations, investor signups, project proposals, verification requests
- **Real-time Monitoring**: User activity tracking via WebSocket

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 18.3.1 + TypeScript
- **Build**: Vite 5.4.1
- **Routing**: React Router DOM 6.26.2
- **State**: Zustand (global) + TanStack Query (server state)
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **HTTP**: Axios with centralized interceptors
- **Real-time**: STOMP.js over SockJS
- **Payments**: Stripe.js + React Stripe
- **AI**: Google Gemini API (chatbot)

### Backend Integration
- **API Client**: Centralized Axios instance with JWT injection, interceptors, error handling
- **WebSocket**: STOMP over SockJS for real-time notifications and user activity
- **Response Format**: Consistent `{status, message, data, timestamp}` structure

---

## 📁 Project Structure

```
src/
├── api/              # API endpoints (admin, company, investment, investor, payout)
│   └── common/       # Centralized Axios client with interceptors
├── components/       # React components
│   └── ui/          # shadcn/ui primitives
├── hooks/           # Custom hooks (queries, WebSocket, auth)
├── lib/             # Types, utils, React Query config
├── pages/           # Route components (Dashboard, Investments, Admin, etc.)
├── services/        # External services (Gemini AI)
├── store/           # Zustand stores (auth)
└── util/            # JWT utilities
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/bun

### Installation
```bash
git clone <repository-url>
cd lebvest-frontend
npm install
```

### Environment Variables
Create `.env`:
```env
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GEMINI_API_KEY=your_key_here
```

### Run
```bash
npm run dev  # Development server at http://localhost:3000
npm run build  # Production build
npm run lint  # ESLint
```

---

## 🔌 API Integration

### API Client Architecture
Centralized Axios instance (`src/api/common/apiClient.ts`):
- Automatic JWT token injection from localStorage
- Request/response interceptors
- 401 handling (auto-logout)
- FormData support
- 30s default timeout

### Endpoint Structure
- **Auth**: `/auth/login`, `/auth/register`, `/auth/forgot-password`
- **Investments**: `/investments`, `/investments/:id/invest`
- **Investors**: `/investors/me/*` (dashboard, profile, investments, watchlist, goals, notifications)
- **Companies**: `/companies/me/*` (profile, verification, projects, payouts)
- **Admin**: `/admin/*` (analytics, user management, approvals, payouts)

---

## 🔐 Authentication & Authorization

- **JWT-based**: Stateless authentication with token in localStorage
- **Role-based routing**: Investor → `/dashboard`, Company → `/company-dashboard`, Admin → `/admin-dashboard`
- **Protected routes**: Automatic redirect to `/signin` if unauthenticated
- **Password management**: Forgot/reset/change password flows

---

## 💳 Payment Processing

### Stripe Integration Flow
1. Backend creates payment intent for investment amount
2. Frontend renders Stripe Elements for card input
3. Payment confirmation with 3D Secure support
4. Redirect to success page
5. Investment recorded in backend

**Security**: PCI-compliant, card details never touch application server, tokenization handled by Stripe.

---

## 🔔 Real-time Features

### WebSocket (STOMP over SockJS)
- **Connection**: Automatic with JWT authentication
- **Reconnection**: Exponential backoff on disconnect
- **Heartbeat**: 30s intervals to maintain connection
- **Topics**: Role-based subscriptions (e.g., `/topic/user-activity` for admins)

### Notifications
- Real-time delivery via WebSocket
- Types: new opportunities, updates, thresholds, news
- Mark as read, filter, preferences

---

## 🤖 AI Chatbot

Powered by Google Gemini API:
- Multiple model fallback (gemini-2.5-flash → gemini-1.5-flash → gemini-pro)
- Web search grounding for current information
- Conversation history management
- Context-aware responses

---

## 💻 Development Guide

### Code Style
- TypeScript strict mode
- ESLint with React hooks rules
- shadcn/ui components for consistency

### State Management
- **Server state**: TanStack Query with consistent query keys
- **Client state**: Zustand for auth/preferences
- **Local state**: React `useState`

### API Integration
- Custom hooks in `hooks/` directory
- Mutations for create/update/delete
- Optimistic updates where appropriate

---

## 🚨 Error Handling

- **Error Boundaries**: Global and route-level boundaries
- **API Errors**: 401 → auto-logout, 403 → permission error, 500 → retry option
- **User-friendly messages**: Helpful error messages with retry options

---

## 🔒 Security Considerations

- JWT tokens in localStorage (consider httpOnly cookies for production)
- React XSS protection
- Client-side validation with Zod
- HTTPS required in production
- Never commit secrets (use environment variables)

---

## 📚 Additional Resources

- [React](https://react.dev/) | [TypeScript](https://www.typescriptlang.org/) | [Vite](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/latest) | [shadcn/ui](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/docs) | [Gemini API](https://ai.google.dev/docs)

---

**Built with ❤️ for the Lebanese investment community**
