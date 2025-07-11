-- =================================================================
-- SISTEMA DE AGENDAMIENTO PARA SALÓN DE BELLEZA
-- Migración inicial: Crear estructura completa de base de datos
-- =================================================================

-- 1. TABLA DE SERVICIOS
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. TABLA DE CLIENTES
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  whatsapp VARCHAR(20) NOT NULL UNIQUE, -- WhatsApp como identificador único
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. TABLA DE HORARIOS DE NEGOCIO
CREATE TABLE public.business_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=domingo, 6=sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(day_of_week)
);

-- 4. TABLA DE CITAS
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  total_duration_minutes INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  cancellation_token UUID UNIQUE, -- Para permitir cancelación por link
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. TABLA DE SERVICIOS POR CITA (muchos a muchos)
CREATE TABLE public.appointment_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  price DECIMAL(10,2) NOT NULL, -- Precio al momento de la cita
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(appointment_id, service_id)
);

-- 6. TABLA DE GASTOS
CREATE TABLE public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('fixed', 'variable')),
  category VARCHAR(100) NOT NULL, -- ej: "Renta", "Insumos", "Servicios"
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  is_monthly BOOLEAN DEFAULT false, -- Para gastos fijos mensuales
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. TABLA DE CONFIGURACIÓN DEL NEGOCIO
CREATE TABLE public.business_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_name VARCHAR(100) NOT NULL DEFAULT 'Bella Nails',
  salon_description TEXT,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  booking_advance_days INTEGER DEFAULT 30, -- Días de anticipación para reservas
  reminder_hours_before INTEGER DEFAULT 24, -- Horas antes para recordatorio
  cancellation_hours_before INTEGER DEFAULT 4, -- Horas mínimas para cancelar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =================================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =================================================================

CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_client ON public.appointments(client_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_clients_whatsapp ON public.clients(whatsapp);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date);
CREATE INDEX idx_expenses_type ON public.expenses(type);

-- =================================================================
-- TRIGGERS PARA UPDATED_AT
-- =================================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para cada tabla
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_hours_updated_at
  BEFORE UPDATE ON public.business_hours
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_config_updated_at
  BEFORE UPDATE ON public.business_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =================================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_config ENABLE ROW LEVEL SECURITY;

-- Políticas públicas básicas (para empezar)
-- Nota: Estas son políticas permisivas para el desarrollo inicial
-- Se ajustarán cuando implementemos autenticación

-- Servicios: lectura pública, escritura solo autenticados
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can manage services" ON public.services
  FOR ALL USING (auth.role() = 'authenticated');

-- Clientes: acceso solo para autenticados
CREATE POLICY "Authenticated can manage clients" ON public.clients
  FOR ALL USING (auth.role() = 'authenticated');

-- Horarios: lectura pública
CREATE POLICY "Public can view business hours" ON public.business_hours
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage business hours" ON public.business_hours
  FOR ALL USING (auth.role() = 'authenticated');

-- Citas: acceso solo para autenticados
CREATE POLICY "Authenticated can manage appointments" ON public.appointments
  FOR ALL USING (auth.role() = 'authenticated');

-- Servicios de citas: acceso solo para autenticados
CREATE POLICY "Authenticated can manage appointment services" ON public.appointment_services
  FOR ALL USING (auth.role() = 'authenticated');

-- Gastos: solo para autenticados
CREATE POLICY "Authenticated can manage expenses" ON public.expenses
  FOR ALL USING (auth.role() = 'authenticated');

-- Configuración: lectura pública, escritura autenticada
CREATE POLICY "Public can view business config" ON public.business_config
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage business config" ON public.business_config
  FOR ALL USING (auth.role() = 'authenticated');

-- =================================================================
-- DATOS INICIALES
-- =================================================================

