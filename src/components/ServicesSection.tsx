import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/useServices";
import { useCart } from "@/hooks/useCart";
import ServiceCard from "./ServiceCard";
import CartSummary from "./CartSummary";

const ServicesSection = () => {
  const { services, loading, error } = useServices();
  const { getItemCount } = useCart();

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
              <div className="h-12 bg-muted rounded w-96 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 bg-muted rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">Error loading services: {error}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

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

        {/* Services and Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Services Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            
            {services.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No hay servicios disponibles en este momento.</p>
              </div>
            )}
          </div>

          {/* Cart Summary - Desktop */}
          <div className="hidden lg:block">
            <CartSummary />
          </div>
        </div>

        {/* Cart Summary - Mobile (Fixed Bottom) */}
        {getItemCount() > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-4">
            <CartSummary className="shadow-lg" />
          </div>
        )}

        {/* View All Button */}
        {services.length > 6 && (
          <div className="text-center mt-12">
            <Button variant="luxury" size="lg" className="text-lg px-8 py-4">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ver Todos los Servicios
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;