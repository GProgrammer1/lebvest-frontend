import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, Building2Icon, ShieldIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiClient from "@/api/common/apiClient";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Investor");
  const { toast } = useToast();

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Selected role: ", selectedRole);

      const response: any = await apiClient.post("/auth/login", {
        email,
        password,
        role: selectedRole,
      });

      if (response?.status === 200 && response.data?.status === 200) {
        const token = response.data?.data?.token;
        const role = response.data?.data?.role; // Get role from backend response

        // Store token and role in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("role", role);

        toast({
          title: "Success!",
          description: `You have been signed in as ${role.toLowerCase()}.`,
          variant: "success",
        });

        // Redirect based on role from backend response (not UI selection)
        let redirectPath = "/dashboard"; // default

        if (role === "Investor") {
          redirectPath = "/dashboard";
        } else if (role === "Company") {
          // Check company status and redirect accordingly
          try {
            const profileResponse = await apiClient.get("/companies/me/profile");
            const companyStatus = profileResponse.data?.data?.profile?.status;
            if (companyStatus === "APPROVED") {
              // Company approved but needs step 2 verification
              redirectPath = "/company-verification";
            } else {
              redirectPath = "/company-dashboard";
            }
          } catch (error) {
            // If profile fetch fails, go to dashboard anyway
            redirectPath = "/company-dashboard";
          }
        } else if (role === "Admin") {
          redirectPath = "/admin-dashboard";
        }

        navigate(redirectPath);
      } else {
        toast({
          title: "Error!",
          description:
            response.data?.message ||
            "You have entered wrong credentials. Please try again.",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Error",

        description: "Failed to sign in. Please check your credentials.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-lebanese-navy">
              Sign in to LebVest
            </CardTitle>
            <CardDescription className="text-center">
              Select your role below to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="investor"
              onValueChange={setSelectedRole}
              className="w-full mb-6"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger
                  value="Investor"
                  className="flex flex-col items-center py-3"
                >
                  <UserIcon className="mb-1 h-5 w-5" />
                  <span>Investor</span>
                </TabsTrigger>
                <TabsTrigger
                  value="Company"
                  className="flex flex-col items-center py-3"
                >
                  <Building2Icon className="mb-1 h-5 w-5" />
                  <span>Company</span>
                </TabsTrigger>
                <TabsTrigger
                  value="Admin"
                  className="flex flex-col items-center py-3"
                >
                  <ShieldIcon className="mb-1 h-5 w-5" />
                  <span>Admin</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-lebanese-navy hover:text-lebanese-green"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-lebanese-navy hover:bg-opacity-90"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Signing in..."
                    : `Sign In as ${
                        selectedRole.charAt(0).toUpperCase() +
                        selectedRole.slice(1)
                      }`}
                </Button>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-lebanese-navy font-medium hover:text-lebanese-green"
              >
                Register now
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
