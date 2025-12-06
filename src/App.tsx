import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/lib/react-query-config";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Investments from "./pages/Investments";
import InvestmentDetail from "./pages/InvestmentDetail";
import Dashboard from "./pages/Dashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InvestorProfile from "./pages/InvestorProfile";
import CompanyProfile from "./pages/CompanyProfile";
import CompareInvestors from "./pages/CompareInvestors";
import ProjectReview from "./pages/ProjectReview";
import AdminUserDetail from "./pages/AdminUserDetail";
import ListProject from "./pages/ListProject";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import CompanyVerification from "./pages/CompanyVerification";
import InvestorSettings from "./pages/InvestorSettings";
import CompanySettings from "./pages/CompanySettings";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ChatBot from "./components/ChatBot";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/investments/:id" element={<InvestmentDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/company-dashboard" element={<CompanyDashboard />} />
              <Route path="/company-verification" element={<CompanyVerification />} />
              <Route path="/company-settings" element={<CompanySettings />} />
              <Route path="/investor-settings" element={<InvestorSettings />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users/:id" element={<AdminUserDetail />} />
              <Route path="/investor-profile/:id" element={<InvestorProfile />} />
              <Route path="/company-profile/:id" element={<CompanyProfile />} />
              <Route path="/compare-investors/:id" element={<CompareInvestors />} />
              <Route path="/project-review/:id" element={<ProjectReview />} />
              <Route path="/list-project" element={<ListProject />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/reset-password/:token" element={<ResetPassword/>}/>
              <Route path="/payment/:requestId" element={<PaymentPage />} />
              <Route path="/payment-success/:requestId" element={<PaymentSuccessPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatBot />
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
