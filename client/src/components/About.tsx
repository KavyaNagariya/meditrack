import { Card } from "@/components/ui/card";
import { AlertTriangle, Target, Zap } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="bg-card py-20 md:py-24">
      <div className="container px-6 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl" data-testid="about-title">
              About CodeVeda
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground" data-testid="about-mission">
              Our mission is to provide advanced healthcare solutions that empower patients, doctors, and families with the tools they need to manage health effectively. We believe everyone deserves access to cutting-edge healthcare technology that's simple to adopt and proven to improve outcomes.
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
                Healthcare information is often fragmented, difficult to access, and not user-friendly. Patients struggle to manage their health data, doctors need better tools for patient monitoring, and families need easier ways to stay informed.
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
                A unified healthcare platform that integrates seamlessly with existing systems, providing real-time insights, automated alerts, and actionable intelligence for all stakeholders.
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
                No complex setup required. Import data via CSV or connect to your existing systems. Start improving healthcare outcomes within hours, not weeks.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}