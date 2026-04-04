import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="section-padding">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl p-10 md:p-16 text-center"
        style={{ backgroundImage: "var(--hero-gradient)" }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
          Join thousands of volunteers and start making an impact in your community today.
        </p>
        <Link to="/join">
          <Button size="lg" variant="secondary" className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
