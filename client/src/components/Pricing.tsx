import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$2,499",
    period: "per month",
    description: "Perfect for small healthcare facilities and clinics",
    features: [
      "Up to 100 beds",
      "Real-time contact tracing",
      "Basic dashboard",
      "Email support",
      "CSV import",
    ],
  },
  {
    name: "Professional",
    price: "$4,999",
    period: "per month",
    description: "For mid-size healthcare facilities",
    features: [
      "Up to 500 beds",
      "Advanced analytics",
      "Ward heatmaps",
      "EHR integration",
      "Priority phone support",
      "Custom alerts",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large healthcare organizations",
    features: [
      "Unlimited beds",
      "Multi-facility support",
      "Dedicated account manager",
      "Custom integrations",
      "24/7 phone support",
      "On-site training",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-card py-20 md:py-24">
      <div className="container px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl" data-testid="pricing-title">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground" data-testid="pricing-subtitle">
            Choose the plan that fits your healthcare organization's needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 ${plan.popular ? "border-primary shadow-lg" : ""}`}
              data-testid={`pricing-card-${index}`}
            >
              {plan.popular && (
                <div className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground" data-testid="pricing-badge-popular">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold" data-testid={`pricing-name-${index}`}>
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold" data-testid={`pricing-price-${index}`}>
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground" data-testid={`pricing-period-${index}`}>
                  {plan.period}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground" data-testid={`pricing-description-${index}`}>
                {plan.description}
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3" data-testid={`pricing-feature-${index}-${featureIndex}`}>
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full" variant={plan.popular ? "default" : "outline"} data-testid={`button-pricing-${index}`}>
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}