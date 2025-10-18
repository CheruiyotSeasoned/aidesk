import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ContributorSection } from "@/components/ContributorSection";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { TaskExamples } from "@/components/TaskExamples";
import { DualCTA } from "@/components/DualCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ContributorSection />
      <Features />
      <HowItWorks />
      <TaskExamples />
      <DualCTA />
      <Footer />
    </div>
  );
};

export default Index;
