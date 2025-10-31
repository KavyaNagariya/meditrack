import { Card } from "@/components/ui/card";
import { MapPin, Bell, Network, Database, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Real-time patient movement tracking",
    description: "Monitor patient locations and movements across your facility in real-time for comprehensive contact mapping.",
  },
  {
    icon: Bell,
    title: "Instant exposure-chain alerts",
    description: "Receive automated notifications when potential exposure events are detected, with configurable risk thresholds.",
  },
  {
    icon: Network,
    title: "Contact tracing network visualization",
    description: "Visualize complex contact chains with intuitive network graphs showing exposure pathways and risk levels.",
  },
  {
    icon: Database,
    title: "EHR/Lab-friendly integration",
    description: "Seamlessly integrate with existing hospital systems and lab results for automated MDR detection.",
  },
  {
    icon: BarChart3,
    title: "Infection-control dashboard with ward heatmaps",
    description: "View comprehensive analytics and visual heatmaps showing risk distribution across hospital wards.",
  },
  {
    icon: Shield,
    title: "Role-based access and audit logs",
    description: "Enterprise-grade security with granular access controls and complete audit trails for compliance.",
  },
];

export default function Features() {
  return (
    <section className="bg-card py-20 md:py-24">
      <div className="container px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl" data-testid="features-title">
            Key Features
          </h2>
          <p className="mt-4 text-lg text-muted-foreground" data-testid="features-subtitle">
            Everything you need to detect, trace, and contain MDR outbreaks in real-time.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="p-6" data-testid={`feature-card-${index}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" data-testid={`feature-icon-${index}`} />
              </div>
              <h3 className="mt-4 text-xl font-semibold" data-testid={`feature-title-${index}`}>
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid={`feature-description-${index}`}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
