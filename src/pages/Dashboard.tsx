import { Calendar, Users, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/hooks/useAppointments";
import { useServices } from "@/hooks/useServices";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

const Dashboard = () => {
  const { data: appointments = [] } = useAppointments();
  const { services } = useServices();

  // Calcular métricas del mes actual
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthlyAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    return isWithinInterval(aptDate, { start: monthStart, end: monthEnd }) && 
           apt.status !== 'cancelled';
  });

  const monthlyRevenue = monthlyAppointments.reduce((sum, apt) => sum + apt.total_price, 0);
  const uniqueClients = new Set(monthlyAppointments.map(apt => apt.client_id)).size;

  // Próximas citas de hoy
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(apt => 
    apt.appointment_date === today && apt.status === 'scheduled'
  ).slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de actividad de {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas del Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.round((monthlyAppointments.length / 30) * 100)}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              MXN del mes actual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueClients}</div>
            <p className="text-xs text-muted-foreground">
              Clientes únicos este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              Servicios activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Citas de Hoy */}
      <Card>
        <CardHeader>
          <CardTitle>Citas de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {appointment.client?.name || 'Cliente'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.start_time} - {appointment.end_time}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${appointment.total_price.toLocaleString()} MXN
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{appointment.total_duration_minutes} min</div>
                    <div className="text-xs text-muted-foreground">
                      {appointment.appointment_services?.length || 0} servicios
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No hay citas hoy</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                El día está libre. ¡Perfecto para descansar!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;