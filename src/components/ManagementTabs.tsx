import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Briefcase, Users, BarChart3, Settings } from "lucide-react";

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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gestión de Citas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Nueva Cita</h4>
                      <p className="text-sm text-muted-foreground">Agendar nueva cita</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Ver Calendario</h4>
                      <p className="text-sm text-muted-foreground">Vista mensual completa</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Reagendar</h4>
                      <p className="text-sm text-muted-foreground">Modificar citas existentes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gestión de Servicios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Nuevo Servicio</h4>
                      <p className="text-sm text-muted-foreground">Agregar servicio</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Editar Precios</h4>
                      <p className="text-sm text-muted-foreground">Actualizar tarifas</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Gestionar Catálogo</h4>
                      <p className="text-sm text-muted-foreground">Ver todos los servicios</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gestión de Clientes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Nuevo Cliente</h4>
                      <p className="text-sm text-muted-foreground">Registrar cliente</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Lista de Clientes</h4>
                      <p className="text-sm text-muted-foreground">Ver todos los clientes</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Historial</h4>
                      <p className="text-sm text-muted-foreground">Ver historial de citas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reportes Financieros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Ingresos Mensuales</h4>
                      <p className="text-sm text-muted-foreground">Análisis de ingresos</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Servicios Populares</h4>
                      <p className="text-sm text-muted-foreground">Top servicios</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Clientes VIP</h4>
                      <p className="text-sm text-muted-foreground">Mejores clientes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuración</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Horarios</h4>
                      <p className="text-sm text-muted-foreground">Configurar horarios</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Información del Salón</h4>
                      <p className="text-sm text-muted-foreground">Datos de contacto</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-semibold">Políticas</h4>
                      <p className="text-sm text-muted-foreground">Reglas del negocio</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ManagementTabs;