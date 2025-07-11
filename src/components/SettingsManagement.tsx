import { useState, useEffect } from "react";
import { useBusinessConfig, useUpdateBusinessConfig } from "@/hooks/useBusinessConfig";
import BusinessInfoForm from "@/components/BusinessInfoForm";
import BusinessPoliciesForm from "@/components/BusinessPoliciesForm";
import BasicBusinessHours from "@/components/BasicBusinessHours";


const SettingsManagement = () => {
  const businessConfigQuery = useBusinessConfig();
  const businessConfig = businessConfigQuery?.data;
  const configLoading = businessConfigQuery?.isLoading || false;
  const updateConfig = useUpdateBusinessConfig();

  // Simple state instead of useForm
  const [formData, setFormData] = useState({
    salon_name: "Bella Nails",
    salon_description: "",
    phone: "",
    email: "",
    address: "",
    booking_advance_days: 30,
    reminder_hours_before: 24,
    cancellation_hours_before: 4,
  });

  // Update local state when data loads from server
  useEffect(() => {
    if (businessConfig) {
      setFormData({
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
  }, [businessConfig]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfigSubmit = () => {
    updateConfig.mutate(formData);
  };

  if (configLoading) {
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
          data={{
            salon_name: formData.salon_name,
            salon_description: formData.salon_description,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
          }}
          onInputChange={handleInputChange}
          onSubmit={handleConfigSubmit}
          isLoading={updateConfig.isPending}
        />
        <BusinessPoliciesForm 
          data={{
            booking_advance_days: formData.booking_advance_days,
            reminder_hours_before: formData.reminder_hours_before,
            cancellation_hours_before: formData.cancellation_hours_before,
          }}
          onInputChange={handleInputChange}
        />
      </div>

      <BasicBusinessHours />
    </div>
  );
};

export default SettingsManagement;