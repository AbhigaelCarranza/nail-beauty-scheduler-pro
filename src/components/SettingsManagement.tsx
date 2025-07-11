import { useState, useEffect } from "react";
import { Save, Clock, MapPin, Phone, Mail, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useBusinessConfig, useBusinessHours, useUpdateBusinessConfig, useUpdateBusinessHours } from "@/hooks/useBusinessConfig";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const businessConfigSchema = z.object({
  salon_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  salon_description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  address: z.string().optional(),
  booking_advance_days: z.number().min(1).max(365),
  reminder_hours_before: z.number().min(1).max(168),
  cancellation_hours_before: z.number().min(1).max(72),
});

type BusinessConfigFormData = z.infer<typeof businessConfigSchema>;

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

const SettingsManagement = () => {
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  
  const { data: businessConfig, isLoading: configLoading } = useBusinessConfig();
  const { data: hours = [], isLoading: hoursLoading } = useBusinessHours();
  const updateConfig = useUpdateBusinessConfig();
  const updateHours = useUpdateBusinessHours();

  const form = useForm<BusinessConfigFormData>({
    resolver: zodResolver(businessConfigSchema),
    defaultValues: {
      salon_name: "Bella Nails",
      salon_description: "",
      phone: "",
      email: "",
      address: "",
      booking_advance_days: 30,
      reminder_hours_before: 24,
      cancellation_hours_before: 4,
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (businessConfig) {
      form.reset({
        salon_name: businessConfig.salon_name || "Bella Nails",
        salon_description: businessConfig.salon_description || "",
        phone: businessConfig.phone || "",
        email: businessConfig.email || "",
        address: businessConfig.address || "",
        booking_advance_days: businessConfig.booking_advance_days || 30,
        reminder_hours_before: businessConfig.reminder_hours_before || 24,
        cancellation_hours_before: businessConfig.cancellation_hours_before || 4,
      });
    }
  }, [businessConfig, form]);

  // Initialize business hours when data loads
  useEffect(() => {
    if (hours && hours.length > 0) {
      setBusinessHours(hours);
    } else if (hours !== undefined) {
      // Default hours if none exist but data has loaded
      setBusinessHours(
        DAYS_OF_WEEK.map(day => ({
          day_of_week: day.value,
          start_time: "09:00",
          end_time: "18:00",
          is_closed: day.value === 0, // Sunday closed by default
        }))
      );
    }
  }, [hours]);

  const handleConfigSubmit = (data: BusinessConfigFormData) => {
    updateConfig.mutate(data);
  };

  const handleHoursUpdate = (dayIndex: number, field: string, value: any) => {
    if (!businessHours) return;
    const updatedHours = [...businessHours];
    updatedHours[dayIndex] = { ...updatedHours[dayIndex], [field]: value };
    setBusinessHours(updatedHours);
  };

  const saveBusinessHours = () => {
    if (!businessHours || businessHours.length === 0) return;
    const hoursData = businessHours.map(({ id, created_at, updated_at, ...hour }) => hour);
    updateHours.mutate(hoursData);
  };

  if (configLoading || hoursLoading) {
    return <div>Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gradient">Configuración del Negocio</h3>
        <p className="text-muted-foreground">Administra la información y políticas de tu salón</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Salón */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Información del Salón</span>
            </CardTitle>
            <CardDescription>Datos de contacto y descripción del negocio</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleConfigSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="salon_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Salón</FormLabel>
                      <FormControl>
                        <Input placeholder="Bella Nails" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salon_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Salón de belleza especializado en manicura y pedicura..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+52 555 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="contacto@bellanails.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Calle Principal #123, Colonia Centro, Ciudad de México"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={updateConfig.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Información
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Políticas del Negocio */}
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
      </div>

      {/* Horarios de Atención */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Horarios de Atención</span>
          </CardTitle>
          <CardDescription>Configura los días y horarios de operación del salón</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day, index) => {
              const safeBusinessHours = businessHours || [];
              const hourData = safeBusinessHours.find(h => h?.day_of_week === day.value) || 
                              safeBusinessHours[index] || 
                              { day_of_week: day.value, start_time: "09:00", end_time: "18:00", is_closed: false };
              
              return (
                <div key={day.value} className="flex items-center space-x-4 p-4 rounded-lg border">
                  <div className="w-20">
                    <Label className="font-medium">{day.label}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={!hourData.is_closed}
                      onCheckedChange={(checked) => 
                        handleHoursUpdate(index, "is_closed", !checked)
                      }
                    />
                    <Label className="text-sm">Abierto</Label>
                  </div>

                  {!hourData.is_closed && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">De:</Label>
                        <Input
                          type="time"
                          value={hourData.start_time}
                          onChange={(e) => 
                            handleHoursUpdate(index, "start_time", e.target.value)
                          }
                          className="w-28"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">A:</Label>
                        <Input
                          type="time"
                          value={hourData.end_time}
                          onChange={(e) => 
                            handleHoursUpdate(index, "end_time", e.target.value)
                          }
                          className="w-28"
                        />
                      </div>
                    </>
                  )}

                  {hourData.is_closed && (
                    <div className="text-sm text-muted-foreground">
                      Cerrado
                    </div>
                  )}
                </div>
              );
            })}
            
            <Button onClick={saveBusinessHours} disabled={updateHours.isPending}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Horarios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;