import { useState } from "react";
import { Calendar, Clock, User, Phone, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppointments } from "@/hooks/useAppointments";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AppointmentsManagement = () => {
  const { data: appointments = [], isLoading } = useAppointments();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtrar citas
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = 
      appointment.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.client?.whatsapp?.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Programada", variant: "default" as const },
      confirmed: { label: "Confirmada", variant: "secondary" as const },
      completed: { label: "Completada", variant: "outline" as const },
      cancelled: { label: "Cancelada", variant: "destructive" as const },
      no_show: { label: "No asistió", variant: "secondary" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, d 'de' MMMM", { locale: es });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Citas</h1>
        <p className="text-muted-foreground">
          Administra y monitorea todas las citas programadas
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o WhatsApp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="scheduled">Programada</SelectItem>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="no_show">No asistió</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Citas */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{appointment.client?.name || 'Cliente'}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {appointment.client?.whatsapp}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(appointment.appointment_date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.start_time} - {appointment.end_time}
                      </div>
                    </div>

                    {appointment.appointment_services && appointment.appointment_services.length > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Servicios: </span>
                        {appointment.appointment_services.map((as, index) => (
                          <span key={as.id}>
                            {as.service?.name}
                            {index < appointment.appointment_services!.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end space-y-2">
                    {getStatusBadge(appointment.status || 'scheduled')}
                    
                    <div className="text-right">
                      <div className="font-semibold">${appointment.total_price.toLocaleString()} MXN</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.total_duration_minutes} minutos
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                      {appointment.status === 'scheduled' && (
                        <Button variant="default" size="sm">
                          Confirmar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Notas: </span>
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No hay citas</h3>
              <p className="mt-1 text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "No se encontraron citas con los filtros aplicados"
                  : "Aún no hay citas programadas"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentsManagement;