import logo from "@/assets/logo.png";
export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <img
                src={logo}
                alt="Aidesk Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Building the world's largest high-quality skill network to power enterprise AI.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Contributors</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Start Earning</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Payment Options</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Data Labeling</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Collection</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Product Testing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Localization</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Enterprise</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Request Demo</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security & Compliance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Sales</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 AIDESK SPACE. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>🌍 Global Coverage</span>
            <span>|</span>
            <span>190+ Countries</span>
            <span>|</span>
            <span>500K+ Contributors</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
