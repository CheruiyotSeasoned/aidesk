import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import { useEffect, useState } from "react";
import logo from "@/assets/main-logo.png";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Earn Money", href: "#contributors" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Enterprise", href: "#enterprise" },
];

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("login") === "1") setLoginOpen(true);
  }, [location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/?login=1");
    setLoginOpen(true);
    setMobileOpen(false);
  };

  const handleDashboard = () => {
    if (user) navigate("/dashboard");
    else setLoginOpen(true);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center shrink-0 focus:outline-none"
            >
              <img
                src={logo}
                alt="Aidesk"
                className="h-9 w-auto object-contain"
                loading="eager"
              />
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-md hover:bg-muted/60 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => navigate("/dashboard")}
                  >
                    <User className="h-4 w-4 mr-1.5" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setLoginOpen(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 font-semibold shadow-none"
                    onClick={handleDashboard}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-border my-2" />
              {user ? (
                <>
                  <button
                    onClick={handleDashboard}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-md transition-colors"
                  >
                    <User className="h-4 w-4" /> Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                    className="px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-md transition-colors text-left"
                  >
                    Sign In
                  </button>
                  <Button
                    className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-none"
                    onClick={handleDashboard}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};
