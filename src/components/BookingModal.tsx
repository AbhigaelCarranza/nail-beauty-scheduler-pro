import { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import DateTimePicker from "./DateTimePicker";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  children: React.ReactNode;
}

const BookingModal = ({ children }: BookingModalProps) => {
  const { items, getTotalPrice, getTotalDuration, clearCart } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: DateTime, 2: ClientInfo, 3: Confirmation
  
  // Form data
  const [selectedDateTime, setSelectedDateTime] = useState<{date: Date, time: string} | null>(null);
  const [clientData, setClientData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    notes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDateTime({ date, time });
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientData.name || !clientData.whatsapp) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa nombre y WhatsApp",
        variant: "destructive"
      });
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para guardar en Supabase
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación
      
      toast({
        title: "¡Cita agendada exitosamente!",
        description: "Te enviaremos un WhatsApp con la confirmación",
      });
      
      // Reset everything
      clearCart();
      setStep(1);
      setSelectedDateTime(null);
      setClientData({ name: "", whatsapp: "", email: "", notes: "" });
      setIsOpen(false);
      
    } catch (error) {
      toast({
        title: "Error al agendar",
        description: "Hubo un problema. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  if (items.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Agendar Cita</span>
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Selecciona fecha y hora</h3>
              <DateTimePicker onDateTimeSelect={handleDateTimeSelect} />
            </div>
            
            {selectedDateTime && (
              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                variant="luxury"
              >
                Continuar
              </Button>
            )}
          </div>
        )}

        {/* Step 2: Client Information */}
        {step === 2 && (
          <form onSubmit={handleClientSubmit} className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Información de contacto</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="w-4 h-4 inline mr-1" />
                Nombre completo *
              </Label>
              <Input
                id="name"
                value={clientData.name}
                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">
                <Phone className="w-4 h-4 inline mr-1" />
                WhatsApp *
              </Label>
              <Input
                id="whatsapp"
                value={clientData.whatsapp}
                onChange={(e) => setClientData({ ...clientData, whatsapp: e.target.value })}
                placeholder="ej: 6621234567"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="w-4 h-4 inline mr-1" />
                Email (opcional)
              </Label>
              <Input
                id="email"
                type="email"
                value={clientData.email}
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Notas adicionales (opcional)
              </Label>
              <Textarea
                id="notes"
                value={clientData.notes}
                onChange={(e) => setClientData({ ...clientData, notes: e.target.value })}
                placeholder="Alguna solicitud especial..."
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                Atrás
              </Button>
              <Button type="submit" variant="luxury" className="flex-1">
                Revisar cita
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg mb-4">Confirmar cita</h3>
            
            {/* DateTime Summary */}
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-primary mb-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Fecha y hora</span>
              </div>
              <p className="text-sm">
                {selectedDateTime && (
                  <>
                    {selectedDateTime.date.toLocaleDateString('es-MX', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} a las {selectedDateTime.time}
                  </>
                )}
              </p>
            </div>

            {/* Services Summary */}
            <div className="space-y-3">
              <h4 className="font-medium">Servicios seleccionados</h4>
              {items.map((item) => (
                <div key={item.service.id} className="flex justify-between text-sm">
                  <span>
                    {item.service.name}
                    {item.quantity > 1 && ` (x${item.quantity})`}
                  </span>
                  <span>${(item.service.price * item.quantity).toLocaleString()} MXN</span>
                </div>
              ))}
              
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total: {formatDuration(getTotalDuration())}</span>
                <span>${getTotalPrice().toLocaleString()} MXN</span>
              </div>
            </div>

            {/* Client Summary */}
            <div className="text-sm text-muted-foreground">
              <p><strong>Cliente:</strong> {clientData.name}</p>
              <p><strong>WhatsApp:</strong> {clientData.whatsapp}</p>
              {clientData.email && <p><strong>Email:</strong> {clientData.email}</p>}
            </div>

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                Atrás
              </Button>
              <Button 
                onClick={handleFinalSubmit} 
                variant="luxury" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Agendando..." : "Confirmar cita"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;