import { Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BasicBusinessHours = () => {
  // Datos hardcodeados - sin estado, sin props, sin base de datos
  const days = [
    { name: "Domingo", isOpen: false, start: "09:00", end: "18:00" },
    { name: "Lunes", isOpen: true, start: "09:00", end: "18:00" },
    { name: "Martes", isOpen: true, start: "09:00", end: "18:00" },
    { name: "Miércoles", isOpen: true, start: "09:00", end: "18:00" },
    { name: "Jueves", isOpen: true, start: "09:00", end: "18:00" },
    { name: "Viernes", isOpen: true, start: "09:00", end: "18:00" },
    { name: "Sábado", isOpen: true, start: "09:00", end: "18:00" },
  ];

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
          {days.map((day, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border">
              <div className="w-20">
                <Label className="font-medium">{day.name}</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch checked={day.isOpen} disabled />
                <Label className="text-sm">Abierto</Label>
              </div>

              {day.isOpen ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">De:</Label>
                    <Input
                      type="time"
                      value={day.start}
                      disabled
                      className="w-28"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">A:</Label>
                    <Input
                      type="time"
                      value={day.end}
                      disabled
                      className="w-28"
                    />
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Cerrado
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicBusinessHours;