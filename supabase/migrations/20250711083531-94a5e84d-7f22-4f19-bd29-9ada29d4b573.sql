-- Create blocked_time_slots table for managing blocked/unavailable time slots
CREATE TABLE public.blocked_time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_date DATE NOT NULL,
  start_time TIME WITHOUT TIME ZONE NOT NULL,
  end_time TIME WITHOUT TIME ZONE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blocked_time_slots ENABLE ROW LEVEL SECURITY;

-- Create policies for blocked_time_slots
CREATE POLICY "Authenticated can manage blocked time slots" 
ON public.blocked_time_slots 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blocked_time_slots_updated_at
BEFORE UPDATE ON public.blocked_time_slots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_blocked_time_slots_date ON public.blocked_time_slots(block_date);