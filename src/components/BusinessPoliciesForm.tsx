import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface BusinessPoliciesFormProps {
  form: UseFormReturn<any>;
}

const BusinessPoliciesForm = ({ form }: BusinessPoliciesFormProps) => {
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
          <FormField
            control={form.control}
            name="booking_advance_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Días de anticipación para reservas</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="365"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Máximo de días que los clientes pueden reservar por adelantado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reminder_hours_before"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recordatorio antes de la cita (horas)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="168"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Cuántas horas antes enviar el recordatorio
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cancellation_hours_before"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancelación sin penalización (horas)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="72"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Tiempo mínimo para cancelar sin penalización
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessPoliciesForm;