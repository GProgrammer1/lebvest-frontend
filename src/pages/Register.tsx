import { Ref, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, BuildingIcon, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import {
  Location as EnumLocation,
  InvestmentCategory,
  ResponsePayload,
  RiskLevel,
} from "@/lib/types";
import apiClient from "@/api/common/apiClient";
// Types for form data
type UserRole = "investor" | "company" | "admin";

type InvestorFormData = {
  investmentCategories: InvestmentCategory[];
  riskLevels: RiskLevel[];
  bio: string;
  locations: EnumLocation[];
};

type CompanyFormData = {
  companyName: string;
  description: string;
  sector: string;
  // teamSize: string;
  location: string;
  foundedYear: number;
};

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("investor");
  const [companyFiles, setCompanyFiles] = useState<Record<string, File | null>>(
    {}
  );

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Role-specific form data
  const [investorData, setInvestorData] = useState<InvestorFormData>({
    investmentCategories: [],
    riskLevels: [],
    bio: "",
    locations: [],
  });

  const [companyData, setCompanyData] = useState<CompanyFormData>({
    companyName: "",
    description: "",
    sector: "Technology",
    foundedYear: new Date().getFullYear(),
    location: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
  const getStrengthLabel = () => {
    const passed = Object.values(passwordStrength).filter(Boolean).length;
    if (passed <= 2) return { label: "Weak", color: "bg-red-500" };
    if (passed === 3 || passed === 4)
      return { label: "Medium", color: "bg-yellow-500" };
    return { label: "Strong", color: "bg-green-500" };
  };
  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const renderPasswordRequirements = () => {
    const strength = getStrengthLabel();
    return (
      <div className="mt-3">
        <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200 mb-2">
          <div
            className={`h-full ${strength.color}`}
            style={{
              width: `${
                (Object.values(passwordStrength).filter(Boolean).length / 5) *
                100
              }%`,
            }}
          ></div>
        </div>
        <p
          className={`text-sm font-medium ${strength.color.replace(
            "bg-",
            "text-"
          )}`}
        >
          {strength.label} password
        </p>

        <div className="mt-4 border rounded-xl p-4 bg-white shadow-md space-y-2">
          <ul className="list-disc pl-5">
            <li
              className={
                passwordStrength.length ? "text-green-600" : "text-red-600"
              }
            >
              At least 8 characters
            </li>
            <li
              className={
                passwordStrength.uppercase ? "text-green-600" : "text-red-600"
              }
            >
              Contains an uppercase letter
            </li>
            <li
              className={
                passwordStrength.lowercase ? "text-green-600" : "text-red-600"
              }
            >
              Contains a lowercase letter
            </li>
            <li
              className={
                passwordStrength.number ? "text-green-600" : "text-red-600"
              }
            >
              Contains a number
            </li>
            <li
              className={
                passwordStrength.specialChar ? "text-green-600" : "text-red-600"
              }
            >
              Contains a special character
            </li>
          </ul>
        </div>
      </div>
    );
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      toast({
        title: "Weak Password",
        description: "Please make sure your password meets all requirements.",
        variant: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "error",
      });
      return;
    }

    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    if (role === "company" && currentStep === 2) {
      setCurrentStep(3);
      return;
    }
    setIsLoading(true);

    try {
      // Mock registration - would be replaced with real registration
      // Redirect based on user role
      console.log("Company data is: ", companyData);

      switch (role) {
        case "investor":
          let response = await handleInvestorSignup();
          console.log("Investor registration response:", response);
          if (response && response.status === 201) {
            const { token } = response.data;
            console.log(
              "Token received:",
              token ? "Token present" : "Token missing"
            );
            if (token) {
              localStorage.setItem("jwt", token);
              localStorage.setItem("authToken", token);
              localStorage.setItem("role", "Investor");
              console.log("Token saved to localStorage");
              toast({
                title: "Success!",
                description: "Your account has been created.",
                variant: "success",
              });
            } else {
              console.error("No token in response data");
              toast({
                title: "Registration Error",
                description: "Token not received. Please try again.",
                variant: "error",
              });
            }
          } else {
            console.error("Registration failed:", response);
            toast({
              title: "Registration Failed",
              description:
                response?.message || "An error occurred during registration",
              variant: "error",
            });
          }
          navigate("/dashboard");
          break;
        case "company":
          let companyResponse = await handleCompanySignup();
          console.log("Company res: ", companyResponse);

          if (companyResponse && companyResponse.status === 201) {
            const { token } = companyResponse.data;
            localStorage.setItem("jwt", token);
            localStorage.setItem("authToken", token);
            localStorage.setItem("role", "Company");
            toast({
              title: "Success!",
              description:
                "Your company account has been created successfully!",
              variant: "success",
            });
            navigate("/company-dashboard");
          }
          break;

        default:
          navigate("/dashboard");
      }
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleriskLevelsChange = (level: RiskLevel) => {
    setInvestorData((prev) => ({
      ...prev,
      riskLevels: prev.riskLevels.includes(level)
        ? prev.riskLevels.filter((l) => l !== level)
        : [...prev.riskLevels, level],
    }));
  };

  const handleInvestmentCategorysChange = (sector: InvestmentCategory) => {
    setInvestorData((prev) => ({
      ...prev,
      investmentCategories: prev.investmentCategories.includes(sector)
        ? prev.investmentCategories.filter((s) => s !== sector)
        : [...prev.investmentCategories, sector],
    }));
  };

  const handleInvestmentLocationChange = (location: EnumLocation) => {
    if (investorData.locations.includes(location)) {
      setInvestorData({
        ...investorData,
        locations: investorData.locations.filter((l) => l !== location),
      });
    } else {
      setInvestorData({
        ...investorData,
        locations: [...investorData.locations, location],
      });
    }
  };

  const handleInvestorSignup = async () => {
    try {
      const axiosResponse = await apiClient.post<ResponsePayload>(
        "/auth/investor/register",
        { ...investorData, email, name: fullName, password }
      );
      const response: ResponsePayload = axiosResponse.data;
      console.log("Response of investor signup: ", response);

      return response;
    } catch (err) {
      console.error("Error signinp up as an investor: ", err.message);
    }
  };

  const handleCompanySignup = async () => {
    try {
      const formData = new FormData();

      formData.append("companyName", companyData.companyName);
      formData.append("description", companyData.description);
      formData.append("sector", companyData.sector.toUpperCase());
      // formData.append("teamSize", companyData.teamSize);
      formData.append("foundedYear", String(companyData.foundedYear));
      formData.append("location", companyData.location);
      formData.append("email", email);
      formData.append("name", fullName);
      formData.append("password", password);

      console.log(
        "Company data entries for formdata: ",
        formData.get("sector")
      );

      // Append files
      Object.entries(companyFiles).forEach(([field, file]) => {
        if (file) {
          formData.append("documents", file); // backend should receive it as a Multipart[] or List<Multipart>
        }
      });
      console.log("Company files are: ", companyFiles);

      const axiosResponse = await apiClient.post<ResponsePayload>(
        "/auth/company/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const response: ResponsePayload = axiosResponse.data;
      console.log("Response of company signup: ", response);
      return response;
    } catch (err: any) {
      console.error("Error signing up company: ", err.status);
      if (err.status === 409) {
        toast({
          title: "Company already registered",
          description: err.response?.data?.message,
          variant: "error",
        });
      } else {
        toast({
          title: "Registration failed",
          description:
            err.response?.data?.message ||
            "An error occurred during registration",
          variant: "error",
        });
      }
      throw err; // Re-throw to prevent navigation on error
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
        {renderPasswordRequirements()}
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
        <RadioGroup
          value={role}
          onValueChange={(value) => setRole(value as UserRole)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
            <RadioGroupItem value="investor" id="investor" />
            <Label
              htmlFor="investor"
              className="flex items-center cursor-pointer"
            >
              <UserPlus className="h-4 w-4 mr-2 text-lebanese-navy" />
              Investor
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
            <RadioGroupItem value="company" id="company" />
            <Label
              htmlFor="company"
              className="flex items-center cursor-pointer"
            >
              <BuildingIcon className="h-4 w-4 mr-2 text-lebanese-navy" />
              Company
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
          {[
            "Technology",
            "Real Estate",
            "Government Bonds",
            "Startup",
            "Personal Project",
            "Sme",
            "Agriculture",
            "Education",
            "Healthcare",
            "Energy",
            "Tourism",
            "Retail",
          ].map((preference) => (
            <div key={preference} className="flex items-center space-x-2">
              <Checkbox
                id={`preference-${preference}`}
                checked={investorData.investmentCategories.includes(
                  preference as InvestmentCategory
                )}
                onCheckedChange={() =>
                  handleInvestmentCategorysChange(
                    preference as InvestmentCategory
                  )
                }
              />
              <label
                htmlFor={`preference-${preference}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
              >
                {preference.replace(/_/g, " ")}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Location Preferences (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Beirut",
            "Mount Lebanon",
            "North",
            "South",
            "Bekaa",
            "Nabatieh",
            "Baalbek Hermel",
            "Akkar",
          ].map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={investorData.locations.includes(
                  location as EnumLocation
                )}
                onCheckedChange={() =>
                  handleInvestmentLocationChange(location as EnumLocation)
                }
              />
              <label
                htmlFor={`location-${location}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
              >
                {location.replace("_", " ")}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Label>Risk Tolerance (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "Low", label: "Low - Conservative" },
            { value: "Medium", label: "Medium - Balanced" },
            { value: "High", label: "High - Aggressive" },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`risk-${value}`}
                checked={investorData.riskLevels.includes(value as RiskLevel)}
                onCheckedChange={() =>
                  handleriskLevelsChange(value as RiskLevel)
                }
              />
              <label
                htmlFor={`risk-${value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          placeholder="Tell people about yourself..."
          value={investorData.bio}
          onChange={(e) =>
            setInvestorData({ ...investorData, bio: e.target.value })
          }
        />
      </div>
    </>
  );

  // In your Register component:
  // Step 2: basic profile fields
  const renderCompanyStep1 = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          placeholder="Your Company LLC"
          value={companyData.companyName}
          onChange={(e) =>
            setCompanyData({ ...companyData, companyName: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Company Description</Label>
        <Input
          id="description"
          placeholder="Brief description of your company..."
          value={companyData.description}
          onChange={(e) =>
            setCompanyData({ ...companyData, description: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industrySector">Industry Sector</Label>
        <Select
          value={companyData.sector}
          onValueChange={(value) => {
            setCompanyData({ ...companyData, sector: value });
            console.log("Company :", companyData);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select industry sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Real Estate">Real Estate</SelectItem>
            <SelectItem value="Agriculture">Agriculture</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Tourism">Tourism</SelectItem>

            {/* <SelectItem value="RETAIL">RETAIL</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Real_Estate">Real Estate</SelectItem>
            <SelectItem value="Agriculture">Agriculture</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Tourism">Tourism</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="foundedYear">Founded Year</Label>
        <Select
          value={String(companyData.foundedYear)}
          onValueChange={(value) =>
            setCompanyData({ ...companyData, foundedYear: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select founded year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: new Date().getFullYear() - 1800 + 1 },
              (_, i) => 1800 + i
            ).map((year, idx) => (
              <SelectItem value={String(year)} key={idx}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Company location</Label>
        <Input
          id="location"
          placeholder="Location of your company"
          value={companyData.location}
          onChange={(e) =>
            setCompanyData({ ...companyData, location: e.target.value })
          }
          required
        />
      </div>
    </>
  );
  // Step 3: document uploads
  const renderCompanyStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Upload Company Documents</h3>
      <p className="text-sm text-gray-500">
        Please upload each required file for admin verification.
      </p>

      {[
        {
          id: "doc-incorporation",
          label: "Certificate of Incorporation",
          accept: ".pdf,.jpg,.png",
        },
        {
          id: "doc-bylaws",
          label: "Articles of Association (Bylaws)",
          accept: ".pdf,.jpg,.png",
        },
        {
          id: "doc-tax",
          label: "Tax Identification Certificate",
          accept: ".pdf,.jpg,.png",
        },
        {
          id: "doc-address",
          label: "Proof of Address",
          accept: ".pdf,.jpg,.png",
        },
        {
          id: "doc-rep-id",
          label: "Representative Photo ID",
          accept: ".pdf,.jpg,.png",
        },
        {
          id: "doc-financials",
          label: "Recent Financial Statement",
          accept: ".pdf,.xls,.xlsx,.csv",
        },
        {
          id: "doc-pitch",
          label: "Pitch Deck (optional)",
          accept: ".pdf,.ppt,.pptx",
        },
        {
          id: "logo",
          label: "Company Logo (optional)",
          accept: ".pdf,.jpg,.png,.svg",
        },
      ].map(({ id, label, accept }) => (
        <div
          key={id}
          className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center"
        >
          <Label htmlFor={id} className="block mb-2 text-sm font-medium">
            {label}
          </Label>

          <input
            id={id}
            type="file"
            accept={accept}
            className="sr-only"
            key={id}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setCompanyFiles((prev) => ({ ...prev, [id]: file }));
            }}
          />
          <button
            type="button"
            className="text-lebanese-navy hover:underline font-medium"
            onClick={() => document.getElementById(id)?.click()}
          >
            {companyFiles[id] ? "Change file" : "Select file"}
          </button>

          {companyFiles[id] ? (
            <div className="mt-2 flex items-center justify-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>{companyFiles[id]?.name}</span>
            </div>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              Accepted: {accept.replace(/,/g, ", ")}
            </p>
          )}
        </div>
      ))}

      <div className="flex items-start">
        <input
          id="companyTerms"
          type="checkbox"
          className="h-4 w-4 border-gray-300 rounded text-lebanese-navy focus:ring-lebanese-green"
          required
        />
        <label htmlFor="companyTerms" className="ml-3 text-sm">
          I agree to the{" "}
          <a href="/terms-of-service" className="underline text-lebanese-navy">
            terms of service
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="underline text-lebanese-navy">
            privacy policy
          </a>
          .
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <>
      {role === "investor" && renderInvestorForm()}
      {role === "company" && currentStep === 2 && renderCompanyStep1()}
      {role === "company" && currentStep === 3 && renderCompanyStep2()}

      {role !== "company" && (
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link
              to="/terms-of-service"
              className="text-lebanese-navy hover:text-lebanese-green"
            >
              terms of service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy-policy"
              className="text-lebanese-navy hover:text-lebanese-green"
            >
              privacy policy
            </Link>
          </label>
        </div>
      )}
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>
          {currentStep === 1
            ? "Create Account"
            : `${
                role.charAt(0).toUpperCase() + role.slice(1)
              } Registration`}{" "}
          | LebVest
        </title>
      </Helmet>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-lebanese-navy">
              {currentStep === 1
                ? "Create an account"
                : `Complete your ${role} profile`}
            </CardTitle>
            <CardDescription className="text-center">
              {currentStep === 1
                ? "Enter your information below to create your account"
                : `Please provide the following ${role}-specific information`}
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
                  : currentStep === 1 ||
                    (role === "company" && currentStep === 2)
                  ? "Continue"
                  : "Register"}
              </Button>

              {(currentStep === 2 || currentStep === 3) && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  Back
                </Button>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-lebanese-navy font-medium hover:text-lebanese-green"
              >
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
