import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, TrendingUp, Award, Globe2, Smartphone, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { AvailableTasksDialog } from "@/components/AvailableTasksDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Earnings",
    description: "Earn $5-$25/hour depending on task complexity and your expertise level",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Work when you want, from anywhere. No minimum hours or commitments required",
  },
  {
    icon: TrendingUp,
    title: "Skill Progression",
    description: "Unlock higher-paying tasks as you build reputation and complete certifications",
  },
  {
    icon: Award,
    title: "Performance Bonuses",
    description: "Top performers earn bonus incentives and priority access to premium tasks",
  },
  {
    icon: Globe2,
    title: "Global Opportunities",
    description: "Access tasks from companies worldwide. Work on cutting-edge AI projects",
  },
  {
    icon: Smartphone,
    title: "Mobile & Desktop",
    description: "Complete tasks on any device with our optimized platform",
  },
];

export const ContributorSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      // This will be handled by the AvailableTasksDialog
    }
  };

  return (
    <section id="contributors" className="py-20 px-4 bg-gradient-subtle">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Earn Money <span className="bg-gradient-hero bg-clip-text text-transparent">Powering AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our global network of skilled contributors and earn competitive pay working on meaningful AI projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="p-6 border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-8 text-center border-border bg-card">
            <div className="text-4xl font-bold text-primary mb-2">$15/hr</div>
            <div className="text-sm text-muted-foreground">Average Hourly Rate</div>
          </Card>
          <Card className="p-8 text-center border-border bg-card">
            <div className="text-4xl font-bold text-primary mb-2">500K+</div>
            <div className="text-sm text-muted-foreground">Active Contributors</div>
          </Card>
          <Card className="p-8 text-center border-border bg-card">
            <div className="text-4xl font-bold text-primary mb-2">$50M+</div>
            <div className="text-sm text-muted-foreground">Paid to Contributors</div>
          </Card>
        </div>

        {/* Success Stories */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Success Stories</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="font-semibold">Alex Chen</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                "I've earned over $3,000 in my first month working on AI data labeling tasks. The platform is intuitive and payments are always on time."
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">$3,200 earned this month</span>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="font-semibold">Maria Rodriguez</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                "As a stay-at-home mom, this platform gives me the flexibility to earn money while taking care of my family. Highly recommended!"
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">$2,800 earned this month</span>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  D
                </div>
                <div>
                  <p className="font-semibold">David Kim</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                "The variety of AI tasks keeps me engaged. I've learned so much about machine learning while earning money."
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">$4,100 earned this month</span>
              </div>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AvailableTasksDialog />
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base"
              onClick={handleGetStarted}
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              {user ? "Go to Dashboard" : "Learn More"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No experience required • Get started in minutes • Instant payouts • 4.9/5 rating
          </p>
        </div>
      </div>
    </section>
  );
};
