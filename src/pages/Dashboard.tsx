import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign,
  Bell,
  Search,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAppointments } from "@/hooks/useAppointments";
import { useServices } from "@/hooks/useServices";
import { format, isToday, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import ManagementTabs from "@/components/ManagementTabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: appointments = [] } = useAppointments();
  const { services } = useServices();
  const [searchQuery, setSearchQuery] = useState("");

  // Calcular métricas
  const today = new Date();
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const todayAppointments = appointments.filter(apt => 
    apt.appointment_date === format(today, 'yyyy-MM-dd')
  );

  const monthlyAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    return isWithinInterval(aptDate, { start: monthStart, end: monthEnd }) && 
           apt.status !== 'cancelled';
  });

  const todayRevenue = todayAppointments.reduce((sum, apt) => sum + apt.total_price, 0);
  const monthlyRevenue = monthlyAppointments.reduce((sum, apt) => sum + apt.total_price, 0);
  const uniqueClients = new Set(monthlyAppointments.map(apt => apt.client_id)).size;

  const nextAppointment = todayAppointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];

  const availableSlots = 12 - todayAppointments.length; // Asumiendo 12 slots por día

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header del Dashboard */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-gradient">
                Dashboard - Bella Nails
              </h1>
              <p className="text-muted-foreground">
                {format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Búsqueda Global */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar citas, clientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Notificaciones */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground">
                  {todayAppointments.length}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Resumen del Día */}
        <Card className="border-primary/20 bg-gradient-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Resumen del Día</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <div className="text-primary-foreground/80 text-sm">Citas Programadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${todayRevenue.toLocaleString()}</div>
              <div className="text-primary-foreground/80 text-sm">Ingresos del Día</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{availableSlots}</div>
              <div className="text-primary-foreground/80 text-sm">Espacios Libres</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {nextAppointment ? nextAppointment.start_time : "N/A"}
              </div>
              <div className="text-primary-foreground/80 text-sm">Próxima Cita</div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Mensuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                MXN de {format(currentMonth, 'MMMM', { locale: es })}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas del Mes</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Citas confirmadas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueClients}</div>
              <p className="text-xs text-muted-foreground">
                Clientes este mes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Cita</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${monthlyAppointments.length > 0 ? Math.round(monthlyRevenue / monthlyAppointments.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Ticket promedio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agenda de Hoy */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Agenda de Hoy</CardTitle>
                <CardDescription>
                  {todayAppointments.length} citas programadas
                </CardDescription>
              </div>
              <Button onClick={() => navigate('/appointments')}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cita
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium">
                          {appointment.start_time}
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                          <div className="font-medium">
                            {appointment.client?.name || `Cliente #${appointment.client_id.slice(0, 8)}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.notes || "Sin notas"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}>
                          {appointment.status === 'scheduled' ? 'Programada' : 'Completada'}
                        </Badge>
                        <div className="text-sm font-medium">
                          ${appointment.total_price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay citas programadas para hoy</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/appointments')}
                  >
                    Agendar Primera Cita
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gestión Unificada */}
        <ManagementTabs />
      </div>
    </div>
  );
};

export default Dashboard;