-- Insertar servicios de ejemplo
INSERT INTO public.services (name, description, price, duration_minutes, is_active) VALUES
('Manicure Gel', 'Manicure completo con esmaltado en gel de larga duración. Incluye limado, cutícula y diseño básico.', 350.00, 60, true),
('Pedicure Spa', 'Pedicure relajante con exfoliación, masaje y esmaltado. Incluye tratamiento hidratante.', 450.00, 90, true),
('Diseño de Arte', 'Diseños artísticos personalizados en uñas. Desde patrones simples hasta arte detallado.', 200.00, 30, true),
('Manicure Francesa', 'Clásico diseño francés con acabado elegante y natural.', 320.00, 45, true),
('Pedicure Express', 'Pedicure rápido para mantenimiento. Incluye limado, cutícula y esmaltado.', 280.00, 45, true),
('Uñas Acrílicas', 'Extensión de uñas con acrílico. Incluye forma personalizada y esmaltado.', 500.00, 120, true),
('Retoque de Gel', 'Mantenimiento de manicure gel. Retoque de raíz y brillo.', 180.00, 30, true);

-- Insertar horarios de trabajo (Lunes=1, Domingo=0)
INSERT INTO public.business_hours (day_of_week, start_time, end_time, is_closed) VALUES
(1, '09:00', '19:00', false), -- Lunes
(2, '09:00', '19:00', false), -- Martes
(3, '09:00', '19:00', false), -- Miércoles
(4, '09:00', '19:00', false), -- Jueves
(5, '09:00', '19:00', false), -- Viernes
(6, '10:00', '18:00', false), -- Sábado
(0, '10:00', '16:00', true);  -- Domingo (cerrado)

-- Insertar configuración inicial del negocio
INSERT INTO public.business_config (
  salon_name, 
  salon_description, 
  address, 
  phone, 
  email,
  booking_advance_days,
  reminder_hours_before,
  cancellation_hours_before
) VALUES (
  'Bella Nails',
  'Salón de belleza especializado en manicure, pedicure y diseño de uñas. Más de 5 años creando belleza en Hermosillo.',
  'Centro de Hermosillo, Sonora',
  '(662) 123-4567',
  'contacto@bellanails.com',
  30,
  24,
  4
);

-- Insertar algunos gastos fijos de ejemplo
INSERT INTO public.expenses (type, category, description, amount, expense_date, is_monthly) VALUES
('fixed', 'Renta', 'Renta mensual del local', 8000.00, CURRENT_DATE, true),
('fixed', 'Servicios', 'Electricidad mensual', 1200.00, CURRENT_DATE, true),
('fixed', 'Servicios', 'Agua mensual', 300.00, CURRENT_DATE, true),
('fixed', 'Servicios', 'Internet mensual', 500.00, CURRENT_DATE, true),
('fixed', 'Personal', 'Sueldo asistente', 6000.00, CURRENT_DATE, true);

-- =================================================================
-- COMENTARIOS FINALES
-- =================================================================

-- La base de datos está lista para:
-- ✅ Gestionar servicios y precios
-- ✅ Registrar clientes con WhatsApp como ID único
-- ✅ Configurar horarios de trabajo
-- ✅ Crear y gestionar citas
-- ✅ Tracking de servicios por cita
-- ✅ Control de gastos fijos y variables
-- ✅ Configuración general del negocio
-- ✅ Seguridad básica con RLS
-- ✅ Optimización con índices
-- ✅ Triggers para auditoría

COMMENT ON TABLE public.services IS 'Catálogo de servicios ofrecidos por el salón';
COMMENT ON TABLE public.clients IS 'Información de clientas (WhatsApp como ID único)';
COMMENT ON TABLE public.business_hours IS 'Horarios de operación por día de la semana';
COMMENT ON TABLE public.appointments IS 'Citas agendadas con todos los detalles';
COMMENT ON TABLE public.appointment_services IS 'Servicios incluidos en cada cita';
COMMENT ON TABLE public.expenses IS 'Registro de gastos fijos y variables';
COMMENT ON TABLE public.business_config IS 'Configuración general del negocio';