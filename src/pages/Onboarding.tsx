import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Shield, ArrowLeft, User, Phone, CreditCard, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { rtdb } from "@/firebase";
import { ref as rtdbRef, set } from "firebase/database";
import { getAuth } from "firebase/auth";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    panNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    occupation: "",
    annualIncome: "",
    preferredCurrency: "INR",
    accountType: "personal",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/;
    return phoneRegex.test(phone);
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!validatePhone(formData.phone)) newErrors.phone = "Invalid phone number";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.occupation.trim()) newErrors.occupation = "Occupation is required";
      if (!formData.annualIncome.trim()) newErrors.annualIncome = "Annual income is required";
    }

    if (step === 2) {
      if (!formData.panNumber.trim()) newErrors.panNumber = "PAN number is required";
      else if (!validatePAN(formData.panNumber.toUpperCase())) {
        newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
      }
    }

    if (step === 3) {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        // Write personal info to RTDB
        await set(rtdbRef(rtdb, `users/${user.uid}/personalInfo`), {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          panNumber: formData.panNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          occupation: formData.occupation,
          annualIncome: formData.annualIncome,
          preferredCurrency: formData.preferredCurrency,
          accountType: formData.accountType,
        });
      }
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to SecurePay. Setting up your dashboard...",
          variant: "default",
        });
        navigate("/loading");
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save your info. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const stepIcons = [User, CreditCard, MapPin];
  const CurrentIcon = stepIcons[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-fintech-primary via-white to-fintech-primary/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fintech-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fintech-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Header */}
          <div className="text-center mb-6">
            <Link to="/auth" className="inline-flex items-center text-fintech-primary hover:text-fintech-primary/80 mb-6 transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Sign In
            </Link>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 fintech-gradient rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-fintech-text">SecurePay</span>
            </div>
            <h1 className="text-2xl font-bold text-fintech-text mb-2">Create Your Account</h1>
            <p className="text-gray-600 text-sm">Step {currentStep} of {totalSteps}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span className={currentStep >= 1 ? "text-fintech-primary font-medium" : ""}>Personal Info</span>
              <span className={currentStep >= 2 ? "text-fintech-primary font-medium" : ""}>Verification</span>
              <span className={currentStep >= 3 ? "text-fintech-primary font-medium" : ""}>Address</span>
            </div>
          </div>

          <Card className="glass-card fintech-card border-0 shadow-2xl backdrop-blur-sm bg-white/80">
            <CardHeader className="text-center pb-4 relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-fintech-primary via-fintech-secondary to-fintech-primary rounded-t-xl"></div>
              <div className="w-12 h-12 bg-fintech-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CurrentIcon className="w-6 h-6 text-fintech-primary" />
              </div>
              <CardTitle className="text-fintech-text">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Identity Verification"}
                {currentStep === 3 && "Address Details"}
              </CardTitle>
              <CardDescription className="text-gray-500">
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "Verify your identity with PAN"}
                {currentStep === 3 && "Complete your profile"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 animate-fade-in">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        className={`fintech-input ${errors.firstName ? "border-red-500" : ""}`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        className={`fintech-input ${errors.lastName ? "border-red-500" : ""}`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className={`fintech-input ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className={`fintech-input ${errors.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      placeholder="Date of Birth"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                      className={`fintech-input ${errors.dateOfBirth ? "border-red-500" : ""}`}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        placeholder="Occupation"
                        value={formData.occupation}
                        onChange={(e) => updateFormData("occupation", e.target.value)}
                        className={`fintech-input ${errors.occupation ? "border-red-500" : ""}`}
                      />
                      {errors.occupation && <p className="text-red-500 text-xs">{errors.occupation}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualIncome">Annual Income</Label>
                      <Input
                        id="annualIncome"
                        placeholder="Annual Income"
                        value={formData.annualIncome}
                        onChange={(e) => updateFormData("annualIncome", e.target.value)}
                        className={`fintech-input ${errors.annualIncome ? "border-red-500" : ""}`}
                      />
                      {errors.annualIncome && <p className="text-red-500 text-xs">{errors.annualIncome}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                      <Label htmlFor="accountType">Account Type</Label>
                      <select
                        id="accountType"
                        value={formData.accountType}
                        onChange={(e) => updateFormData("accountType", e.target.value)}
                        className="fintech-input"
                      >
                        <option value="personal">Personal</option>
                        <option value="business">Business</option>
                        <option value="premium">Premium</option>
                      </select>
                      <span className="select-chevron">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#a29bfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                      <select
                        id="preferredCurrency"
                        value={formData.preferredCurrency}
                        onChange={(e) => updateFormData("preferredCurrency", e.target.value)}
                        className="fintech-input"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                      <span className="select-chevron">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#a29bfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Identity Verification */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">PAN Verification Required</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          As per RBI guidelines, we need to verify your PAN for financial transactions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      placeholder="PAN Number"
                      value={formData.panNumber}
                      onChange={(e) => updateFormData("panNumber", e.target.value.toUpperCase())}
                      className={`fintech-input text-center font-mono tracking-wider ${errors.panNumber ? "border-red-500" : ""}`}
                      maxLength={10}
                    />
                    {errors.panNumber && <p className="text-red-500 text-xs">{errors.panNumber}</p>}
                    <p className="text-xs text-gray-500">
                      Format: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Address Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      className={`fintech-input ${errors.address ? "border-red-500" : ""}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        className={`fintech-input ${errors.city ? "border-red-500" : ""}`}
                      />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                        className={`fintech-input ${errors.state ? "border-red-500" : ""}`}
                      />
                      {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => updateFormData("pincode", e.target.value)}
                      className={`fintech-input ${errors.pincode ? "border-red-500" : ""}`}
                      maxLength={6}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-6 flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="bold-cta w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {currentStep === 1 ? "Back" : "Previous"}
                </Button>
                {currentStep === totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="w-full py-3 text-lg font-bold rounded-xl shadow-lg bg-gradient-to-r from-fintech-primary to-fintech-secondary text-white flex items-center justify-center transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                    style={{ letterSpacing: "0.03em" }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Account
                        <CheckCircle className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bold-cta w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link to="/auth" className="text-fintech-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
