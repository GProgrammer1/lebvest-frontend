# LebVest Frontend

A modern investment platform frontend connecting investors with companies and projects in Lebanon. LebVest provides a comprehensive platform for investment opportunities, portfolio management, and real-time updates.

## 🚀 Features

### For Investors
- Browse and filter investment opportunities across multiple categories
- View detailed investment information with AI-powered predictions
- Manage investment portfolio and track returns
- Set investment goals and preferences
- Real-time notifications for new opportunities and updates
- Compare investor profiles and performance
- Secure payment processing via Stripe
- Interactive chatbot for assistance

### For Companies
- List and manage investment projects
- Company verification and profile management
- Track funding progress and investor engagement
- Upload and manage project documents
- Financial reporting and analytics

### For Administrators
- User management and verification
- Project proposal review and approval
- System statistics and monitoring
- Notification management

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Payments**: Stripe
- **Real-time**: WebSocket (STOMP over SockJS)
- **Charts**: Recharts
- **Notifications**: Sonner (Toast notifications)

## 📋 Prerequisites

- Node.js 18+ and npm (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd lebvest-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── api/              # API client and endpoint definitions
│   ├── admin.ts
│   ├── company.ts
│   ├── investment.ts
│   ├── investor.ts
│   ├── payout.ts
│   └── common/
│       └── apiClient.ts
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   └── ...           # Feature components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configurations
├── pages/            # Page components
├── services/         # External service integrations
├── store/            # Zustand stores
└── util/             # Utility functions
```

## 🔑 Key Features Implementation

### Authentication
- JWT-based authentication
- Role-based access control (Investor, Company, Admin)
- Password reset functionality

### Investment Management
- Multi-step investment modal
- Investment filtering and search
- Document viewing and management
- AI-powered investment predictions

### Real-time Updates
- WebSocket integration for live notifications
- Real-time investment updates

### Payment Processing
- Stripe integration for secure payments
- Payment success tracking

## 🌐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=your_api_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
VITE_WS_URL=your_websocket_url
```

## 🧪 Development

### Code Style
- ESLint is configured for code quality
- TypeScript for type safety
- Follow React best practices and hooks patterns

### Component Development
- Use shadcn/ui components from `src/components/ui/`
- Follow the existing component structure
- Implement proper error boundaries

## 📝 License

[Add your license information here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Contact

[Add contact information here]
