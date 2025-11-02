import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function DemoForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
    message: "",
    acceptPrivacy: false,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demo request submitted:", formData);
    toast({
      title: "Demo request received!",
      description: "Our team will contact you within 24 hours to schedule your personalized demo.",
    });
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      organization: "",
      role: "",
      message: "",
      acceptPrivacy: false,
    });
  };

  return (
    <section id="demo" className="container px-6 py-20 md:px-8 md:py-24">
      <Card className="mx-auto max-w-2xl p-8 md:p-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight" data-testid="demo-title">
            Request a Demo
          </h2>
          <p className="mt-3 text-muted-foreground" data-testid="demo-subtitle">
            See how CodeVeda can transform your healthcare organization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName" data-testid="label-first-name">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                data-testid="input-first-name"
              />
            </div>
            <div>
              <Label htmlFor="lastName" data-testid="label-last-name">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                data-testid="input-last-name"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" data-testid="label-email">
              Work Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="organization" data-testid="label-organization">
              Organization
            </Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              required
              data-testid="input-organization"
            />
          </div>
          <div>
            <Label htmlFor="role" data-testid="label-role">
              Role
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              data-testid="input-role"
            />
          </div>
          <div>
            <Label htmlFor="message" data-testid="label-message">
              What would you like to see in the demo?
            </Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your specific needs and challenges..."
              data-testid="input-message"
            />
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptPrivacy"
              checked={formData.acceptPrivacy}
              onCheckedChange={(checked) => setFormData({ ...formData, acceptPrivacy: checked as boolean })}
              required
              data-testid="checkbox-privacy"
            />
            <Label htmlFor="acceptPrivacy" className="text-sm" data-testid="label-privacy">
              I consent to be contacted about CodeVeda and accept the Privacy Policy
            </Label>
          </div>
          <Button type="submit" className="w-full" data-testid="button-submit">
            Request Demo
          </Button>
        </form>
      </Card>
    </section>
  );
}