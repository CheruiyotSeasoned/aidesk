import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Play, Users, Building2, Zap } from "lucide-react";
import { AvailableTasksDialog } from "@/components/AvailableTasksDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnterpriseClick = () => {
    // Scroll to enterprise section or open contact form
    const enterpriseSection = document.getElementById('enterprise');
    if (enterpriseSection) {
      enterpriseSection.scrollIntoView({ behavior: 'smooth' });
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video/GIF Container */}
      <div className="absolute inset-0 z-0">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <img 
            src="/hero-bg.gif" 
            alt="AI Background" 
            className="w-full h-full object-cover"
          />
        </video>
        
        {/* Advanced Tech Wave Background */}
        <div className="w-full h-full relative overflow-hidden">
          {/* Base gradient background */}
          <div className="tech-wave"></div>
          
          {/* Wave layers */}
          <div className="wave-layer wave1"></div>
          <div className="wave-layer wave2"></div>
          <div className="wave-layer wave3"></div>
          
          {/* Data particles */}
          <div className="data-particle particle1"></div>
          <div className="data-particle particle2"></div>
          <div className="data-particle particle3"></div>
          <div className="data-particle particle4"></div>
          <div className="data-particle particle5"></div>
        </div>
        
        {/* Translucent Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/30 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pt-16 pb-16 sm:pt-20 sm:pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-6 sm:space-y-8 text-white max-w-4xl">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-xs sm:text-sm">🚀 Live Platform - Join 500K+ Contributors</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Your One-Stop Partner for
                <span className="bg-gradient-hero bg-clip-text text-transparent"> AI Excellence</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto px-4">
                <strong>For Enterprises:</strong> Build, train, and deploy AI models with the world's largest high-quality skill network.<br/>
                <strong>For Contributors:</strong> Earn competitive pay working on meaningful AI projects from anywhere.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto px-4">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-white">Data labeling & collection at enterprise scale</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-white">Global talent network with verified expertise</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span className="text-white">End-to-end AI development lifecycle support</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <AvailableTasksDialog />
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-sm sm:text-base bg-white text-black hover:bg-white/90 shadow-lg"
                  onClick={handleEnterpriseClick}
                >
                  <Building2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Enterprise Solutions
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-sm sm:text-base text-white border-white/20 hover:bg-white/10 backdrop-blur-sm"
                  onClick={handleWatchDemo}
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-4 px-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                    <p className="text-2xl sm:text-3xl font-bold text-white">500K+</p>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70">Global Contributors</p>
                </div>
                <div className="hidden sm:block w-px h-8 sm:h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    <p className="text-2xl sm:text-3xl font-bold text-white">1000+</p>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70">Enterprise Clients</p>
                </div>
                <div className="hidden sm:block w-px h-8 sm:h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    <p className="text-2xl sm:text-3xl font-bold text-white">50M+</p>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70">Data Points Processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
