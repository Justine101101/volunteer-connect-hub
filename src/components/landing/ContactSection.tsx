import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground">Have questions? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              { icon: Mail, label: "Email", value: "hello@volunteerhub.org" },
              { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: MapPin, label: "Address", value: "123 Community St, Suite 100" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{label}</div>
                  <div className="text-sm text-muted-foreground">{value}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass-card p-6 space-y-4"
          >
            <Input placeholder="Your Name" required />
            <Input type="email" placeholder="Your Email" required />
            <Textarea placeholder="Your Message" rows={4} required />
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
