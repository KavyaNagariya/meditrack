import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How quickly can we get started with CodeVeda?",
    answer: "Most healthcare organizations are up and running within 24-48 hours. You can start by uploading a CSV file of patient data, or we can help you integrate with your existing EHR system for real-time data sync.",
  },
  {
    question: "Is CodeVeda HIPAA compliant?",
    answer: "Yes, CodeVeda is fully HIPAA compliant with 256-bit encryption, role-based access controls, and comprehensive audit logs. We undergo regular security audits and maintain BAA agreements with all customers.",
  },
  {
    question: "What systems does CodeVeda integrate with?",
    answer: "We integrate with major EHR systems including Epic, Cerner, Meditech, and AllScripts. We also support direct lab system integration and can work with custom APIs. CSV import is available for any system.",
  },
  {
    question: "How does the contact tracing algorithm work?",
    answer: "Our algorithm tracks patient movements, room assignments, and proximity events to build a comprehensive contact network. When a positive result is detected, it automatically traces all potential exposures based on configurable time windows and distance thresholds.",
  },
  {
    question: "What kind of training and support do you provide?",
    answer: "All plans include comprehensive onboarding training. Professional and Enterprise plans include dedicated support with faster response times. Enterprise customers get a dedicated account manager and on-site training options.",
  },
  {
    question: "Can we try CodeVeda before committing?",
    answer: "Yes! We offer a 30-day pilot program where you can test CodeVeda with real data in your healthcare organization. Contact us to schedule a demo and discuss pilot program details.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="container px-6 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl" data-testid="faq-title">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground" data-testid="faq-subtitle">
            Everything you need to know about CodeVeda
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
              <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}