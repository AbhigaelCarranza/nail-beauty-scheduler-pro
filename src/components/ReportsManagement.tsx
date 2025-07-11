import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFinancialReports } from "@/hooks/useReports";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "#8884d8", "#82ca9d"];

const ReportsManagement = () => {
  const { data: reports, isLoading } = useFinancialReports();

  if (isLoading) {
    return <div>Cargando reportes...</div>;
  }

  if (!reports) {
    return <div>No hay datos disponibles</div>;
  }

  const {
    currentMonthRevenue,
    lastMonthRevenue,
    revenueGrowth,
    popularServices,
    vipClients,
    dailyRevenue,
    totalAppointments,
    averageTicket,
  } = reports;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gradient">Reportes Financieros</h3>
        <p className="text-muted-foreground">Análisis de rendimiento y métricas del negocio</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonthRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              )}
              <span className={revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(revenueGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas del Mes</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Citas completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(averageTicket)}</div>
            <p className="text-xs text-muted-foreground">Por cita</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipClients.length}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de ingresos diarios */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos Diarios del Mes</CardTitle>
          <CardDescription>Tendencia de ingresos por día</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, "Ingresos"]}
                labelFormatter={(label) => `Día ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Servicios más populares */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios Más Populares</CardTitle>
            <CardDescription>Top 5 servicios por número de citas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.count} citas - ${service.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {index === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clientes VIP */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes VIP</CardTitle>
            <CardDescription>Top 5 clientes por gasto total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vipClients.map((client, index) => (
                <div key={client.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {client.appointmentCount} citas
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${client.totalSpent.toLocaleString()}</div>
                    {index === 0 && <Award className="w-4 h-4 text-yellow-500 ml-auto" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de servicios (Pie Chart) */}
      {popularServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Servicios</CardTitle>
            <CardDescription>Proporción de ingresos por servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={popularServices}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {popularServices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Ingresos"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {!popularServices.length && !vipClients.length && (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No hay datos suficientes</h3>
            <p className="text-muted-foreground">
              Los reportes se generarán automáticamente cuando tengas más citas registradas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsManagement;