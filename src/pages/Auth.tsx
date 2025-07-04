import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/firebase";
import { signInWithPhoneNumber, ConfirmationResult, User, GoogleAuthProvider, signInWithPopup, signInWithCustomToken } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Phone, KeyRound, LogIn, Mail, Smartphone, Shield, ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    confirmationResult?: ConfirmationResult;
  }
}

const Auth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
      toast({
        title: "Google Authentication",
        description: "Signed in with Google!",
        variant: "default",
      });
      if (isNewUser) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Google Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSendOtp = async () => {
    setError("");
    setIsLoading(true);
    setDevOtp(null);
    // Clean phone number: remove spaces and dashes
    const cleanedPhone = phone.replace(/[\s-]/g, "");
    // Validate Indian phone number format
    const indianPhonePattern = /^\+91[6-9]\d{9}$/;
    if (!indianPhonePattern.test(cleanedPhone)) {
      setError("Please enter a valid Indian phone number (e.g., +919876543210).\nMust start with +91 and a 10-digit number starting with 6-9.");
      setIsLoading(false);
      return;
    }
    try {
      // Call our custom OTP API
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: cleanedPhone }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsOtpSent(true);
        toast({
          title: "OTP Sent",
          description: `An OTP has been sent to ${cleanedPhone}. Check the server console for the code.`,
        });
        if (data.otp) {
          setDevOtp(data.otp);
        }
      } else {
        setError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (err: any) {
      setError("Failed to send OTP. Please check if the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setIsLoading(true);
    try {
      // Call our custom OTP verification API
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phone.replace(/[\s-]/g, ""), otp: otp }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Sign in to Firebase using the custom token
        try {
          await signInWithCustomToken(auth, data.user.customToken);
          
          // If user is new, they need to go through onboarding
          if (data.user.isNewUser) {
            toast({
              title: "Success!",
              description: "Phone verified! Please complete your profile.",
              variant: "default",
            });
            navigate("/onboarding");
          } else {
            // For existing users, redirect to dashboard
            toast({
              title: "Success!",
              description: "You have been signed in successfully.",
              variant: "default",
            });
            navigate("/dashboard");
          }
        } catch (firebaseError: any) {
          console.error('Firebase authentication error:', firebaseError);
          setError("Authentication failed. Please try again.");
        }
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError("Failed to verify OTP. Please check if the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-fintech-primary hover:text-fintech-primary/80 mb-6 transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 fintech-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold text-fintech-text">SecurePay</span>
                <p className="text-sm text-gray-500 -mt-1">Secure • Fast • Trusted</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-fintech-text mb-2 bg-gradient-to-r from-fintech-primary to-fintech-secondary bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600">Choose your preferred authentication method</p>
          </div>
          <Card className="glass-card fintech-card border-0 shadow-2xl backdrop-blur-sm bg-white/80">
            <CardHeader className="text-center pb-6 relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-fintech-primary via-fintech-secondary to-fintech-primary rounded-t-xl"></div>
              <CardTitle className="text-fintech-text text-xl">Sign In</CardTitle>
              <CardDescription className="text-gray-500">
                Secure access to your financial dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="google" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-50 p-1 rounded-lg">
                  <TabsTrigger value="google" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Mail className="w-4 h-4" />
                    <span>Google</span>
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Smartphone className="w-4 h-4" />
                    <span>Phone</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="google">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      Sign in securely with your Google account.
                    </p>
                    <Button onClick={handleGoogleAuth} disabled={isLoading} className="w-full bold-cta">
                      {isLoading ? "Signing in..." : "Sign In with Google"}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="phone">
                  <div className="space-y-4">
                    {!isOtpSent ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={e => setPhone(e.target.value)}
                              placeholder="Enter your number with country code"
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Enter a valid Indian phone number to receive an OTP.
                          </p>
                        </div>
                        <Button onClick={handleSendOtp} disabled={isLoading || !phone} className="w-full bold-cta">
                          {isLoading ? "Sending..." : "Send OTP"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="otp">Enter OTP</Label>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="otp"
                              type="text"
                              value={otp}
                              onChange={e => setOtp(e.target.value)}
                              placeholder="6-digit code"
                              maxLength={6}
                              className="pl-10 tracking-widest"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        <Button onClick={handleVerifyOtp} disabled={isLoading || !otp} className="w-full bold-cta">
                          <LogIn className="mr-2 h-4 w-4" />
                          {isLoading ? "Verifying..." : "Verify & Sign In"}
                        </Button>
                        <Button variant="link" onClick={() => setIsOtpSent(false)} className="w-full">
                          Change phone number
                        </Button>
                      </>
                    )}
                    {error && <p className="text-sm font-medium text-red-500 text-center">{error}</p>}
                    {devOtp && (
                      <div className="text-xs text-green-600 text-center mt-2">
                        <strong>Demo OTP:</strong> {devOtp}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">New to SecurePay?</span>
                </div>
              </div>
              <div className="text-center">
                <Link 
                  to="/onboarding" 
                  className="inline-flex items-center space-x-2 text-fintech-primary hover:text-fintech-primary/80 font-medium transition-colors group"
                >
                  <span>Create an account</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="#" className="text-fintech-primary hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-fintech-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
