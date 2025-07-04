import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const setupDashboard = async () => {
      try {
        // Simulate processing time for better UX
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Navigate to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Error setting up dashboard:", error);
        // If there's an error, still redirect to dashboard
        navigate("/dashboard");
      }
    };

    setupDashboard();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-fintech-primary via-white to-fintech-primary/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fintech-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fintech-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fintech-primary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="fintech-card border-0 shadow-2xl backdrop-blur-sm bg-white/80">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 fintech-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-fintech-text mb-4">
                Please wait a moment...
              </h2>
              
              <p className="text-gray-600 mb-8">
                We're setting up your personalized dashboard with all your information.
              </p>
              
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-6 h-6 text-fintech-primary animate-spin" />
                <span className="text-fintech-primary font-medium">Processing...</span>
              </div>
              
              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Account created successfully</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Fetching your data</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Preparing dashboard</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Loading; 