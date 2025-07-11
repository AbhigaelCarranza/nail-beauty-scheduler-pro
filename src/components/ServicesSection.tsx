import { Clock, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import manicureImg from "@/assets/service-manicure.jpg";
import pedicureImg from "@/assets/service-pedicure.jpg";
import nailArtImg from "@/assets/service-nail-art.jpg";

const services = [
  {
    id: 1,
    name: "Manicure con Gel",
    description: "Manicure completa con esmalte gel de larga duración. Incluye limado, cuidado de cutícula y esmaltado perfecto.",
    price: 350,
    duration: 60,
    image: manicureImg,
    popular: true
  },
  {
    id: 2,
    name: "Pedicure Spa",
    description: "Pedicure relajante con exfoliación, masaje y esmalte gel. Incluye tratamiento hidratante para pies suaves.",
    price: 450,
    duration: 90,
    image: pedicureImg,
    popular: false
  },
  {
    id: 3,
    name: "Diseño de Arte",
    description: "Diseños únicos y personalizados para tus uñas. Desde francesas elegantes hasta arte contemporáneo.",
    price: 200,
    duration: 45,
    image: nailArtImg,
    popular: true
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Servicios Premium</span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Servicios</span> que amarás
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experimenta la excelencia en cada detalle. Nuestros servicios están diseñados 
            para brindarte la mejor experiencia de belleza.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="card-luxury group cursor-pointer relative overflow-hidden">
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
              )}

              {/* Service Image */}
              <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Service Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-heading text-2xl font-semibold">{service.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${service.price}</div>
                    <div className="text-sm text-muted-foreground">MXN</div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>4.9</span>
                  </div>
                </div>

                <Button variant="elegant" className="w-full transition-all duration-300 group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Servicio
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="luxury" size="lg" className="text-lg px-8 py-4">
            Ver Todos los Servicios
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;