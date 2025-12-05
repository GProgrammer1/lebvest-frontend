import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Investments from "./pages/Investments";
import InvestmentDetail from "./pages/InvestmentDetail";
import Dashboard from "./pages/Dashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InvestorProfile from "./pages/InvestorProfile";
import CompareInvestors from "./pages/CompareInvestors";
import ProjectReview from "./pages/ProjectReview";
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
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/investments/:id" element={<InvestmentDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/company-verification" element={<CompanyVerification />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/investor-profile/:id" element={<InvestorProfile />} />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
