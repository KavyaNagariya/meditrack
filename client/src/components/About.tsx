import { Card } from "@/components/ui/card";
import { AlertTriangle, Target, Zap } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="bg-card py-20 md:py-24">
      <div className="container px-6 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl" data-testid="about-title">
              About MediTrack Pro
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground" data-testid="about-mission">
              Our mission is to give hospitals the tools they need to detect and contain multi-drug resistant outbreaks before they spread. We believe every hospital deserves enterprise-grade infection control technology that's simple to adopt and proven to save lives.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" data-testid="about-icon-problem" />
              </div>
              <h3 className="mt-4 text-lg font-semibold" data-testid="about-problem-title">
                The Problem
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid="about-problem-text">
                MDR organisms pose an escalating threat to patient safety. Traditional manual contact tracing is too slow to prevent hospital outbreaks.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" data-testid="about-icon-solution" />
              </div>
              <h3 className="mt-4 text-lg font-semibold" data-testid="about-solution-title">
                Our Solution
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid="about-solution-text">
                Real-time automated contact tracing that integrates seamlessly with your existing systems, providing instant alerts and actionable insights.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" data-testid="about-icon-adoption" />
              </div>
              <h3 className="mt-4 text-lg font-semibold" data-testid="about-adoption-title">
                Simple Adoption
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid="about-adoption-text">
                No complex setup required. Import data via CSV or connect to your EHR. Start protecting patients within hours, not weeks.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
