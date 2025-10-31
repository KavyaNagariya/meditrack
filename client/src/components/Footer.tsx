import { Activity } from "lucide-react";
import { SiLinkedin, SiX, SiFacebook } from "react-icons/si";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t bg-card">
      <div className="container px-6 py-12 md:px-8 md:py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <Activity className="h-7 w-7 text-primary" data-testid="footer-logo-icon" />
              <span className="text-lg font-bold" data-testid="footer-logo-text">
                MediTrack Pro
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground" data-testid="footer-tagline">
              Real-time MDR contact tracing for safer hospitals.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="hover-elevate rounded-md p-2" data-testid="social-linkedin">
                <SiLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover-elevate rounded-md p-2" data-testid="social-twitter">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="hover-elevate rounded-md p-2" data-testid="social-facebook">
                <SiFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold" data-testid="footer-heading-product">
              Product
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <button onClick={() => scrollToSection("home")} className="hover-elevate rounded-md px-1 text-muted-foreground" data-testid="footer-link-features">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("faq")} className="hover-elevate rounded-md px-1 text-muted-foreground" data-testid="footer-link-faq">
                  FAQ
                </button>
              </li>
              <li>
                <a href="#security" className="hover-elevate rounded-md px-1 text-muted-foreground" data-testid="footer-link-security">
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold" data-testid="footer-heading-company">
              Company
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <button onClick={() => scrollToSection("about")} className="hover-elevate rounded-md px-1 text-muted-foreground" data-testid="footer-link-about">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("contact")} className="hover-elevate rounded-md px-1 text-muted-foreground" data-testid="footer-link-contact">
                  Contact
                </button>
              </li>
              <li>
                <a href="#privacy" className="hover-elevate rounded-md px-1 text-muted-foreground" data-testid="footer-link-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover-elevate rounded-md px-1 text-muted-foreground" data-testid="footer-link-terms">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold" data-testid="footer-heading-contact">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li data-testid="footer-contact-email">support@meditrackpro.com</li>
              <li data-testid="footer-contact-phone">1-800-MEDITRACK</li>
              <li data-testid="footer-contact-address">
                123 Healthcare Plaza<br />
                Boston, MA 02101
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p data-testid="footer-copyright">
              © 2025 MediTrack Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <select className="rounded-md border bg-background px-3 py-1.5 text-sm" data-testid="footer-language-selector">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
