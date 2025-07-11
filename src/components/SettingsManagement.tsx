import BusinessHours from "@/components/BusinessHours";
import BlockedTimeSlots from "@/components/BlockedTimeSlots";

const SettingsManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gradient">Configuración del Negocio</h3>
        <p className="text-muted-foreground">Administra los horarios de atención del salón</p>
      </div>

      <BusinessHours />
      <BlockedTimeSlots />
    </div>
  );
};

export default SettingsManagement;