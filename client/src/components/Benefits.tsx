import { Card } from "@/components/ui/card";
import { Shield, Lock, Server, CheckCircle2 } from "lucide-react";

const stats = [
  { value: "85%", label: "Faster health data access" },
  { value: "60%", label: "Reduction in healthcare costs" },
  { value: "95%", label: "User satisfaction rate" },
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
            Trusted by leading healthcare providers to improve patient outcomes
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-8 text-center" data-testid={`stat-card-${index}`}>
              <div className="text-5xl font-bold text-primary" data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="mt-2 text-muted-foreground" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-center text-xl font-semibold" data-testid="benefits-trust-title">
            Built with security and compliance in mind
          </h3>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2" data-testid={`trust-badge-${index}`}>
                <badge.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-xl bg-muted p-8 text-center">
          <blockquote className="text-lg italic text-muted-foreground" data-testid="benefits-testimonial">
            "CodeVeda helped us streamline patient care and improve communication between doctors and families. The unified dashboard made it immediately clear which patients needed attention and how to provide it."
          </blockquote>
          <div className="mt-6">
            <div className="font-semibold" data-testid="benefits-testimonial-author">
              Dr. Sarah Johnson
            </div>
            <div className="text-sm text-muted-foreground" data-testid="benefits-testimonial-title">
              Chief Medical Officer, General Hospital
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}