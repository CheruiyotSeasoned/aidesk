import { Button } from "@/components/ui/button";
import { CheckCircle2, Play, Building2, ArrowRight } from "lucide-react";
import { AvailableTasksDialog } from "@/components/AvailableTasksDialog";

export const Hero = () => {
  const handleEnterpriseClick = () => {
    document.getElementById("enterprise")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWatchDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center bg-background pt-16">
      <div className="container mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Text */}
          <div className="flex flex-col gap-7">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 border border-border bg-muted/50 rounded-full px-4 py-1.5 w-fit text-sm text-muted-foreground font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              Live Platform &nbsp;·&nbsp; 500K+ Contributors
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold leading-[1.1] tracking-tight text-foreground">
                Your One-Stop Partner
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold leading-[1.1] tracking-tight bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                for AI Excellence
              </h1>
            </div>

            {/* Body */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              We connect enterprises that need high-quality AI data with a global
              network of skilled contributors — delivering speed, precision, and scale at every stage of the AI lifecycle.
            </p>

            {/* Checklist */}
            <ul className="flex flex-col gap-2.5">
              {[
                "Enterprise-grade data labeling & annotation",
                "Verified global talent network, ready to scale",
                "End-to-end AI development lifecycle support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <AvailableTasksDialog />
              <Button
                size="lg"
                variant="outline"
                className="border-border font-semibold"
                onClick={handleEnterpriseClick}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Enterprise Solutions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleWatchDemo}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 pt-4 border-t border-border">
              {[
                { value: "500K+", label: "Contributors" },
                { value: "1,000+", label: "Enterprise Clients" },
                { value: "50M+", label: "Data Points" },
              ].map((stat, i, arr) => (
                <div key={stat.label} className="flex items-center gap-8">
                  <div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-8 bg-border" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative hidden lg:block">
            {/* Accent shape behind image */}
            <div
              className="absolute -top-6 -right-6 w-full h-full rounded-2xl"
              style={{ background: "var(--gradient-hero)", opacity: 0.08 }}
            />
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-border/50">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&auto=format&fit=crop&q=80"
                alt="Team collaborating on AI data projects"
                className="w-full h-[540px] object-cover"
                loading="eager"
              />
              {/* Subtle overlay to tie into site palette */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, hsl(25 95% 53% / 0.06) 0%, transparent 50%)",
                }}
              />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-5 -left-5 bg-background border border-border rounded-xl shadow-[var(--shadow-card)] px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Tasks completed today</p>
                <p className="text-xs text-muted-foreground">12,847 across 94 countries</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
