import { useState } from "react";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useBlockedTimeSlots, useCreateBlockedTimeSlot, useDeleteBlockedTimeSlot } from "@/hooks/useBlockedTimeSlots";

const BlockedTimeSlots = () => {
  const { data: blockedSlots = [], isLoading } = useBlockedTimeSlots();
  const createBlockedSlot = useCreateBlockedTimeSlot();
  const deleteBlockedSlot = useDeleteBlockedTimeSlot();

  const [newSlot, setNewSlot] = useState({
    block_date: "",
    start_time: "",
    end_time: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSlot.block_date && newSlot.start_time && newSlot.end_time) {
      createBlockedSlot.mutate(newSlot, {
        onSuccess: () => {
          setNewSlot({
            block_date: "",
            start_time: "",
            end_time: "",
            reason: "",
          });
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteBlockedSlot.mutate(id);
  };

  if (isLoading) {
    return <div>Cargando horarios bloqueados...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Horarios Bloqueados</span>
        </CardTitle>
        <CardDescription>
          Bloquea horarios específicos cuando no puedas atender (emergencias, eventos, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Formulario para agregar nuevo horario bloqueado */}
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-semibold">Bloquear nuevo horario</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="block_date">Fecha</Label>
                <Input
                  id="block_date"
                  type="date"
                  value={newSlot.block_date}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, block_date: e.target.value }))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="start_time">Hora inicio</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={newSlot.start_time}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, start_time: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="end_time">Hora fin</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={newSlot.end_time}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, end_time: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Textarea
                id="reason"
                value={newSlot.reason}
                onChange={(e) => setNewSlot(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Ej: Cita médica, evento personal, mantenimiento..."
                rows={2}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={createBlockedSlot.isPending}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {createBlockedSlot.isPending ? "Bloqueando..." : "Bloquear Horario"}
            </Button>
          </form>

          {/* Lista de horarios bloqueados */}
          <div className="space-y-2">
            <h4 className="font-semibold">Horarios actualmente bloqueados</h4>
            
            {blockedSlots.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay horarios bloqueados
              </p>
            ) : (
              <div className="space-y-2">
                {blockedSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {format(new Date(slot.block_date), "EEEE, d 'de' MMMM", { locale: es })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {slot.start_time} - {slot.end_time}
                          {slot.reason && ` • ${slot.reason}`}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(slot.id)}
                      disabled={deleteBlockedSlot.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockedTimeSlots;