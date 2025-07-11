import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service } from './useCart';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setServices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error, refetch: fetchServices };
};