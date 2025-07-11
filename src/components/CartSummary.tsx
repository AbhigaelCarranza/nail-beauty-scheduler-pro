import { ShoppingCart, Clock, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CartSummaryProps {
  className?: string;
}

const CartSummary = ({ className = "" }: CartSummaryProps) => {
  const { items, getTotalPrice, getTotalDuration, getItemCount, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Card className={`${className} card-luxury`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Tu Carrito</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
          <p className="text-sm text-muted-foreground">
            Agrega servicios para comenzar tu cita
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalPrice = getTotalPrice();
  const totalDuration = getTotalDuration();
  const itemCount = getItemCount();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  return (
    <Card className={`${className} card-luxury sticky top-24`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Tu Carrito ({itemCount})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-muted-foreground hover:text-destructive"
          >
            Limpiar
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.service.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.service.name}</h4>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                  <span>${item.service.price} MXN</span>
                  <span>•</span>
                  <span>{item.service.duration_minutes} min</span>
                  {item.quantity > 1 && (
                    <>
                      <span>•</span>
                      <span>x{item.quantity}</span>
                    </>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromCart(item.service.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Duración total:</span>
            </div>
            <span className="font-medium">{formatDuration(totalDuration)}</span>
          </div>
          
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">${totalPrice.toLocaleString()} MXN</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button 
          variant="luxury" 
          className="w-full text-base py-6"
          disabled={items.length === 0}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Elegir Horario
        </Button>

        {/* Info */}
        <div className="bg-primary/10 rounded-lg p-3">
          <p className="text-xs text-primary text-center">
            ✓ Confirmación instantánea
            <br />
            ✓ Recordatorios automáticos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;