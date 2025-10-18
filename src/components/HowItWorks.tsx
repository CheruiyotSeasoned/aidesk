import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, ClipboardList, CheckSquare, Wallet, ArrowRight, Play, Clock, Users, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Define Requirements",
    description: "Share your AI objectives, data needs, and quality standards with our solutions team.",
    color: "primary",
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "Custom Workflow Design",
    description: "We architect tailored data pipelines combining automation and human expertise.",
    color: "secondary",
  },
  {
    icon: CheckSquare,
    number: "03",
    title: "Execute & Validate",
    description: "Our global network delivers high-quality data with real-time quality monitoring.",
    color: "accent",
  },
  {
    icon: Wallet,
    number: "04",
    title: "Deploy & Scale",
    description: "Integrate validated datasets into your ML pipeline and scale seamlessly.",
    color: "primary",
  },
];

export const HowItWorks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      // This will be handled by the AvailableTasksDialog
    }
  };

  const handleWatchDemo = () => {
    // Open demo video or scroll to demo section
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="how-it-works" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From concept to production-ready AI models in four strategic phases
          </p>
        </div>

        {/* Process Overview */}
        <div className="mb-16">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Setup</h3>
              <p className="text-muted-foreground">Get started in under 5 minutes with our streamlined onboarding process</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Network</h3>
              <p className="text-muted-foreground">Access 500K+ verified contributors with specialized AI expertise</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">99.9% accuracy SLA with multi-layer validation and quality control</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={index} className="relative">
                <Card className="p-6 border-border h-full hover:shadow-card transition-all duration-300 group">
                  <div className="space-y-4">
                    <div className={`text-6xl font-bold text-${step.color}/10 group-hover:text-${step.color}/20 transition-colors`}>
                      {step.number}
                    </div>
                    <div className={`w-14 h-14 rounded-xl bg-${step.color} flex items-center justify-center -mt-8 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
                
                {!isLast && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 -translate-y-1/2">
                    <div className="w-full h-0.5 bg-border"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of contributors and enterprises already using AIDESK SPACE to power their AI projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-base"
                onClick={handleGetStarted}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                {user ? "Go to Dashboard" : "Start Earning Now"}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base"
                onClick={handleWatchDemo}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
