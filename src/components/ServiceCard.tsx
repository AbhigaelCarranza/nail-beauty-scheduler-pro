import { Clock, Star, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Service, useCart } from "@/hooks/useCart";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const { addToCart, removeFromCart, isInCart, items } = useCart();
  const cartItem = items.find(item => item.service.id === service.id);
  const quantity = cartItem?.quantity || 0;
  const inCart = isInCart(service.id);

  const handleAddToCart = () => {
    addToCart(service);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(service.id);
  };

  return (
    <div className="card-luxury group cursor-pointer relative overflow-hidden">
      {/* Service Image */}
      <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
        {service.image_url ? (
          <img 
            src={service.image_url} 
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
            <Star className="w-16 h-16 text-primary-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Quantity Badge */}
        {quantity > 0 && (
          <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            {quantity}
          </div>
        )}
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
            <span>{service.duration_minutes} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span>4.9</span>
          </div>
        </div>

        {/* Add to Cart Controls */}
        <div className="space-y-3">
          {!inCart ? (
            <Button 
              variant="elegant" 
              className="w-full transition-all duration-300 group-hover:bg-gradient-primary group-hover:text-primary-foreground"
              onClick={handleAddToCart}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar al Carrito
            </Button>
          ) : (
            <>
              <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFromCart}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center space-x-2 text-primary font-semibold">
                  <Check className="w-4 h-4" />
                  <span>{quantity} en carrito</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddToCart}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;