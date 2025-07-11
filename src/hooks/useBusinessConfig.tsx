import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type BusinessConfig = {
  id: string;
  salon_name: string;
  salon_description?: string;
  phone?: string;
  email?: string;
  address?: string;
  booking_advance_days?: number;
  reminder_hours_before?: number;
  cancellation_hours_before?: number;
  created_at: string;
  updated_at: string;
};

export type BusinessHours = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_closed?: boolean;
  created_at: string;
  updated_at: string;
};

export const useBusinessConfig = () => {
  return useQuery({
    queryKey: ["business-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_config")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching business config:", error);
        throw error;
      }

      return data as BusinessConfig | null;
    },
  });
};

export const useBusinessHours = () => {
  return useQuery({
    queryKey: ["business-hours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_hours")
        .select("*")
        .order("day_of_week", { ascending: true });

      if (error) {
        console.error("Error fetching business hours:", error);
        throw error;
      }

      return data as BusinessHours[];
    },
  });
};

export const useUpdateBusinessConfig = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (configData: Partial<BusinessConfig>) => {
      // First try to get existing config
      const { data: existing } = await supabase
        .from("business_config")
        .select("id")
        .limit(1)
        .maybeSingle();

      let result;
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("business_config")
          .update(configData)
          .eq("id", existing.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from("business_config")
          .insert([configData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-config"] });
      toast({
        title: "Configuración actualizada",
        description: "Los datos del negocio se han actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error("Error updating business config:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBusinessHours = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hoursData: Omit<BusinessHours, "id" | "created_at" | "updated_at">[]) => {
      // Delete existing hours
      await supabase.from("business_hours").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      
      // Insert new hours
      const { data, error } = await supabase
        .from("business_hours")
        .insert(hoursData)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      toast({
        title: "Horarios actualizados",
        description: "Los horarios del negocio se han configurado correctamente.",
      });
    },
    onError: (error) => {
      console.error("Error updating business hours:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los horarios.",
        variant: "destructive",
      });
    },
  });
};