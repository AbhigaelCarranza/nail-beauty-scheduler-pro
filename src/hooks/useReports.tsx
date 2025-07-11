import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";

export const useFinancialReports = () => {
  return useQuery({
    queryKey: ["financial-reports"],
    queryFn: async () => {
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select(`
          *,
          client:clients(*),
          appointment_services(
            service:services(*),
            price
          )
        `)
        .neq("status", "cancelled");

      if (error) throw error;

      const currentMonth = new Date();
      const lastMonth = subMonths(currentMonth, 1);
      const currentMonthStart = startOfMonth(currentMonth);
      const currentMonthEnd = endOfMonth(currentMonth);
      const lastMonthStart = startOfMonth(lastMonth);
      const lastMonthEnd = endOfMonth(lastMonth);

      // Filtrar citas por mes
      const currentMonthAppointments = appointments?.filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        return isWithinInterval(aptDate, { start: currentMonthStart, end: currentMonthEnd });
      }) || [];

      const lastMonthAppointments = appointments?.filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        return isWithinInterval(aptDate, { start: lastMonthStart, end: lastMonthEnd });
      }) || [];

      // Calcular ingresos
      const currentMonthRevenue = currentMonthAppointments.reduce((sum, apt) => sum + apt.total_price, 0);
      const lastMonthRevenue = lastMonthAppointments.reduce((sum, apt) => sum + apt.total_price, 0);
      const revenueGrowth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      // Servicios más populares
      const serviceStats: Record<string, { name: string; count: number; revenue: number }> = {};
      
      appointments?.forEach(apt => {
        apt.appointment_services?.forEach(as => {
          const serviceName = as.service?.name || 'Servicio sin nombre';
          if (!serviceStats[serviceName]) {
            serviceStats[serviceName] = { name: serviceName, count: 0, revenue: 0 };
          }
          serviceStats[serviceName].count += 1;
          serviceStats[serviceName].revenue += as.price;
        });
      });

      const popularServices = Object.values(serviceStats)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Clientes VIP (más gastado)
      const clientStats: Record<string, { name: string; totalSpent: number; appointmentCount: number }> = {};
      
      appointments?.forEach(apt => {
        const clientName = apt.client?.name || 'Cliente sin nombre';
        if (!clientStats[apt.client_id]) {
          clientStats[apt.client_id] = { name: clientName, totalSpent: 0, appointmentCount: 0 };
        }
        clientStats[apt.client_id].totalSpent += apt.total_price;
        clientStats[apt.client_id].appointmentCount += 1;
      });

      const vipClients = Object.values(clientStats)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);

      // Ingresos por día del mes actual (para gráfica)
      const dailyRevenue = [];
      const daysInMonth = currentMonthEnd.getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayAppointments = currentMonthAppointments.filter(apt => {
          const aptDate = new Date(apt.appointment_date);
          return aptDate.getDate() === day;
        });
        
        const dayRevenue = dayAppointments.reduce((sum, apt) => sum + apt.total_price, 0);
        dailyRevenue.push({
          day: day.toString(),
          revenue: dayRevenue,
          appointments: dayAppointments.length
        });
      }

      return {
        currentMonthRevenue,
        lastMonthRevenue,
        revenueGrowth,
        popularServices,
        vipClients,
        dailyRevenue,
        totalAppointments: currentMonthAppointments.length,
        averageTicket: currentMonthAppointments.length > 0 ? currentMonthRevenue / currentMonthAppointments.length : 0,
      };
    },
  });
};