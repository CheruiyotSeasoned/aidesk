import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, User, Mail, MapPin, Briefcase, Lock, Eye, EyeOff, Shield, CreditCard, Building2, Zap, TrendingUp, DollarSign, Clock, AlertCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    location: "",
    experience: "",
    skills: "",
    availability: "",
    hourlyRate: "",
    bio: "",
    paymentMethod: "",
    paypalEmail: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
  });

  const steps = [
    { id: 0, title: "Account", description: "Secure your account" },
    { id: 1, title: "Personal Info", description: "Tell us about yourself" },
    { id: 2, title: "Skills & Experience", description: "What can you do?" },
    { id: 3, title: "Availability", description: "When can you work?" },
    { id: 4, title: "Payment Details", description: "Where should we pay you?" },
    { id: 5, title: "Review", description: "Ready to start earning?" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationError(null);
    if (field === "paymentMethod") {
      setPaymentSuccess(false);
      setPaymentError("");
    }
    if (field === "email" || field === "password") {
      setAuthError("");
    }
  };

  const validateStep = (step: number): { isValid: boolean; error: string | null } => {
    switch (step) {
      case 0:
        if (!formData.email || !formData.password) {
          return { isValid: false, error: "Please fill in all required fields" };
        }
        if (authMode === 'signup' && formData.password !== formData.confirmPassword) {
          return { isValid: false, error: "Passwords do not match" };
        }
        if (formData.password.length < 6) {
          return { isValid: false, error: "Password must be at least 6 characters" };
        }
        return { isValid: true, error: null };

      case 1:
        if (!formData.name || !formData.location) {
          return { isValid: false, error: "Please fill in all required fields" };
        }
        return { isValid: true, error: null };

      case 2:
        if (!formData.experience || !formData.skills) {
          return { isValid: false, error: "Please fill in your experience and skills" };
        }
        return { isValid: true, error: null };

      case 3:
        if (!formData.availability || !formData.hourlyRate) {
          return { isValid: false, error: "Please fill in your availability and hourly rate" };
        }
        return { isValid: true, error: null };

      case 4:
        if (!formData.paymentMethod) {
          return { isValid: false, error: "Please select a payment method" };
        }
        if (formData.paymentMethod === 'paypal' && !formData.paypalEmail) {
          return { isValid: false, error: "Please enter your PayPal email" };
        }
        if (formData.paymentMethod === 'bank') {
          if (!formData.bankAccountName || !formData.bankAccountNumber || !formData.bankRoutingNumber) {
            return { isValid: false, error: "Please fill in all bank details" };
          }
        }
        return { isValid: true, error: null };

      default:
        return { isValid: true, error: null };
    }
  };

  const processPaymentVerification = async () => {
    setPaymentProcessing(true);
    setPaymentError("");

    try {
      // Simulate payment verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentSuccess(true);
      setPaymentProcessing(false);
      setShowVerificationModal(false);
      return true;
    } catch (error) {
      setPaymentError("Failed to process verification. Please try again.");
      setPaymentProcessing(false);
      return false;
    }
  };

  const handleAuth = async (): Promise<boolean> => {
    const validation = validateStep(0);
    if (!validation.isValid) {
      setAuthError(validation.error || "Validation failed");
      return false;
    }

    setAuthError("");
    setAuthLoading(true);

    try {
      // Simulate auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error: any) {
      setAuthError(error.message || "Authentication failed. Please try again.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const nextStep = async () => {
    setValidationError(null);

    if (currentStep === 0) {
      const success = await handleAuth();
      if (success) {
        setCurrentStep(1);
      }
      return;
    }

    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    if (currentStep === 4) {
      if (!paymentSuccess) {
        setShowVerificationModal(true);
        return;
      }
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationError(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Onboarding complete! Welcome to AIDESK SPACE 🎉");
    } catch (error: any) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex justify-center gap-2 p-1 bg-muted rounded-lg max-w-md mx-auto">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${authMode === 'signin' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError("");
                }}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${authMode === 'signup' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError("");
                }}
              >
                Sign Up
              </button>
            </div>

            {authError && (
              <Alert variant="destructive" className="max-w-md mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="auth-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="auth-email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && nextStep()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={authMode === 'signup' ? "Create a strong password" : "Enter your password"}
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && nextStep()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && nextStep()}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-900">
                  <p className="font-medium mb-1">Your data is secure</p>
                  <p className="text-blue-700">We use industry-standard encryption to protect your information.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 max-w-md mx-auto">
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Confirmed email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email verified and secured</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 max-w-md mx-auto">
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience *</Label>
              <Input
                id="experience"
                placeholder="e.g., 5 years in data science"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Key Skills *</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, Machine Learning, Data Analysis"
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Brief Bio</Label>
              <textarea
                id="bio"
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Tell us about your background and what makes you stand out..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 max-w-md mx-auto">
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <Clock className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-green-900">Flexible Hours</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-blue-900">Earn More</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
                <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-purple-900">Quick Start</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Weekly Availability *</Label>
              <Input
                id="availability"
                placeholder="e.g., 20 hours/week, flexible schedule"
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Be realistic - this helps us match you with suitable projects</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Desired Hourly Rate (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="25"
                  className="pl-10"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">Average rate for similar roles: $25-50/hour</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <p className="text-xs font-semibold text-green-900">Bank-Grade Security</p>
                </div>
                <p className="text-xs text-green-700">256-bit SSL encryption</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <p className="text-xs font-semibold text-blue-900">PCI Compliant</p>
                </div>
                <p className="text-xs text-blue-700">Industry-certified secure</p>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-900">
                <strong className="font-semibold">Why we need payment info:</strong> To verify your identity and enable instant payouts. We never charge you - this is how you receive your earnings.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Payment Method *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled
                    className="relative p-4 border-2 rounded-lg opacity-60 cursor-not-allowed bg-muted/20"
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">PayPal</p>
                    <p className="text-xs text-muted-foreground mt-1">Coming Soon</p>

                    <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange("paymentMethod", "bank")}
                    className={`p-4 border-2 rounded-lg transition-all ${formData.paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                  >
                    <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Bank Transfer</p>
                    <p className="text-xs text-muted-foreground mt-1">Direct deposit</p>
                  </button>
                </div>
              </div>

              {formData.paymentMethod === 'paypal' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  {paymentSuccess && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-xs text-green-900">
                        <strong>Verification Successful!</strong> Your payment method has been verified.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">PayPal Email Address *</Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      placeholder="your-paypal-email@example.com"
                      value={formData.paypalEmail}
                      onChange={(e) => handleInputChange("paypalEmail", e.target.value)}
                      disabled={paymentSuccess}
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'bank' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  {paymentSuccess && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-xs text-green-900">
                        <strong>Verification Successful!</strong> Your payment method has been verified.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountName">Account Holder Name *</Label>
                      <Input
                        id="bankAccountName"
                        placeholder="Full name as shown on account"
                        value={formData.bankAccountName}
                        onChange={(e) => handleInputChange("bankAccountName", e.target.value)}
                        disabled={paymentSuccess}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="bankAccountNumber">Account Number *</Label>
                        <Input
                          id="bankAccountNumber"
                          placeholder="0123456789"
                          value={formData.bankAccountNumber}
                          onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                          disabled={paymentSuccess}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankRoutingNumber">Routing / SWIFT *</Label>
                        <Input
                          id="bankRoutingNumber"
                          placeholder="110000000"
                          value={formData.bankRoutingNumber}
                          onChange={(e) => handleInputChange("bankRoutingNumber", e.target.value)}
                          disabled={paymentSuccess}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                <User className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{formData.name}</p>
                  <p className="text-xs text-muted-foreground">{formData.email}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{formData.location}</p>
                  <p className="text-xs text-muted-foreground">Available: {formData.availability}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
                <Briefcase className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{formData.experience}</p>
                  <p className="text-xs text-muted-foreground">{formData.skills}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">${formData.hourlyRate}/hour</p>
                  <p className="text-xs text-muted-foreground">
                    Payment via {formData.paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-green-600 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg text-green-900">You're All Set!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Welcome to AIDESK SPACE - where AI meets opportunity
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  <p>Your first AI tasks will arrive within 24 hours</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  <p>Weekly payouts directly to your account</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  <p>24/7 support whenever you need help</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">$2.5k+</p>
                <p className="text-xs text-muted-foreground">Avg. Monthly</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-xs text-muted-foreground">Active Taskers</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">4.8★</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">AIDESK SPACE</h1>
                <p className="text-xs text-muted-foreground">Join the AI workforce</p>
              </div>
            </div>
            {currentStep > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {steps.filter(s => s.id > 0).map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                        currentStep >= step.id
                          ? "bg-primary border-primary text-primary-foreground shadow-md"
                          : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center hidden sm:block">
                      <p className={`text-xs font-medium ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.filter(s => s.id > 0).length - 1 && (
                    <div className={`w-12 sm:w-20 h-0.5 mx-2 transition-all ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-xl shadow-lg border p-6 sm:p-8 md:p-12">
          {/* Step Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {currentStep === 0 && "Welcome to AIDESK SPACE"}
              {currentStep === 1 && "Let's get to know you"}
              {currentStep === 2 && "Showcase your expertise"}
              {currentStep === 3 && "Set your schedule"}
              {currentStep === 4 && "Secure your earnings"}
              {currentStep === 5 && "Ready to launch!"}
            </h2>
            <p className="text-muted-foreground">
              {currentStep === 0 && "Sign in or create your account to get started"}
              {currentStep === 1 && "Tell us the basics so we can personalize your experience"}
              {currentStep === 2 && "Help us match you with the perfect AI tasks"}
              {currentStep === 3 && "Set your availability and earning goals"}
              {currentStep === 4 && "Set up secure payments - protected by bank-grade encryption"}
              {currentStep === 5 && "Review your profile and start earning today"}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || authLoading || paymentProcessing}
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={currentStep === 5 ? handleSubmit : nextStep}
              className="min-w-[160px]"
              disabled={authLoading || paymentProcessing}
              size="lg"
            >
              {authLoading || paymentProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : currentStep === 0 ? (
                authMode === 'signup' ? 'Create Account' : 'Sign In'
              ) : currentStep === 5 ? (
                'Start Earning Now!'
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Payment Verification</h3>
                  <p className="text-sm text-muted-foreground">Understanding your one-time verification</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Why do we need this?</p>
                  <p className="text-xs text-blue-800">
                    Financial regulations require us to verify your identity before processing payouts. This protects both you and our platform from fraud.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-1.5 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Temporary $5 Authorization</p>
                      <p className="text-xs text-muted-foreground">A hold placed on your account, not an actual charge</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-1.5 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Automatic Refund</p>
                      <p className="text-xs text-muted-foreground">Released back to your account in 3-5 business days</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-1.5 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">One-Time Only</p>
                      <p className="text-xs text-muted-foreground">Never charged again after initial verification</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-green-900 mb-1">Your Privacy Matters</p>
                      <p className="text-xs text-green-800">
                        All payment processing is handled securely. We never see or store your complete financial information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1"
                  disabled={paymentProcessing}
                >
                  Go Back
                </Button>
                <Button
                  onClick={processPaymentVerification}
                  className="flex-1"
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Verify Payment Method'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;