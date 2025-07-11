import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Briefcase, Users, BarChart3, Settings } from "lucide-react";
import AppointmentsManagement from "@/pages/AppointmentsManagement";
import ServicesManagement from "@/pages/ServicesManagement";
import ClientsManagement from "@/components/ClientsManagement";
import ReportsManagement from "@/components/ReportsManagement";
import SettingsManagement from "@/components/SettingsManagement";

const ManagementTabs = () => {
  const [activeTab, setActiveTab] = useState("appointments");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión del Negocio</CardTitle>
        <CardDescription>
          Administra todas las operaciones del salón desde aquí
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Citas</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Servicios</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Reportes</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-6">
            <AppointmentsManagement />
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <ServicesManagement />
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <ClientsManagement />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportsManagement />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ManagementTabs;