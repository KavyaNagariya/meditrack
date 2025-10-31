import { Card } from "@/components/ui/card";
import { Shield, Lock, Server, CheckCircle2 } from "lucide-react";

const stats = [
  { value: "73%", label: "Faster outbreak response time" },
  { value: "45%", label: "Reduction in cross-contamination" },
  { value: "60%", label: "Lower containment costs" },
];

const trustBadges = [
  { icon: Shield, label: "HIPAA-ready" },
  { icon: CheckCircle2, label: "Role-based access" },
  { icon: Lock, label: "256-bit encryption" },
  { icon: Server, label: "99.9% uptime" },
];

export default function Benefits() {
  return (
    <section className="bg-card py-20 md:py-24">
      <div className="container px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl" data-testid="benefits-title">
            Proven Results
          </h2>
          <p className="mt-4 text-lg text-muted-foreground" data-testid="benefits-subtitle">
            Trusted by leading hospitals to protect patients and staff
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-8 text-center" data-testid={`stat-card-${index}`}>
              <div className="text-5xl font-bold text-primary" data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground" data-testid={`stat-label-${index}`}>
                {stat.label}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 rounded-lg border p-6"
              data-testid={`trust-badge-${index}`}
            >
              <badge.icon className="h-8 w-8 text-primary" data-testid={`trust-icon-${index}`} />
              <span className="text-sm font-medium" data-testid={`trust-label-${index}`}>
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        <Card className="mx-auto mt-16 max-w-3xl border-l-4 border-l-primary p-8">
          <blockquote className="text-lg italic leading-relaxed" data-testid="testimonial-quote">
            "MediTrack Pro helped us identify and contain an MDR outbreak in under 4 hours. The contact tracing visualization made it immediately clear which patients and staff needed intervention."
          </blockquote>
          <div className="mt-4 flex items-center gap-4">
            <div>
              <p className="font-semibold" data-testid="testimonial-name">
                Dr. Sarah Chen
              </p>
              <p className="text-sm text-muted-foreground" data-testid="testimonial-title">
                Chief Infection Control Officer, Metro General Hospital
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
