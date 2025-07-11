import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAvailableTimeSlots } from "@/hooks/useAppointments";

interface DateTimePickerProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  totalDurationMinutes?: number;
  className?: string;
}

const DateTimePicker = ({ onDateTimeSelect, totalDurationMinutes = 60, className }: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  // Obtener horarios disponibles basados en la fecha seleccionada
  const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const availableSlots = useAvailableTimeSlots(dateString, totalDurationMinutes);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsDateOpen(false);
      // Reset time when date changes
      setSelectedTime("");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsTimeOpen(false);
    
    if (selectedDate) {
      onDateTimeSelect(selectedDate, time);
    }
  };

  // Deshabilitar fechas pasadas y domingos
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 30); // 30 días en adelante
    
    return (
      isBefore(date, today) || // Fechas pasadas
      date.getDay() === 0 || // Domingos
      date > maxDate // Más de 30 días
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selector de Fecha */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Selecciona la fecha
        </label>
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate 
                ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
                : "Selecciona una fecha"
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              initialFocus
              className="pointer-events-auto"
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Selector de Hora */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Selecciona la hora
        </label>
        <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedTime && "text-muted-foreground",
                !selectedDate && "opacity-50 cursor-not-allowed"
              )}
              disabled={!selectedDate}
            >
              <Clock className="mr-2 h-4 w-4" />
              {selectedTime || "Selecciona una hora"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4">
              <h4 className="font-medium text-sm text-foreground mb-3">
                Horarios disponibles
              </h4>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleTimeSelect(time)}
                      className="text-sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay horarios disponibles para esta fecha
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Información adicional */}
      {selectedDate && selectedTime && (
        <div className="bg-primary/10 rounded-lg p-3">
          <p className="text-sm text-primary text-center">
            ✓ Cita programada para{" "}
            <strong>
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })} a las {selectedTime}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;