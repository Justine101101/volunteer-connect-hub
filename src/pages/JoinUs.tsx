import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const JoinUs = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 section-padding">
        <div className="container-narrow max-w-xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold mb-3">Join Our Volunteer Team</h1>
            <p className="text-muted-foreground mb-8">
              Create your account to browse events, manage your participation, and connect with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="gap-2" onClick={() => navigate("/auth", { state: { mode: "signup" } })}>
                Sign Up <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Already a member? Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JoinUs;
