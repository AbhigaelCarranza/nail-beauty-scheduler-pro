import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessPoliciesFormProps {
  data: {
    booking_advance_days: number;
    reminder_hours_before: number;
    cancellation_hours_before: number;
  };
  onInputChange: (field: string, value: number) => void;
}

const BusinessPoliciesForm = ({ data, onInputChange }: BusinessPoliciesFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>Políticas del Negocio</span>
        </CardTitle>
        <CardDescription>Configuraciones de reservas y cancelaciones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="booking_advance_days">Días de anticipación para reservas</Label>
            <Input 
              id="booking_advance_days"
              type="number" 
              min="1" 
              max="365"
              value={data.booking_advance_days}
              onChange={(e) => onInputChange('booking_advance_days', parseInt(e.target.value) || 1)}
            />
            <p className="text-sm text-muted-foreground">
              Máximo de días que los clientes pueden reservar por adelantado
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder_hours_before">Recordatorio antes de la cita (horas)</Label>
            <Input 
              id="reminder_hours_before"
              type="number" 
              min="1" 
              max="168"
              value={data.reminder_hours_before}
              onChange={(e) => onInputChange('reminder_hours_before', parseInt(e.target.value) || 1)}
            />
            <p className="text-sm text-muted-foreground">
              Cuántas horas antes enviar el recordatorio
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellation_hours_before">Cancelación sin penalización (horas)</Label>
            <Input 
              id="cancellation_hours_before"
              type="number" 
              min="1" 
              max="72"
              value={data.cancellation_hours_before}
              onChange={(e) => onInputChange('cancellation_hours_before', parseInt(e.target.value) || 1)}
            />
            <p className="text-sm text-muted-foreground">
              Tiempo mínimo para cancelar sin penalización
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessPoliciesForm;