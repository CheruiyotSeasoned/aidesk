import { Button } from "@/components/ui/button";
import { CheckCircle2, Play, Users, Building2, Zap } from "lucide-react";
import { AvailableTasksDialog } from "@/components/AvailableTasksDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo.png"; // ✅ your logo
import heroFallback from "@/assets/hero-fallback.png";

export const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleEnterpriseClick = () => {
    const section = document.getElementById("enterprise");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleWatchDemo = () => {
    const section = document.getElementById("demo");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black text-white">
      {/* ✅ Fallback image (visible before video loads) */}
      <img
        src={heroFallback}
        alt="Hero background fallback"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-0" : "opacity-100"
        }`}
        loading="eager"
      />

      {/* ✅ Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadedData={() => setVideoLoaded(true)}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ✅ Instant-loading logo */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <img
          src={logo}
          alt="Aidesk Logo"
          className="w-16 h-16 object-contain"
          loading="eager"
        />
      </div>

      {/* ✅ Hero content */}
      <div className="relative z-20 w-full pt-16 pb-16 sm:pt-20 sm:pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-6 sm:space-y-8 max-w-4xl">
              
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 backdrop-blur-md">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold text-sm">
                  🚀 Live Platform – Join 500K+ Contributors
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                Your One-Stop Partner for{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Excellence
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                <strong>For Enterprises:</strong> Build, train, and deploy AI models
                with the world’s largest high-quality skill network.
                <br />
                <strong>For Contributors:</strong> Earn competitive pay working on
                meaningful AI projects from anywhere.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>Data labeling & collection at enterprise scale</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>Global talent network with verified expertise</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>End-to-end AI development lifecycle support</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4">
                <AvailableTasksDialog />

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 shadow-lg"
                  onClick={handleEnterpriseClick}
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Enterprise Solutions
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm"
                  onClick={handleWatchDemo}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-blue-400" />
                    <p className="text-3xl font-bold">500K+</p>
                  </div>
                  <p className="text-sm text-white/70">Global Contributors</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-white/30"></div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Building2 className="h-5 w-5 text-purple-400" />
                    <p className="text-3xl font-bold">1000+</p>
                  </div>
                  <p className="text-sm text-white/70">Enterprise Clients</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-white/30"></div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="h-5 w-5 text-green-400" />
                    <p className="text-3xl font-bold">50M+</p>
                  </div>
                  <p className="text-sm text-white/70">Data Points Processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
