import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Activity } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" data-testid="logo-icon" />
          <span className="text-xl font-bold tracking-tight" data-testid="logo-text">
            MediTrack Pro
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => scrollToSection("home")}
            className="text-sm font-medium hover-elevate rounded-md px-3 py-2"
            data-testid="nav-home"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-sm font-medium hover-elevate rounded-md px-3 py-2"
            data-testid="nav-about"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm font-medium hover-elevate rounded-md px-3 py-2"
            data-testid="nav-contact"
          >
            Contact Us
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-medium hover-elevate rounded-md px-3 py-2"
            data-testid="nav-pricing"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium hover-elevate rounded-md px-3 py-2"
            data-testid="nav-faq"
          >
            FAQ
          </button>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button variant="outline" data-testid="button-login">
            Login
          </Button>
          <Button data-testid="button-signup">Sign Up</Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden" data-testid="mobile-menu">
          <nav className="container flex flex-col gap-4 px-6 py-6">
            <button
              onClick={() => scrollToSection("home")}
              className="text-left text-sm font-medium hover-elevate rounded-md px-3 py-2"
              data-testid="nav-mobile-home"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-left text-sm font-medium hover-elevate rounded-md px-3 py-2"
              data-testid="nav-mobile-about"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-left text-sm font-medium hover-elevate rounded-md px-3 py-2"
              data-testid="nav-mobile-contact"
            >
              Contact Us
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-left text-sm font-medium hover-elevate rounded-md px-3 py-2"
              data-testid="nav-mobile-pricing"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-left text-sm font-medium hover-elevate rounded-md px-3 py-2"
              data-testid="nav-mobile-faq"
            >
              FAQ
            </button>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" className="w-full" data-testid="button-mobile-login">
                Login
              </Button>
              <Button className="w-full" data-testid="button-mobile-signup">
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
