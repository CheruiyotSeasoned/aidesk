import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import { useEffect, useState } from "react";
import logo from "@/assets/main-logo.png";
import { useLocation, useNavigate } from "react-router-dom";

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-open login dialog if ?login=1 is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("login") === "1") {
      setLoginOpen(true);
    }
  }, [location.search]);

  const handleLogout = async () => {
    await logout();
    navigate("/?login=1");
    setLoginOpen(true);
    setMobileOpen(false);
  };

  const handleDashboard = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setLoginOpen(true);
    }
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background with tech wave theme */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-indigo-900/30"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Aidesk Logo"
              className="h-10 w-36 object-contain" // increased height & width
            />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#solutions" className="text-white/90 hover:text-white transition-colors">Solutions</a>
            <a href="#contributors" className="text-white/90 hover:text-white transition-colors">Earn Money</a>
            <a href="#how-it-works" className="text-white/90 hover:text-white transition-colors">How It Works</a>
            <a href="#enterprise" className="text-white/90 hover:text-white transition-colors">Enterprise</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate("/dashboard")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => setLoginOpen(true)}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  className="bg-white text-black hover:bg-white/90"
                  onClick={handleDashboard}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
        <div className="relative container mx-auto px-4 pb-4">
          <div className="mt-2 rounded-lg border border-white/10 bg-black/70 backdrop-blur-md shadow-lg">
            <div className="flex flex-col p-4 gap-3">
              <a href="#solutions" className="text-white/90 hover:text-white" onClick={() => setMobileOpen(false)}>Solutions</a>
              <a href="#contributors" className="text-white/90 hover:text-white" onClick={() => setMobileOpen(false)}>Earn Money</a>
              <a href="#how-it-works" className="text-white/90 hover:text-white" onClick={() => setMobileOpen(false)}>How It Works</a>
              <a href="#enterprise" className="text-white/90 hover:text-white" onClick={() => setMobileOpen(false)}>Enterprise</a>
              <div className="h-px bg-white/10 my-2"></div>
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start text-white hover:bg-white/10"
                    onClick={handleDashboard}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-white hover:bg-white/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start text-white hover:bg-white/10"
                    onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    className="justify-center bg-white text-black hover:bg-white/90"
                    onClick={handleDashboard}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </nav>
  );
};
