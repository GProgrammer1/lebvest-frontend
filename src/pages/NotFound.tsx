import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <Card className="bg-card text-card-foreground shadow-lg rounded-2xl p-8 max-w-md w-full text-center animate-fade-in-up">
        <h1 className="text-6xl font-extrabold text-lebanese-red mb-3">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Button
          asChild
          className="bg-lebanese-navy hover:bg-lebanese-navy/90 text-white"
        >
          <a href="/">Return to Home</a>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
