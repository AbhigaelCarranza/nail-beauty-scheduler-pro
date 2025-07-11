import { useState, useEffect } from "react";
import { Save, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useBusinessHours, useUpdateBusinessHours } from "@/hooks/useBusinessConfig";

const DAYS_OF_WEEK = [
  { key: 0, label: "Domingo" },
  { key: 1, label: "Lunes" },
  { key: 2, label: "Martes" },
  { key: 3, label: "Miércoles" },
  { key: 4, label: "Jueves" },
  { key: 5, label: "Viernes" },
  { key: 6, label: "Sábado" },
];

interface DayHours {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_closed: boolean;
}

interface BusinessHoursState {
  [key: number]: DayHours;
}

const BusinessHours = () => {
  const { data: businessHours, isLoading } = useBusinessHours();
  const updateHours = useUpdateBusinessHours();

  // Estado local para horarios
  const [hoursState, setHoursState] = useState<BusinessHoursState>(() => {
    const defaultState: BusinessHoursState = {};
    
    // Inicializar todos los días con valores por defecto
    DAYS_OF_WEEK.forEach(day => {
      defaultState[day.key] = {
        day_of_week: day.key,
        start_time: "09:00",
        end_time: "18:00",
        is_closed: day.key === 0, // Domingo cerrado por defecto
      };
    });
    
    return defaultState;
  });

  // Actualizar estado cuando llegan datos del servidor
  useEffect(() => {
    if (businessHours && businessHours.length > 0) {
      const newState: BusinessHoursState = { ...hoursState };
      
      businessHours.forEach(hour => {
        if (hour && typeof hour.day_of_week === 'number') {
          newState[hour.day_of_week] = {
            day_of_week: hour.day_of_week,
            start_time: hour.start_time || "09:00",
            end_time: hour.end_time || "18:00",
            is_closed: hour.is_closed || false,
          };
        }
      });
      
      setHoursState(newState);
    }
  }, [businessHours]);

  // Función para actualizar un día específico
  const updateDay = (dayOfWeek: number, field: keyof DayHours, value: any) => {
    setHoursState(prev => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        [field]: value,
      }
    }));
  };

  // Guardar horarios
  const handleSave = () => {
    const hoursArray = Object.values(hoursState);
    updateHours.mutate(hoursArray);
  };

  if (isLoading) {
    return <div>Cargando horarios...</div>;
  }

  return (
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
          {DAYS_OF_WEEK.map((day) => {
            const dayHours = hoursState[day.key];
            
            return (
              <div key={day.key} className="flex items-center space-x-4 p-4 rounded-lg border">
                <div className="w-20">
                  <Label className="font-medium">{day.label}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={!dayHours.is_closed}
                    onCheckedChange={(checked) => 
                      updateDay(day.key, "is_closed", !checked)
                    }
                  />
                  <Label className="text-sm">Abierto</Label>
                </div>

                {!dayHours.is_closed && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">De:</Label>
                      <Input
                        type="time"
                        value={dayHours.start_time}
                        onChange={(e) => 
                          updateDay(day.key, "start_time", e.target.value)
                        }
                        className="w-28"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">A:</Label>
                      <Input
                        type="time"
                        value={dayHours.end_time}
                        onChange={(e) => 
                          updateDay(day.key, "end_time", e.target.value)
                        }
                        className="w-28"
                      />
                    </div>
                  </>
                )}

                {dayHours.is_closed && (
                  <div className="text-sm text-muted-foreground">
                    Cerrado
                  </div>
                )}
              </div>
            );
          })}
          
          <Button 
            onClick={handleSave} 
            disabled={updateHours.isPending}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateHours.isPending ? "Guardando..." : "Guardar Horarios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHours;