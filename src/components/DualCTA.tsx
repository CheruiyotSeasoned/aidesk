import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Users, CheckCircle2, DollarSign, Clock, Star, Phone, Mail } from "lucide-react";
import { AvailableTasksDialog } from "@/components/AvailableTasksDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const DualCTA = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnterpriseContact = () => {
    // Scroll to contact section or open contact form
    const contactSection = document.getElementById('enterprise');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      // This will be handled by the AvailableTasksDialog
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Enterprise CTA */}
          <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all">
            <div className="p-8 md:p-12">
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                For Enterprises
              </h3>
              <p className="text-muted-foreground mb-6">
                Scale your AI initiatives with enterprise-grade data services. Trusted by Fortune 500 companies.
              </p>
              
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Custom data pipelines</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>99.9% accuracy SLA</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Dedicated success manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>SOC 2 compliant</span>
                </li>
              </ul>
              
              <Button 
                variant="default" 
                size="lg" 
                className="w-full"
                onClick={handleEnterpriseContact}
              >
                Request Enterprise Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-hero opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </Card>

          {/* Contributor CTA */}
          <Card className="relative overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 transition-all">
            <div className="p-8 md:p-12">
              <div className="w-14 h-14 rounded-xl bg-gradient-teal flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                For Contributors
              </h3>
              <p className="text-muted-foreground mb-6">
                Join 500K+ people worldwide earning flexible income by contributing to AI development.
              </p>
              
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  <span>Earn $5-$25/hour</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  <span>Work from anywhere</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  <span>Flexible schedule</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  <span>Weekly instant payouts</span>
                </li>
              </ul>
              
              <AvailableTasksDialog />
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're an enterprise looking to scale AI or a contributor ready to earn, we're here to help you succeed.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Call Us</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Email Us</p>
                <p className="text-sm text-muted-foreground">hello@aideskspace.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Star className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Support</p>
                <p className="text-sm text-muted-foreground">24/7 Live Chat</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-base"
              onClick={handleGetStarted}
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              {user ? "Go to Dashboard" : "Get Started Now"}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base"
              onClick={handleEnterpriseContact}
            >
              <Building2 className="mr-2 h-5 w-5" />
              Enterprise Solutions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
