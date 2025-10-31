import { Card } from "@/components/ui/card";
import { Upload, Activity, BellRing } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Connect systems or upload CSV",
    description: "Integrate with your existing EHR and lab systems, or quickly import patient data via CSV for immediate setup.",
  },
  {
    number: "02",
    icon: Activity,
    title: "Track movements and lab results",
    description: "Automatically monitor patient movements and lab results in real-time, building comprehensive contact networks.",
  },
  {
    number: "03",
    icon: BellRing,
    title: "Receive alerts, act with protocols",
    description: "Get instant notifications when risks are detected and follow built-in protocols to contain outbreaks quickly.",
  },
];

export default function HowItWorks() {
  return (
    <section className="container px-6 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl" data-testid="how-it-works-title">
          How It Works
        </h2>
        <p className="mt-4 text-lg text-muted-foreground" data-testid="how-it-works-subtitle">
          Get started in three simple steps
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={index} className="relative" data-testid={`step-${index}`}>
            <Card className="p-8">
              <div className="mb-4 text-6xl font-bold text-primary/10" data-testid={`step-number-${index}`}>
                {step.number}
              </div>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" data-testid={`step-icon-${index}`} />
              </div>
              <h3 className="text-xl font-semibold" data-testid={`step-title-${index}`}>
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground" data-testid={`step-description-${index}`}>
                {step.description}
              </p>
            </Card>
            {index < steps.length - 1 && (
              <div className="absolute right-0 top-1/2 hidden h-px w-8 -translate-y-1/2 translate-x-full border-t-2 border-dashed border-border md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
