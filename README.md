# LebVest Frontend

A modern investment platform frontend connecting investors with companies and projects in Lebanon. Built with React, TypeScript, and Vite.

## Overview

LebVest is a comprehensive investment platform that enables:
- **Investors** to discover, analyze, and invest in Lebanese opportunities
- **Companies** to list projects, manage funding, and track investor engagement
- **Administrators** to oversee platform operations, verify users, and manage approvals

## Features

- **Investment Discovery**: Browse, search, and filter investments by category, risk level, location, sector, and type
- **Portfolio Management**: Track investments, portfolio value, returns, and set investment goals
- **Payment Processing**: Secure Stripe integration for investment payments
- **Real-time Notifications**: WebSocket-based notifications for updates and alerts
- **AI Chatbot**: Intelligent assistant powered by Google Gemini
- **Document Management**: Upload and view company verification documents and project files
- **Multi-role Support**: Separate dashboards and workflows for Investors, Companies, and Admins

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for routing
- **TanStack Query** for server state management
- **Zustand** for client state
- **shadcn/ui** + Tailwind CSS for UI
- **Stripe** for payments
- **STOMP.js** over SockJS for WebSocket
- **Google Gemini API** for chatbot

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lebvest-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and types
├── pages/           # Page components
├── services/        # External service integrations
└── store/           # Zustand stores
```

## Environment Variables

- `VITE_API_URL` - Backend API base URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_GEMINI_API_KEY` - Google Gemini API key (for chatbot)

## License

[Add your license information here]
