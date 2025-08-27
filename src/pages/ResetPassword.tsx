import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { LockKeyhole } from "lucide-react";
import apiClient from "@/api/common/apiClient";

const ResetPassword = () => {
  const { token } = useParams(); // assumes route is /reset-password/:token
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Make sure both fields are identical.",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        password,
      },
    {
        headers: {
            'Content-Type' : 'application/json'
        }
    });

      toast({
        title: "Password updated",
        description: "You can now sign in with your new password.",
        variant: "success",
      });

      setIsReset(true);

      setTimeout(() => navigate("/signin"), 2000);
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.response?.data?.message || "Invalid or expired token.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Reset Password | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-lebanese-navy/10 rounded-full">
                <LockKeyhole className="h-6 w-6 text-lebanese-navy" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-lebanese-navy">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              {!isReset ? "Enter a new password for your account" : "Redirecting you to sign in..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isReset && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
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
                <Button
                  type="submit"
                  className="w-full bg-lebanese-navy hover:bg-opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/signin" className="text-lebanese-navy font-medium hover:text-lebanese-green">
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
