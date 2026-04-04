import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const JoinUs = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Application submitted!", description: "We'll review your application shortly." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 section-padding">
        <div className="container-narrow max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Join Our Team</h1>
            <p className="text-muted-foreground">Fill out the form below to become a volunteer.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit}
            className="glass-card p-6 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="First Name" required />
              <Input placeholder="Last Name" required />
            </div>
            <Input type="email" placeholder="Email Address" required />
            <Input type="tel" placeholder="Phone Number" />
            <Input placeholder="City / Location" />
            <Textarea placeholder="Why do you want to volunteer? (optional)" rows={3} />
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"} <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JoinUs;
