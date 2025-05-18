
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { LockKeyhole } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock password reset - would be replaced with real reset flow
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      toast({
        title: "Reset email sent",
        description: "If an account exists with that email, we've sent a password reset link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Forgot Password | LebVest</title>
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
            <CardTitle className="text-2xl font-bold text-center text-lebanese-navy">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              {!isSubmitted ? "Enter your email to receive a password reset link" : "Check your email for reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
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
                <Button 
                  type="submit" 
                  className="w-full bg-lebanese-navy hover:bg-opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <p>We've sent a password reset link to <strong>{email}</strong> if an account exists with this email.</p>
                <p>Please check your inbox and spam folder.</p>
              </div>
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

export default ForgotPassword;
