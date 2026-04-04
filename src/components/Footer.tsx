import { Heart, Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="container-narrow px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-xl mb-3">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <span className="gradient-text">VolunteerHub</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-sm">
            Empowering communities through volunteerism. Join us to make a difference in the world, one event at a time.
          </p>
          <div className="flex gap-3 mt-4">
            {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
              <a key={i} href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
          <div className="space-y-2">
            {["About", "Events", "Calendar", "Contact"].map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Get Involved</h4>
          <div className="space-y-2">
            <Link to="/join" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Become a Volunteer</Link>
            <Link to="/events" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Browse Events</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VolunteerHub. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
