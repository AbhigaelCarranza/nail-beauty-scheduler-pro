import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Client = {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }

      return data as Client[];
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clientData: Omit<Client, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("clients")
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente agregado",
        description: "El cliente se ha registrado exitosamente.",
      });
    },
    onError: (error) => {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el cliente. Intenta de nuevo.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente se han actualizado.",
      });
    },
    onError: (error) => {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado del sistema.",
      });
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente.",
        variant: "destructive",
      });
    },
  });
};

export const useClientStats = (clientId?: string) => {
  return useQuery({
    queryKey: ["client-stats", clientId],
    queryFn: async () => {
      if (!clientId) return null;

      // Obtener todas las citas del cliente
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("client_id", clientId)
        .neq("status", "cancelled");

      if (error) throw error;

      const totalSpent = appointments?.reduce((sum, apt) => sum + apt.total_price, 0) || 0;
      const totalAppointments = appointments?.length || 0;
      const lastAppointment = appointments?.[0]?.appointment_date;

      return {
        totalSpent,
        totalAppointments,
        lastAppointment,
        averageSpent: totalAppointments > 0 ? totalSpent / totalAppointments : 0,
      };
    },
    enabled: !!clientId,
  });
};