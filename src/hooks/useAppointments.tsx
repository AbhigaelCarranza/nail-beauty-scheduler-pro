import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Client {
  id: string;
  name: string;
  email?: string;
  whatsapp: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  total_duration_minutes: number;
  status: string;
  notes?: string;
  cancellation_token?: string;
  created_at?: string;
  updated_at?: string;
  client?: Client;
  appointment_services?: Array<{
    id: string;
    service_id: string;
    price: number;
    service?: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
}

export interface CreateAppointmentRequest {
  client: {
    name: string;
    whatsapp: string;
    email?: string;
    notes?: string;
  };
  appointment: {
    appointment_date: string;
    start_time: string;
    end_time: string;
    total_price: number;
    total_duration_minutes: number;
    notes?: string;
  };
  services: Array<{
    service_id: string;
    price: number;
  }>;
}

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(*),
          appointment_services(
            *,
            service:services(*)
          )
        `)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as Appointment[];
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateAppointmentRequest) => {
      // 1. Crear o encontrar cliente
      let clientId: string;
      
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('whatsapp', request.client.whatsapp)
        .single();

      if (existingClient) {
        clientId = existingClient.id;
        // Actualizar datos del cliente si es necesario
        await supabase
          .from('clients')
          .update({
            name: request.client.name,
            email: request.client.email,
            notes: request.client.notes,
          })
          .eq('id', clientId);
      } else {
        // Crear nuevo cliente
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert([request.client])
          .select('id')
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      // 2. Crear cita
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          client_id: clientId,
          ...request.appointment,
          status: 'scheduled',
          cancellation_token: crypto.randomUUID(),
        }])
        .select('id')
        .single();

      if (appointmentError) throw appointmentError;

      // 3. Crear servicios de la cita
      const appointmentServices = request.services.map(service => ({
        appointment_id: appointment.id,
        service_id: service.service_id,
        price: service.price,
      }));

      const { error: servicesError } = await supabase
        .from('appointment_services')
        .insert(appointmentServices);

      if (servicesError) throw servicesError;

      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useAppointmentsByDate = (date: string) => {
  return useQuery({
    queryKey: ['appointments', 'by-date', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(*),
          appointment_services(
            *,
            service:services(name, duration_minutes)
          )
        `)
        .eq('appointment_date', date)
        .eq('status', 'scheduled')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!date,
  });
};

export const useBusinessHours = () => {
  return useQuery({
    queryKey: ['business-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para obtener horarios bloqueados
export const useBlockedTimeSlotsForDate = (date: string) => {
  return useQuery({
    queryKey: ['blocked-time-slots', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocked_time_slots')
        .select('*')
        .eq('block_date', date);

      if (error) throw error;
      return data;
    },
    enabled: !!date,
  });
};

// Hook para verificar disponibilidad de horarios
export const useAvailableTimeSlots = (date: string, durationMinutes: number) => {
  const { data: appointments } = useAppointmentsByDate(date);
  const { data: businessHours } = useBusinessHours();
  const { data: blockedSlots } = useBlockedTimeSlotsForDate(date);

  const getAvailableSlots = () => {
    if (!businessHours || !appointments) return [];

    const dayOfWeek = new Date(date).getDay();
    const dayHours = businessHours.find(h => h.day_of_week === dayOfWeek);
    
    if (!dayHours || dayHours.is_closed) return [];

    // Generar slots de 30 minutos desde apertura hasta cierre
    const slots: string[] = [];
    const startTime = dayHours.start_time;
    const endTime = dayHours.end_time;
    
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    
    while (start < end) {
      const timeSlot = start.toTimeString().slice(0, 5);
      
      // Verificar que hay tiempo suficiente para el servicio
      const slotEnd = new Date(start.getTime() + durationMinutes * 60000);
      if (slotEnd <= end) {
        // Verificar que no se traslapa con citas existentes
        const isAvailable = !appointments.some(apt => {
          const aptStart = new Date(`1970-01-01T${apt.start_time}:00`);
          const aptEnd = new Date(`1970-01-01T${apt.end_time}:00`);
          
          return (start < aptEnd && slotEnd > aptStart);
        });

        // Verificar que no está bloqueado
        const isNotBlocked = !blockedSlots?.some(blocked => {
          const blockedStart = new Date(`1970-01-01T${blocked.start_time}:00`);
          const blockedEnd = new Date(`1970-01-01T${blocked.end_time}:00`);
          
          return (start < blockedEnd && slotEnd > blockedStart);
        });
        
        if (isAvailable && isNotBlocked) {
          slots.push(timeSlot);
        }
      }
      
      start.setMinutes(start.getMinutes() + 30);
    }
    
    return slots;
  };

  return getAvailableSlots();
};