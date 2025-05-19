
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, BuildingIcon, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

// Types for form data
type UserRole = "investor" | "company" | "admin";

type InvestorFormData = {
  investmentPreferences: string[];
  riskTolerance: string;
  portfolioGoals: string;
};

type CompanyFormData = {
  companyName: string;
  description: string;
  industrySector: string;
  teamSize: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("investor");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Role-specific form data
  const [investorData, setInvestorData] = useState<InvestorFormData>({
    investmentPreferences: [],
    riskTolerance: "medium",
    portfolioGoals: ""
  });
  
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    companyName: "",
    description: "",
    industrySector: "technology",
    teamSize: "1-10"
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    
    setIsLoading(true);

    try {
      // Mock registration - would be replaced with real registration
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success!",
        description: "Your account has been created.",
      });

      // Redirect based on user role
      switch(role) {
        case "investor": 
          navigate("/dashboard");
          break;
        case "company":
          navigate("/company-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/dashboard");
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvestmentPreferenceChange = (preference: string) => {
    if (investorData.investmentPreferences.includes(preference)) {
      setInvestorData({
        ...investorData,
        investmentPreferences: investorData.investmentPreferences.filter(p => p !== preference)
      });
    } else {
      setInvestorData({
        ...investorData,
        investmentPreferences: [...investorData.investmentPreferences, preference]
      });
    }
  };

  const renderStep1 = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName" 
          placeholder="John Doe" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="name@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          placeholder="••••••••" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-3">
        <Label>I am registering as</Label>
        <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
            <RadioGroupItem value="investor" id="investor" />
            <Label htmlFor="investor" className="flex items-center cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2 text-lebanese-navy" />
              Investor
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
            <RadioGroupItem value="company" id="company" />
            <Label htmlFor="company" className="flex items-center cursor-pointer">
              <BuildingIcon className="h-4 w-4 mr-2 text-lebanese-navy" />
              Company
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
            <RadioGroupItem value="admin" id="admin" />
            <Label htmlFor="admin" className="flex items-center cursor-pointer">
              <ShieldCheck className="h-4 w-4 mr-2 text-lebanese-navy" />
              Admin
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );

  const renderInvestorForm = () => (
    <>
      <div className="space-y-3">
        <Label>Investment Preferences (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2">
          {["real_estate", "government_bonds", "startup", "personal_project", "agriculture", "technology"].map((preference) => (
            <div key={preference} className="flex items-center space-x-2">
              <Checkbox 
                id={`preference-${preference}`} 
                checked={investorData.investmentPreferences.includes(preference)}
                onCheckedChange={() => handleInvestmentPreferenceChange(preference)}
              />
              <label
                htmlFor={`preference-${preference}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
              >
                {preference.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="riskTolerance">Risk Tolerance</Label>
        <Select 
          value={investorData.riskTolerance} 
          onValueChange={(value) => setInvestorData({...investorData, riskTolerance: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select risk tolerance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - Conservative</SelectItem>
            <SelectItem value="medium">Medium - Balanced</SelectItem>
            <SelectItem value="high">High - Aggressive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="portfolioGoals">Portfolio Goals</Label>
        <Input 
          id="portfolioGoals" 
          placeholder="Describe your investment goals..." 
          value={investorData.portfolioGoals}
          onChange={(e) => setInvestorData({...investorData, portfolioGoals: e.target.value})}
        />
      </div>
    </>
  );

  const renderCompanyForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input 
          id="companyName" 
          placeholder="Your Company LLC" 
          value={companyData.companyName}
          onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Company Description</Label>
        <Input 
          id="description" 
          placeholder="Brief description of your company..." 
          value={companyData.description}
          onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industrySector">Industry Sector</Label>
        <Select 
          value={companyData.industrySector} 
          onValueChange={(value) => setCompanyData({...companyData, industrySector: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select industry sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="real_estate">Real Estate</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="tourism">Tourism</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamSize">Team Size</Label>
        <Select 
          value={companyData.teamSize} 
          onValueChange={(value) => setCompanyData({...companyData, teamSize: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select team size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1-10 employees</SelectItem>
            <SelectItem value="11-50">11-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="201+">201+ employees</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderAdminForm = () => (
    <div className="text-center py-4">
      <ShieldCheck className="h-16 w-16 mx-auto text-lebanese-navy mb-4" />
      <p className="text-gray-600 mb-2">Admin registration requires approval.</p>
      <p className="text-gray-600">After submission, an administrator will review your application.</p>
    </div>
  );

  const renderStep2 = () => (
    <>
      {role === "investor" && renderInvestorForm()}
      {role === "company" && renderCompanyForm()}
      {role === "admin" && renderAdminForm()}
      
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" required />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{" "}
          <Link to="/terms-of-service" className="text-lebanese-navy hover:text-lebanese-green">
            terms of service
          </Link>{" "}
          and{" "}
          <Link to="/privacy-policy" className="text-lebanese-navy hover:text-lebanese-green">
            privacy policy
          </Link>
        </label>
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{currentStep === 1 ? "Create Account" : `${role.charAt(0).toUpperCase() + role.slice(1)} Registration`} | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-lebanese-navy">
              {currentStep === 1 ? "Create an account" : `Complete your ${role} profile`}
            </CardTitle>
            <CardDescription className="text-center">
              {currentStep === 1 
                ? "Enter your information below to create your account" 
                : `Please provide the following ${role}-specific information`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 1 ? renderStep1() : renderStep2()}
              
              <Button 
                type="submit" 
                className="w-full bg-lebanese-navy hover:bg-opacity-90"
                disabled={isLoading}
              >
                {isLoading 
                  ? "Creating account..." 
                  : currentStep === 1 
                    ? "Continue" 
                    : "Register"
                }
              </Button>
              
              {currentStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="text-lebanese-navy font-medium hover:text-lebanese-green">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
