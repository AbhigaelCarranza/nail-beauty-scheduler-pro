import { useState, useEffect } from "react";
import { useBusinessConfig, useBusinessHours, useUpdateBusinessConfig, useUpdateBusinessHours } from "@/hooks/useBusinessConfig";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BusinessInfoForm from "@/components/BusinessInfoForm";
import BusinessPoliciesForm from "@/components/BusinessPoliciesForm";
import BusinessHoursForm from "@/components/BusinessHoursForm";

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


const SettingsManagement = () => {
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  
  const businessConfigQuery = useBusinessConfig();
  const businessHoursQuery = useBusinessHours();
  
  const businessConfig = businessConfigQuery?.data;
  const configLoading = businessConfigQuery?.isLoading || false;
  const hours = businessHoursQuery?.data || [];
  const hoursLoading = businessHoursQuery?.isLoading || false;
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
      const defaultDays = [
        { value: 0, label: "Domingo" },
        { value: 1, label: "Lunes" },
        { value: 2, label: "Martes" },
        { value: 3, label: "Miércoles" },
        { value: 4, label: "Jueves" },
        { value: 5, label: "Viernes" },
        { value: 6, label: "Sábado" },
      ];
      setBusinessHours(
        defaultDays.map(day => ({
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
        <BusinessInfoForm 
          form={form}
          onSubmit={handleConfigSubmit}
          isLoading={updateConfig.isPending}
        />
        <BusinessPoliciesForm form={form} />
      </div>

      <BusinessHoursForm 
        businessHours={businessHours}
        onHoursUpdate={handleHoursUpdate}
        onSave={saveBusinessHours}
        isLoading={updateHours.isPending}
      />
    </div>
  );
};

export default SettingsManagement;