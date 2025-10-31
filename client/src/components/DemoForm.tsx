import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function DemoForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    hospital: "",
    beds: "",
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
      email: "",
      hospital: "",
      beds: "",
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
            See how MediTrack Pro can protect your hospital
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="firstName" data-testid="label-first-name">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="mt-2"
              data-testid="input-first-name"
            />
          </div>

          <div>
            <Label htmlFor="email" data-testid="label-email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-2"
              data-testid="input-email"
            />
          </div>

          <div>
            <Label htmlFor="hospital" data-testid="label-hospital">
              Hospital Name
            </Label>
            <Input
              id="hospital"
              type="text"
              required
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              className="mt-2"
              data-testid="input-hospital"
            />
          </div>

          <div>
            <Label htmlFor="beds" data-testid="label-beds">
              Number of Beds
            </Label>
            <Select value={formData.beds} onValueChange={(value) => setFormData({ ...formData, beds: value })}>
              <SelectTrigger className="mt-2" data-testid="select-beds">
                <SelectValue placeholder="Select bed count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<100" data-testid="select-option-0">
                  Less than 100
                </SelectItem>
                <SelectItem value="100-300" data-testid="select-option-1">
                  100–300
                </SelectItem>
                <SelectItem value="300-500" data-testid="select-option-2">
                  300–500
                </SelectItem>
                <SelectItem value="500+" data-testid="select-option-3">
                  500+
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="privacy"
              checked={formData.acceptPrivacy}
              onCheckedChange={(checked) => setFormData({ ...formData, acceptPrivacy: checked as boolean })}
              data-testid="checkbox-privacy"
            />
            <Label htmlFor="privacy" className="text-sm leading-relaxed" data-testid="label-privacy">
              I agree to the{" "}
              <a href="#privacy" className="text-primary underline">
                Privacy Policy
              </a>{" "}
              and consent to be contacted about MediTrack Pro
            </Label>
          </div>

          <Button type="submit" className="w-full md:w-auto md:px-12" disabled={!formData.acceptPrivacy} data-testid="button-submit-demo">
            Schedule My Demo
          </Button>
        </form>
      </Card>
    </section>
  );
}
