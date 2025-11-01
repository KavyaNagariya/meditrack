import { Button } from "@/components/ui/button";
import dashboardImage from "@assets/generated_images/Hospital_contact_tracing_dashboard_3c51ffd1.png";
import { useLocation } from "wouter";

export default function Hero() {
  const [, navigate] = useLocation();

  return (
    <section id="home" className="container px-6 py-20 md:px-8 md:py-24">
      <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="flex flex-col justify-center lg:col-span-3">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl" data-testid="hero-headline">
            Stop outbreaks before they start.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl" data-testid="hero-subheadline">
            Real-time MDR contact tracing, automated risk alerts, and a unified infection-control dashboard for hospitals.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:hidden">
            <Button variant="outline" data-testid="button-hero-login" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button data-testid="button-hero-signup" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        </div>

        <div className="flex items-center lg:col-span-2">
          <div className="relative w-full">
            <img
              src={dashboardImage}
              alt="MediTrack Pro dashboard showing real-time contact tracing network with exposure chains and risk alerts"
              className="w-full rounded-xl shadow-2xl"
              data-testid="hero-dashboard-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}