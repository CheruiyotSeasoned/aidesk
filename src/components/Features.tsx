import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Shield, Zap, Globe2, TrendingUp, Users, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { EnterpriseDemoDialog } from "@/components/EnterpriseDemoDialog";
import { CaseStudyDialog } from "@/components/CaseStudyDialog";
import { useState } from "react";

const features = [
  {
    icon: Globe2,
    title: "Global Talent Network",
    description: "Access the world's largest network of verified, skilled contributors across 190+ countries.",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Quality",
    description: "Multi-layer validation combining AI automation and human expertise with 99.9% accuracy SLA.",
    gradient: "from-secondary to-secondary",
  },
  {
    icon: Zap,
    title: "Scale at Speed",
    description: "Process millions of data points with rapid turnaround. From prototype to production instantly.",
    gradient: "from-accent to-accent",
  },
  {
    icon: Smartphone,
    title: "Dynamic Data Engine",
    description: "Adaptive workflows powered by AI that learn and optimize for your specific use cases.",
    gradient: "from-primary to-accent",
  },
  {
    icon: TrendingUp,
    title: "Full-Cycle Support",
    description: "Data collection, labeling, validation, testing, and localization—all in one platform.",
    gradient: "from-secondary to-primary",
  },
  {
    icon: Users,
    title: "Dedicated Success Team",
    description: "White-glove onboarding and ongoing support from AI experts who understand your industry.",
    gradient: "from-accent to-secondary",
  },
];

export const Features = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [caseStudyDialogOpen, setCaseStudyDialogOpen] = useState(false);

  const handleEnterpriseContact = () => {
    // Scroll to contact section or open contact form
    const contactSection = document.getElementById('enterprise');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Enterprise AI <span className="bg-gradient-hero bg-clip-text text-transparent">Infrastructure</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything enterprises need to build, train, and deploy AI models at scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 border-border hover:shadow-card transition-all duration-300 hover:scale-105 group">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="flex items-center text-sm text-primary font-medium">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span>Enterprise Ready</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Scale Your AI?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join 1000+ enterprises already using AIDESK SPACE to power their AI initiatives. 
            Get started with a free consultation and custom pilot project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-base"
              onClick={() => setDemoDialogOpen(true)}
            >
              <Users className="mr-2 h-5 w-5" />
              Schedule Enterprise Demo
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base"
              onClick={() => setCaseStudyDialogOpen(true)}
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Download Case Study
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Custom Pilot Project</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <EnterpriseDemoDialog 
        open={demoDialogOpen} 
        onOpenChange={setDemoDialogOpen} 
      />
      <CaseStudyDialog 
        open={caseStudyDialogOpen} 
        onOpenChange={setCaseStudyDialogOpen} 
      />
    </section>
  );
};
