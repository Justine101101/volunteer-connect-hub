import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, label: "Volunteers", value: "2,500+" },
  { icon: Calendar, label: "Events Hosted", value: "350+" },
  { icon: MapPin, label: "Communities", value: "40+" },
];

const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
    <div className="container-narrow px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Making a difference together
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Empower Change,{" "}
          <span className="gradient-text">Volunteer Today</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          Connect with meaningful causes, join impactful events, and become part
          of a community dedicated to positive change.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/join">
            <Button size="lg" className="gap-2">
              Join as Volunteer <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/events">
            <Button size="lg" variant="outline">
              Browse Events
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="grid grid-cols-3 gap-4 mt-16 max-w-lg"
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass-card p-4 text-center">
            <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="font-bold text-xl">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
