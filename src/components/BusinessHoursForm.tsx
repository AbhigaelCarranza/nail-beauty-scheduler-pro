import { Save, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

interface BusinessHoursFormProps {
  businessHours: any[];
  onHoursUpdate: (dayIndex: number, field: string, value: any) => void;
  onSave: () => void;
  isLoading: boolean;
}

const BusinessHoursForm = ({ businessHours, onHoursUpdate, onSave, isLoading }: BusinessHoursFormProps) => {
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
                      onHoursUpdate(index, "is_closed", !checked)
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
                          onHoursUpdate(index, "start_time", e.target.value)
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
                          onHoursUpdate(index, "end_time", e.target.value)
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
          
          <Button onClick={onSave} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Horarios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursForm;