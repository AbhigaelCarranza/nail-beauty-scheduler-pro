import { Calendar, Star, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-salon.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-20 flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Salón de belleza elegante" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-float">
            <Star className="w-4 h-4 fill-current" />
            <span>Salón #1 en Hermosillo</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Belleza</span><br />
            <span className="text-foreground">que inspira</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Agenda tu cita de manicure, pedicure y diseño de uñas en segundos. 
            Disponible 24/7 con confirmación instantánea.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="luxury" size="lg" className="text-lg px-8 py-6">
              <Calendar className="w-5 h-5 mr-3" />
              Agendar Cita Ahora
            </Button>
            <Button variant="elegant" size="lg" className="text-lg px-8 py-6">
              Ver Servicios
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="card-luxury p-4">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gradient">1200+</div>
              <div className="text-sm text-muted-foreground">Clientas felices</div>
            </div>
            <div className="card-luxury p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gradient">4.9</div>
              <div className="text-sm text-muted-foreground">Calificación</div>
            </div>
            <div className="card-luxury p-4">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gradient">24/7</div>
              <div className="text-sm text-muted-foreground">Disponible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-primary/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-accent/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
    </section>
  );
};

export default Hero;