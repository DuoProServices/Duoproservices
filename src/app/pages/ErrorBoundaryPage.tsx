import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export function ErrorBoundaryPage() {
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if there's an error in sessionStorage
    const savedError = sessionStorage.getItem("app-error");
    if (savedError) {
      setError(savedError);
    }
  }, []);

  const handleRefresh = () => {
    sessionStorage.removeItem("app-error");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            The page encountered an error. Don't worry, you can try again!
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-red-800 font-mono break-all">
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRefresh} size="lg" className="gap-2">
              <RefreshCw className="w-5 h-5" />
              Refresh Page
            </Button>
            
            <Link to="/">
              <Button variant="outline" size="lg" className="gap-2 w-full">
                <Home className="w-5 h-5" />
                Go to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>If the problem persists, please contact support.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
