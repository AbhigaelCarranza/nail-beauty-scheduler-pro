import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type BlockedTimeSlot = {
  id: string;
  block_date: string;
  start_time: string;
  end_time: string;
  reason?: string;
  created_at: string;
  updated_at: string;
};

export const useBlockedTimeSlots = () => {
  return useQuery({
    queryKey: ["blocked-time-slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocked_time_slots")
        .select("*")
        .gte("block_date", new Date().toISOString().split('T')[0]) // Solo fechas futuras
        .order("block_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching blocked time slots:", error);
        throw error;
      }

      return data as BlockedTimeSlot[];
    },
  });
};

export const useCreateBlockedTimeSlot = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (slotData: Omit<BlockedTimeSlot, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("blocked_time_slots")
        .insert([slotData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-time-slots"] });
      toast({
        title: "Horario bloqueado",
        description: "El horario se ha bloqueado exitosamente.",
      });
    },
    onError: (error) => {
      console.error("Error creating blocked time slot:", error);
      toast({
        title: "Error",
        description: "No se pudo bloquear el horario.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBlockedTimeSlot = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blocked_time_slots")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-time-slots"] });
      toast({
        title: "Horario desbloqueado",
        description: "El horario se ha desbloqueado exitosamente.",
      });
    },
    onError: (error) => {
      console.error("Error deleting blocked time slot:", error);
      toast({
        title: "Error",
        description: "No se pudo desbloquear el horario.",
        variant: "destructive",
      });
    },
  });
};