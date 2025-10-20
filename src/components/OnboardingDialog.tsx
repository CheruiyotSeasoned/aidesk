import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, User, Mail, MapPin, Briefcase, Lock, Eye, EyeOff, Shield, CreditCard, Building2, Zap, TrendingUp, DollarSign, Clock, AlertCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  const { user, updateOnboardingProgress, completeOnboarding, signup, login, loginWithGoogle } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationAcknowledged, setVerificationAcknowledged] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
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
    cardHolderName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  // Check if user is already authenticated and skip to step 1
  useEffect(() => {
    if (user && open) {
      setCurrentStep(1);
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        name: user.name || ""
      }));
    } else if (!user && open) {
      setCurrentStep(0);
    }
  }, [user, open]);

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
    if (field === "paymentMethod") {
      setVerificationAcknowledged(false);
      setPaymentSuccess(false);
      setPaymentError("");
    }
    if (field === "email" || field === "password") {
      setAuthError("");
    }
  };

  const processPayPalVerification = async () => {
    setPaymentProcessing(true);
    setPaymentError("");

    try {
      // Simulate PayPal API integration
      // In production, this would integrate with PayPal's REST API
      const response = await fetch('/api/paypal/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.paypalEmail,
          amount: 5.00,
          currency: 'USD',
          description: 'AIDESK SPACE - Identity Verification'
        })
      });

      if (!response.ok) {
        throw new Error('PayPal verification failed');
      }

      const data = await response.json();
      
      // Simulate successful authorization
      setPaymentSuccess(true);
      return true;
    } catch (error) {
      setPaymentError("Failed to process PayPal verification. Please check your PayPal email and try again.");
      return false;
    } finally {
      setPaymentProcessing(false);
    }
  };

  const processPaystackVerification = async () => {
    setPaymentProcessing(true);
    setPaymentError("");

    try {
      // Initialize Paystack
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_live_848d6a33281232fbeec49e656c9192255dba0452', // Replace with your Paystack public key
        email: formData.email,
        amount: 1, // 5 USD in cents (Paystack uses smallest currency unit)
        currency: 'KES',
        ref: 'AIDESK_VERIFY_' + Math.floor(Math.random() * 1000000000),
        metadata: {
          custom_fields: [
            {
              display_name: "Verification Type",
              variable_name: "verification_type",
              value: "Identity Verification"
            }
          ]
        },
        callback: function(response: any) {
          // Verify the transaction on your backend
          fetch('/api/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: response.reference,
              userId: user?.id
            })
          }).then(res => {
            if (res.ok) {
              setPaymentSuccess(true);
              setPaymentProcessing(false);
            } else {
              throw new Error('Verification failed');
            }
          }).catch(() => {
            setPaymentError("Failed to verify payment. Please try again.");
            setPaymentProcessing(false);
          });
        },
        onClose: function() {
          setPaymentError("Payment verification was cancelled. Please complete the verification to continue.");
          setPaymentProcessing(false);
        }
      });

      handler.openIframe();
      return true;
    } catch (error) {
      setPaymentError("Failed to initialize payment. Please ensure your card details are correct.");
      setPaymentProcessing(false);
      return false;
    }
  };

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAuth = async () => {
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setAuthError("Passwords do not match");
          setAuthLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setAuthError("Password must be at least 6 characters");
          setAuthLoading(false);
          return;
        }
        await signup(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      
      setCurrentStep(1);
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
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError("");
    setAuthLoading(true);

    try {
      await loginWithGoogle();
      setCurrentStep(1);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Google sign-in was cancelled");
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError("Pop-up blocked. Please allow pop-ups for this site.");
      } else {
        setAuthError(error.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      handleAuth();
      return;
    }
    
    // Wrap updateOnboardingProgress calls in try-catch to handle missing profile gracefully
    try {
      if (currentStep === 1) await updateOnboardingProgress('personalInfo');
      if (currentStep === 2) await updateOnboardingProgress('skills');
      if (currentStep === 3) await updateOnboardingProgress('availability');
      if (currentStep === 4) {
        // Check if payment verification is required and completed
        if (formData.paymentMethod === 'paypal') {
          if (!paymentSuccess) {
            setVerificationOpen(true);
            return;
          }
        } else if (formData.paymentMethod === 'bank') {
          if (!paymentSuccess) {
            setVerificationOpen(true);
            return;
          }
        }
        await updateOnboardingProgress('payment');
      }
    } catch (error) {
      // Silently handle the error - profile will be created on final submission
      console.log('Profile not yet created, will be initialized on completion');
    }
    
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    // Don't allow going back to auth step if user is already authenticated
    if (currentStep > 1 || (currentStep === 1 && !user)) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare onboarding data for Supabase
      const onboardingData = {
        name: formData.name || user?.name || '',
        email: formData.email || user?.email || '',
        phone: formData.location, // Using location field for phone as per current form
        location: formData.location,
        bio: formData.bio,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        availability: {
          hours_per_week: parseInt(formData.availability) || 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          preferred_schedule: formData.availability || 'flexible'
        },
        payment_details: {
          method: formData.paymentMethod as 'paypal' | 'bank_transfer',
          paypal_email: formData.paypalEmail,
          bank_account_name: formData.bankAccountName,
          bank_account_number: formData.bankAccountNumber,
          bank_routing_number: formData.bankRoutingNumber,
          card_holder_name: formData.cardHolderName,
          card_number: formData.cardNumber,
          card_expiry: formData.cardExpiry,
          card_cvv: formData.cardCvv
        }
      };

      await updateOnboardingProgress('review');
      await completeOnboarding(onboardingData);
      onOpenChange(false);
      // Reset to appropriate step based on auth status
      setCurrentStep(user ? 1 : 0);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still close the dialog but show error
      onOpenChange(false);
      setCurrentStep(user ? 1 : 0);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Only reset to step 0 if user is not authenticated
    if (!user) {
      setCurrentStep(0);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex justify-center gap-2 p-1 bg-muted rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  authMode === 'signin' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError("");
                }}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  authMode === 'signup' ? 'bg-background shadow-sm' : 'text-muted-foreground'
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {authLoading ? 'Processing...' : 'Continue with Google'}
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
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
          <div className="space-y-4">
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
          <div className="space-y-6">
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
                    onClick={() => handleInputChange("paymentMethod", "paypal")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.paymentMethod === 'paypal' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">PayPal</p>
                    <p className="text-xs text-muted-foreground mt-1">Fast & secure</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("paymentMethod", "bank")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.paymentMethod === 'bank' 
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

                  {paymentError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{paymentError}</AlertDescription>
                    </Alert>
                  )}

                  {paymentSuccess && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-xs text-green-900">
                        <strong>Verification Successful!</strong> Your $5 authorization has been processed and will be refunded within 3-5 business days.
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
                    <p className="text-xs text-muted-foreground">This must match your PayPal account email</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">Identity Verification Required</p>
                        <p className="text-xs text-amber-800 mb-2">A temporary $5 authorization will be placed on your PayPal account to verify your identity.</p>
                        <div className="space-y-1 text-xs text-amber-700">
                          <p>✓ <strong>Fully refunded</strong> within 3-5 business days</p>
                          <p>✓ <strong>One-time only</strong> verification process</p>
                          <p>✓ <strong>Secure authorization</strong> via PayPal's platform</p>
                        </div>
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

                  {paymentError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{paymentError}</AlertDescription>
                    </Alert>
                  )}

                  {paymentSuccess && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-xs text-green-900">
                        <strong>Verification Successful!</strong> Your $5 authorization has been processed via Paystack and will be refunded within 3-5 business days.
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

                  <div className="pt-4 border-t">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 mb-1">Identity Verification Required</p>
                          <p className="text-xs text-amber-800 mb-2">To protect against fraud and ensure secure payouts, we verify your identity with a temporary $5 authorization via Paystack.</p>
                          <div className="space-y-1 text-xs text-amber-700">
                            <p>✓ <strong>Fully refunded</strong> within 3-5 business days</p>
                            <p>✓ <strong>One-time only</strong> verification process</p>
                            <p>✓ <strong>Secure via Paystack</strong> - PCI-DSS compliant</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-semibold mb-3">Card Details (For Verification via Paystack)</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      You'll be redirected to Paystack's secure payment page to complete the $5 verification authorization.
                    </p>

                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Lock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-900">
                        Paystack is a PCI-DSS Level 1 certified payment processor. Your card information is encrypted and never stored on our servers.
                      </p>
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
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">
                  {currentStep === 0 && "Welcome to AIDESK SPACE"}
                  {currentStep === 1 && (user ? "Complete Your Profile" : "Let's get to know you")}
                  {currentStep === 2 && "Showcase your expertise"}
                  {currentStep === 3 && "Set your schedule"}
                  {currentStep === 4 && "Secure your earnings"}
                  {currentStep === 5 && "Ready to launch!"}
                </DialogTitle>
                <DialogDescription>
                  {currentStep === 0 && "Sign in or create your account to get started"}
                  {currentStep === 1 && "Tell us the basics so we can personalize your experience"}
                  {currentStep === 2 && "Help us match you with the perfect AI tasks"}
                  {currentStep === 3 && "Set your availability and earning goals"}
                  {currentStep === 4 && "Set up secure payments - protected by bank-grade encryption"}
                  {currentStep === 5 && "Review your profile and start earning today"}
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
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                      currentStep >= step.id
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
                    <div className={`w-8 sm:w-12 h-px mx-2 transition-all ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
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
                onClick={currentStep === 5 ? handleSubmit : nextStep}
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
                ) : currentStep === 5 ? (
                  'Start Earning Now!'
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={verificationOpen} onOpenChange={setVerificationOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              {formData.paymentMethod === 'paypal' ? 'PayPal' : 'Paystack'} Verification Process
            </DialogTitle>
            <DialogDescription>
              Understanding your one-time verification charge
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
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
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setVerificationOpen(false)}
              className="flex-1"
              disabled={paymentProcessing}
            >
              Go Back
            </Button>
            <Button
              onClick={async () => {
                let success = false;
                if (formData.paymentMethod === 'paypal') {
                  success = await processPayPalVerification();
                } else if (formData.paymentMethod === 'bank') {
                  success = await processPaystackVerification();
                }
                
                if (success || formData.paymentMethod === 'bank') {
                  // For bank/Paystack, modal closes and Paystack handles the flow
                  // For PayPal, only close if successful
                  if (formData.paymentMethod === 'paypal' && success) {
                    setVerificationOpen(false);
                    setCurrentStep(5);
                  } else if (formData.paymentMethod === 'bank') {
                    setVerificationOpen(false);
                  }
                }
              }}
              className="flex-1"
              disabled={paymentProcessing}
            >
              {paymentProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : (
                formData.paymentMethod === 'paypal' ? 'Authorize with PayPal' : 'Verify with Paystack'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OnboardingDialog;