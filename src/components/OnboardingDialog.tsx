import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, User, Mail, MapPin, Briefcase, Lock, Eye, EyeOff, Shield, CreditCard, Building2, Zap, TrendingUp, DollarSign, Clock, AlertCircle, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingDialog = ({ open: externalOpen, onOpenChange }: OnboardingDialogProps) => {
  const { user, updateOnboardingProgress, completeOnboarding, signup, login } = useAuth();
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
  const [internalOpen, setInternalOpen] = useState(true);
  // Guards the init effect below so it runs once per opening, not per user change.
  const hasInitialized = useRef(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    location: "",
    phone: "",
    experience: "",
    skills: "",
    availability: "",
    preferredSchedule: "",
    hourlyRate: "",
    bio: "",
    paymentMethod: "",
    paypalEmail: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
  });
  // Pick the starting step once per opening. This deliberately does NOT react to
  // `user` identity: updateOnboardingProgress returns a fresh user object after
  // every step, and re-running this would snap the wizard back to step 1.
  useEffect(() => {
    if (!open) {
      hasInitialized.current = false;
      return;
    }
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    setCurrentStep(user ? 1 : 0);
  }, [open, user]);

  // Prefill from the account, without clobbering anything already typed.
  useEffect(() => {
    if (!user) return;
    setFormData(prev => ({
      ...prev,
      email: prev.email || user.email || "",
      name: prev.name || user.name || "",
    }));
  }, [user]);

  const steps = [
    { id: 0, title: "Account", description: "Secure your account" },
    { id: 1, title: "Personal Info", description: "Tell us about yourself" },
    { id: 2, title: "Skills & Experience", description: "What can you do?" },
    { id: 3, title: "Availability", description: "When can you work?" },
    { id: 4, title: "Payment Method", description: "Choose how to get paid" },
    { id: 5, title: "Verification", description: "Verify your account" },
    { id: 6, title: "Review", description: "Ready to start earning?" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    setValidationError(null);
    if (field === "paymentMethod") {
      setPaymentSuccess(false);
      setPaymentError("");
    }
    if (field === "email" || field === "password") {
      setAuthError("");
    }
  };

  // Validation function for each step
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
        if (!formData.availability || !formData.preferredSchedule || !formData.hourlyRate) {
          return { isValid: false, error: "Please fill in your hours, schedule and hourly rate" };
        }
        if (Number(formData.availability) < 1 || Number(formData.availability) > 168) {
          return { isValid: false, error: "Hours per week must be between 1 and 168" };
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

      case 5:
        // Verification step - check if payment verification is complete
        if (!paymentSuccess) {
          return { isValid: false, error: "Please complete payment verification" };
        }
        return { isValid: true, error: null };

      default:
        return { isValid: true, error: null };
    }
  };

  const processPayPalVerification = async () => {
    if (!formData.paypalEmail) {
      setPaymentError("Please enter your PayPal email address");
      return false;
    }

    setPaymentProcessing(true);
    setPaymentError("");

    try {
      // Load PayPal SDK if not already loaded
      if (!(window as any).paypal) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://www.paypal.com/sdk/js?client-id=AVyQxF4MkVprgaE0nKYVzqKINgmOBtsq7An-iQCzyj_uC40UrsIi-yxz-Qz4X98RmnuWhPvq8oMp3glr&currency=USD&disable-funding=credit,card';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // For demo purposes, simulate successful verification
      // In production, use PayPal SDK to create an authorization
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentSuccess(true);
      setPaymentProcessing(false);
      return true;
    } catch (error) {
      setPaymentError("Failed to process PayPal verification. Please check your PayPal email and try again.");
      setPaymentProcessing(false);
      return false;
    }
  };

  const processPaystackVerification = async () => {
    if (!formData.bankAccountName || !formData.bankAccountNumber) {
      setPaymentError("Please fill in all bank details");
      return false;
    }
    setInternalOpen(false);

    setPaymentProcessing(true);
    setPaymentError("");

    try {
      if (!(window as any).PaystackPop) {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const handler = (window as any).PaystackPop.setup({
        key: "pk_live_848d6a33281232fbeec49e656c9192255dba0452",
        email: formData.email,
        amount: 5 * 100,
        currency: "USD",
        ref: `AIDESK_VERIFY_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        metadata: {
          custom_fields: [
            { display_name: "Verification Type", variable_name: "verification_type", value: "Identity Verification" },
            { display_name: "User Email", variable_name: "user_email", value: formData.email },
          ],
        },
        callback: (response: any) => {
          console.log("✅ Payment successful:", response);
          setPaymentSuccess(true);
          setInternalOpen(true);
          setPaymentProcessing(false);
        },
        onClose: () => {
          console.log("⚠️ Payment window closed");
          setPaymentError("Payment verification was cancelled.");
          setPaymentProcessing(false);
          setInternalOpen(true);
        },
      });

      handler.openIframe();
      return true;
    } catch (error: any) {
      console.error("❌ Paystack error:", error);
      setPaymentError(error.message || "Failed to initialize payment.");
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
      if (authMode === 'signup') {
        await signup(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }

      return true;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthError("Email already registered. Try signing in instead.");
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAuthError("Invalid email or password");
      } else if (error.code === 'auth/invalid-email') {
        setAuthError("Invalid email address");
      } else if (error.code === 'auth/weak-password') {
        setAuthError("Password is too weak");
      } else {
        setAuthError(error.message || "Authentication failed. Please try again.");
      }
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const nextStep = async () => {
    // Clear previous errors
    setValidationError(null);

    // Handle authentication step
    if (currentStep === 0) {
      const success = await handleAuth();
      if (success) {
        setCurrentStep(1);
      }
      return;
    }

    // Validate current step before proceeding
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    // Special handling for payment step
    if (currentStep === 4) {
      // Just validate and move to verification step
      const validation = validateStep(currentStep);
      if (!validation.isValid) {
        setValidationError(validation.error);
        return;
      }
    }

    // Special handling for verification step
    if (currentStep === 5) {
      if (!paymentSuccess) {
        setValidationError("Please complete the verification process");
        return;
      }
    }

    // Update onboarding progress in database
    try {
      if (currentStep === 1) await updateOnboardingProgress('personalInfo');
      if (currentStep === 2) await updateOnboardingProgress('skills');
      if (currentStep === 3) await updateOnboardingProgress('availability');
      if (currentStep === 4) await updateOnboardingProgress('payment');
    } catch (error) {
      console.log('Profile not yet created, will be initialized on completion');
    }

    // Move to next step
    if (currentStep < 6) {
      console.log("Moving from step:", currentStep, "to", currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    // Don't allow going back to auth step if user is already authenticated
    if (currentStep > 1 || (currentStep === 1 && !user)) {
      setCurrentStep(currentStep - 1);
      setValidationError(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    try {
      // Prepare onboarding data for Supabase
      const onboardingData = {
        name: formData.name || user?.name || '',
        phone: formData.phone || undefined,
        location: formData.location,
        bio: formData.bio,
        experience: formData.experience || null,
        hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        availability: {
          hours_per_week: parseInt(formData.availability, 10) || 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          preferred_schedule: formData.preferredSchedule || 'flexible',
        },
        payment_details: {
          method: (formData.paymentMethod === 'bank' ? 'bank_transfer' : 'paypal') as 'paypal' | 'bank_transfer',
          paypal_email: formData.paypalEmail || null,
          bank_account_name: formData.bankAccountName || null,
          bank_account_number: formData.bankAccountNumber || null,
          bank_routing_number: formData.bankRoutingNumber || null,
          // Card details are never sent: Paystack's popup collects them directly,
          // and storing a PAN or CVV here would put this app in PCI scope.
        },
      };

      // First update the onboarding progress
      try {
        await updateOnboardingProgress('review');
      } catch (error: any) {
        console.error('Error updating onboarding progress:', error);
      }

      // Complete onboarding with error handling
      try {
        await completeOnboarding(onboardingData);

        // Success - close dialog and reset
        onOpenChange(false);
        setCurrentStep(user ? 1 : 0);
        setSubmitError(null);
        setValidationError(null);
      } catch (error: any) {
        console.error('Error completing onboarding:', error);

        // The API returns Laravel validation errors keyed by field; surface the
        // most specific message rather than the generic summary.
        let errorMessage = 'Failed to complete onboarding. Please try again.';

        if (error instanceof ApiError) {
          errorMessage = error.status === 401
            ? 'Your session expired. Please sign in again.'
            : error.firstError;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setSubmitError(errorMessage);
      }
    } catch (error: any) {
      console.error('Unexpected error during submission:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (!user) {
      setCurrentStep(0);
    }
    setValidationError(null);
    setSubmitError(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex justify-center gap-2 p-1 bg-muted rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${authMode === 'signin' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                  }`}
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError("");
                }}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${authMode === 'signup' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                  }`}
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError("");
                }}
              >
                Sign Up
              </button>
            </div>

            {authError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
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
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-900">
                <p className="font-medium mb-1">Your data is secure</p>
                <p className="text-blue-700">We use industry-standard encryption to protect your information. Your password is never stored in plain text.</p>
              </div>
            </div>

          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
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
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254 700 000 000"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
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
          <div className="space-y-4">
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
              <Label htmlFor="availability">Hours Available Per Week *</Label>
              <Input
                id="availability"
                type="number"
                min="1"
                max="168"
                placeholder="20"
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Be realistic - this helps us match you with suitable projects</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredSchedule">Preferred Schedule *</Label>
              <Input
                id="preferredSchedule"
                placeholder="e.g., weekday evenings, weekends, flexible"
                value={formData.preferredSchedule}
                onChange={(e) => handleInputChange("preferredSchedule", e.target.value)}
              />
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
          <div className="space-y-6">
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
                <Label htmlFor="paymentMethod">Select Payment Method *</Label>
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
                    className={`p-4 border-2 rounded-lg transition-all ${formData.paymentMethod === 'bank'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                      }`}
                  >
                    <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Bank Transfer</p>
                    <p className="text-xs text-muted-foreground mt-1">Direct deposit</p>
                  </button>
                </div>
              </div>

              {formData.paymentMethod === 'paypal' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>PayPal processes payments instantly and securely</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">PayPal Email Address *</Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      placeholder="your-paypal-email@example.com"
                      value={formData.paypalEmail}
                      onChange={(e) => handleInputChange("paypalEmail", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">This must match your PayPal account email</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">Next: Identity Verification</p>
                        <p className="text-xs text-blue-800">
                          After providing your PayPal email, you'll complete a quick $5 verification in the next step. This amount is fully refunded within 3-5 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'bank' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground mb-3">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p>Your bank details are encrypted and never shared with third parties</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountName">Account Holder Name *</Label>
                      <Input
                        id="bankAccountName"
                        placeholder="Full name as shown on account"
                        value={formData.bankAccountName}
                        onChange={(e) => handleInputChange("bankAccountName", e.target.value)}
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankRoutingNumber">Routing / SWIFT *</Label>
                        <Input
                          id="bankRoutingNumber"
                          placeholder="110000000"
                          value={formData.bankRoutingNumber}
                          onChange={(e) => handleInputChange("bankRoutingNumber", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">Next: Identity Verification</p>
                        <p className="text-xs text-blue-800">
                          After providing your bank details, you'll complete a secure $5 verification via Paystack in the next step. This amount is fully refunded within 3-5 business days.
                        </p>
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
          <div className="space-y-6">
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {paymentError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}

            {paymentSuccess ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  <strong>Verification Complete!</strong> Your identity has been verified successfully. The $5 authorization will be refunded within 3-5 business days.
                </AlertDescription>
              </Alert>
            ) : (
              <>
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
                      <p className="text-xs text-muted-foreground">A hold placed on your {formData.paymentMethod === 'paypal' ? 'PayPal account' : 'card'}, not an actual charge</p>
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

                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-1.5 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bank-Grade Security</p>
                      <p className="text-xs text-muted-foreground">
                        {formData.paymentMethod === 'paypal' ? 'PayPal-secured' : 'Paystack PCI-DSS compliant'} processing with end-to-end encryption
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-900">
                    <strong className="font-semibold">Important:</strong> You'll see "AIDESK VERIFICATION" on your statement. This amount will be returned to you automatically. No action needed on your part.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-green-900 mb-1">Your Privacy Matters</p>
                      <p className="text-xs text-green-800">
                        {formData.paymentMethod === 'paypal'
                          ? 'PayPal handles all payment processing securely. We never see or store your financial information.'
                          : 'Paystack is PCI-DSS Level 1 certified. We never store your complete card details - all sensitive data is tokenized and encrypted.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={async () => {
                    if (formData.paymentMethod === 'paypal') {
                      await processPayPalVerification();
                    } else if (formData.paymentMethod === 'bank') {
                      await processPaystackVerification();
                    }
                  }}
                  disabled={paymentProcessing}
                  className="w-full"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      {formData.paymentMethod === 'paypal' ? 'Authorize with PayPal' : 'Verify with Paystack'}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
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
  const handleDialogChange = (isOpen: boolean) => {
    setInternalOpen(isOpen);
    onOpenChange?.(isOpen); // propagate to parent if provided
  };
  return (
    <>
      <Dialog open={externalOpen && internalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">
                  {currentStep === 0 && "Welcome to AIDESK SPACE"}
                  {currentStep === 1 && (user ? "Complete Your Profile" : "Let's get to know you")}
                  {currentStep === 2 && "Showcase your expertise"}
                  {currentStep === 3 && "Set your schedule"}
                  {currentStep === 4 && "Choose your payment method"}
                  {currentStep === 5 && "Verify your identity"}
                  {currentStep === 6 && "Ready to launch!"}
                </DialogTitle>
                <DialogDescription>
                  {currentStep === 0 && "Sign in or create your account to get started"}
                  {currentStep === 1 && "Tell us the basics so we can personalize your experience"}
                  {currentStep === 2 && "Help us match you with the perfect AI tasks"}
                  {currentStep === 3 && "Set your availability and earning goals"}
                  {currentStep === 4 && "Select how you'd like to receive payments"}
                  {currentStep === 5 && "Quick security check to protect your account"}
                  {currentStep === 6 && "Review your profile and start earning today"}
                </DialogDescription>
              </div>
              {(currentStep > 0 && !user) || (currentStep > 1 && user) ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </DialogHeader>

          {currentStep > 0 && (
            <div className="flex items-center justify-between py-4 border-b overflow-x-auto">
              {steps.filter(s => s.id > 0).map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${currentStep >= step.id
                      ? "bg-primary border-primary text-primary-foreground shadow-md"
                      : "border-muted-foreground text-muted-foreground"
                      }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">{step.id}</span>
                    )}
                  </div>
                  {index < steps.filter(s => s.id > 0).length - 1 && (
                    <div className={`w-8 sm:w-12 h-px mx-2 transition-all ${currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="py-6">
            {renderStepContent()}
          </div>

          {currentStep > 0 || !user ? (
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={
                  Boolean(
                    (currentStep === 0 && !user) ||
                    (currentStep === 1 && !!user) ||
                    authLoading ||
                    paymentProcessing
                  )
                }
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={currentStep === 6 ? handleSubmit : nextStep}
                className="min-w-[140px]"
                disabled={authLoading || paymentProcessing}
              >
                {authLoading || paymentProcessing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                    Processing...
                  </>
                ) : currentStep === 0 ? (
                  authMode === 'signup' ? 'Create Account' : 'Sign In'
                ) : currentStep === 6 ? (
                  'Start Earning Now!'
                ) : currentStep === 5 && !paymentSuccess ? (
                  'Skip for Now'
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OnboardingDialog;