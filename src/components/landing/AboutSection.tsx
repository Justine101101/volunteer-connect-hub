import { Target, Lightbulb, HandHeart } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  { icon: Target, title: "Our Mission", desc: "To connect passionate individuals with meaningful volunteer opportunities that strengthen communities." },
  { icon: Lightbulb, title: "Our Vision", desc: "A world where every person has the opportunity to contribute to positive social change." },
  { icon: HandHeart, title: "Our Values", desc: "Compassion, integrity, inclusivity, and collaboration guide everything we do." },
];

const AboutSection = () => (
  <section id="about" className="section-padding bg-muted/30">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
          About <span className="gradient-text">VolunteerHub</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We believe in the power of community. Our platform bridges the gap between people who want to help and organizations that need volunteers.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6">
        {values.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-card p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
