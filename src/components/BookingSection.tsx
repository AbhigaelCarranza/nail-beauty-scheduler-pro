import { Calendar, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookingSection = () => {
  const steps = [
    {
      icon: Calendar,
      title: "Elige tu servicio",
      description: "Selecciona entre nuestros servicios premium"
    },
    {
      icon: Clock,
      title: "Selecciona fecha y hora",
      description: "Ve horarios disponibles en tiempo real"
    },
    {
      icon: CheckCircle,
      title: "Confirma tu cita",
      description: "Recibe confirmación instantánea"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              <span>Agenda Fácil</span>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Agenda tu cita</span><br />
              en 3 simples pasos
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              Nuestro sistema de agendamiento online está disponible 24/7. 
              Sin esperas, sin llamadas, solo selecciona y confirma.
            </p>

            {/* Steps */}
            <div className="space-y-6 mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="luxury" size="lg" className="text-lg px-8 py-4">
              <Calendar className="w-5 h-5 mr-3" />
              Comenzar Agendamiento
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>

          {/* Right Column - Booking Preview */}
          <div className="relative">
            {/* Phone Mockup */}
            <div className="card-luxury p-8 mx-auto max-w-sm animate-float">
              <div className="bg-primary/5 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <h3 className="font-heading text-xl font-semibold mb-2">
                  ¡Cita Confirmada!
                </h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Servicio:</strong> Manicure Gel</p>
                  <p><strong className="text-foreground">Fecha:</strong> 15 Jul, 2025</p>
                  <p><strong className="text-foreground">Hora:</strong> 2:00 PM</p>
                  <p><strong className="text-foreground">Total:</strong> $350 MXN</p>
                </div>
                
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-xs text-primary">
                    ✓ Confirmación enviada por correo
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-full animate-glow"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;