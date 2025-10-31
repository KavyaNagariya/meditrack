import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hospital: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      hospital: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="container px-6 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl" data-testid="contact-title">
          Contact Us
        </h2>
        <p className="mt-4 text-lg text-muted-foreground" data-testid="contact-subtitle">
          Have questions? We're here to help.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" data-testid="label-name">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                  data-testid="input-name"
                />
              </div>

              <div>
                <Label htmlFor="contact-email" data-testid="label-contact-email">
                  Email
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2"
                  data-testid="input-contact-email"
                />
              </div>

              <div>
                <Label htmlFor="contact-hospital" data-testid="label-contact-hospital">
                  Hospital Name
                </Label>
                <Input
                  id="contact-hospital"
                  type="text"
                  required
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="mt-2"
                  data-testid="input-contact-hospital"
                />
              </div>

              <div>
                <Label htmlFor="message" data-testid="label-message">
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-2"
                  data-testid="textarea-message"
                />
              </div>

              <Button type="submit" className="w-full md:w-auto md:px-12" data-testid="button-submit-contact">
                Send Message
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" data-testid="contact-icon-email" />
              </div>
              <div>
                <h3 className="font-semibold" data-testid="contact-info-email-title">Email</h3>
                <p className="mt-1 text-sm text-muted-foreground" data-testid="contact-info-email">
                  support@meditrackpro.com
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" data-testid="contact-icon-phone" />
              </div>
              <div>
                <h3 className="font-semibold" data-testid="contact-info-phone-title">Phone</h3>
                <p className="mt-1 text-sm text-muted-foreground" data-testid="contact-info-phone">
                  1-800-MEDITRACK
                </p>
                <p className="text-xs text-muted-foreground">Mon-Fri 8am-6pm EST</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" data-testid="contact-icon-address" />
              </div>
              <div>
                <h3 className="font-semibold" data-testid="contact-info-address-title">Address</h3>
                <p className="mt-1 text-sm text-muted-foreground" data-testid="contact-info-address">
                  123 Healthcare Plaza<br />
                  Boston, MA 02101
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
