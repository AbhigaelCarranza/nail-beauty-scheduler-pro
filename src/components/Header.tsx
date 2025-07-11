import { Calendar, Phone, MapPin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="font-heading text-xl font-semibold text-gradient">
                Bella Nails
              </h1>
              <p className="text-xs text-muted-foreground">Salón de Belleza</p>
            </div>
          </div>

          {/* Contact Info - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>(662) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Centro de Hermosillo</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-3">
            <Button variant="luxury" className="hidden sm:flex">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Cita
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;