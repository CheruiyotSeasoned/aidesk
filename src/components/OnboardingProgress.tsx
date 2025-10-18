import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, User, Briefcase, Clock, FileText } from "lucide-react";
import { useState } from "react";
import OnboardingDialog from "./OnboardingDialog";

export const OnboardingProgress = () => {
  const { user, updateOnboardingProgress, completeOnboarding } = useAuth();
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  if (!user || user.onboardingCompleted) return null;

  const steps = [
    {
      id: "personalInfo" as const,
      title: "Personal Information",
      description: "Tell us about yourself",
      icon: <User className="h-5 w-5" />,
      completed: user.onboardingProgress.personalInfo,
    },
    {
      id: "skills" as const,
      title: "Skills & Experience",
      description: "What can you do?",
      icon: <Briefcase className="h-5 w-5" />,
      completed: user.onboardingProgress.skills,
    },
    {
      id: "availability" as const,
      title: "Availability",
      description: "When can you work?",
      icon: <Clock className="h-5 w-5" />,
      completed: user.onboardingProgress.availability,
    },
    {
      id: "payment" as const,
      title: "Payment Details",
      description: "Where should we pay you?",
      icon: <FileText className="h-5 w-5" />,
      completed: user.onboardingProgress.payment,
    },
    {
      id: "review" as const,
      title: "Review & Complete",
      description: "Ready to start earning?",
      icon: <FileText className="h-5 w-5" />,
      completed: user.onboardingProgress.review,
    },
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const getStepStatus = (step: typeof steps[0]) => {
    if (step.completed) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        Pending
      </Badge>
    );
  };

  return (
    <>
      <Card className="mb-6 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Complete Your Profile
              </CardTitle>
              <CardDescription>
                Finish setting up your account to unlock all features and start earning
              </CardDescription>
            </div>
            <Button onClick={() => setOnboardingOpen(true)}>
              Continue Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Profile Completion</span>
              <span className="font-medium">{completedSteps}/{steps.length} steps</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Steps Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border transition-colors ${
                  step.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      step.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="h-4 w-4" /> : step.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {getStepStatus(step)}
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Complete your profile to unlock:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Access to all available tasks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Higher-paying premium projects
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Priority task notifications
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Direct client communication
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Dialog */}
      <OnboardingDialog 
        open={onboardingOpen} 
        onOpenChange={setOnboardingOpen} 
      />
    </>
  );
};
