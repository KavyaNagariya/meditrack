import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast({
      title: "Message sent!",
      description: "Our team will contact you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="container px-6 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl" data-testid="contact-title">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-muted-foreground" data-testid="contact-subtitle">
            Have questions? Get in touch with our team.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" data-testid="label-name">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="input-name"
                />
              </div>
              <div>
                <Label htmlFor="email" data-testid="label-email">
                  Email
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
                <Label htmlFor="subject" data-testid="label-subject">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  data-testid="input-subject"
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
                  required
                  data-testid="input-message"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-submit">
                Send Message
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" data-testid="contact-icon-email" />
                </div>
                <div>
                  <h3 className="font-semibold" data-testid="contact-info-email-title">Email</h3>
                  <p className="mt-1 text-sm text-muted-foreground" data-testid="contact-info-email">
                    support@codeveda.com
                  </p>
                  <p className="text-xs text-muted-foreground">Mon-Fri 8am-6pm EST</p>
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
                    1-800-CODEVEDA
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
                    123 Innovation Plaza<br />
                    San Francisco, CA 94101
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}