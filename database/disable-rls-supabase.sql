-- Deshabilitar RLS en todas las tablas
-- Esto permite que los servicios de backend accedan directamente
-- Ya que la autenticación se maneja a nivel de servicio, no de Supabase Auth

-- Tablas principales
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.brigada DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrante DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.brigadaintegrante DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conglomerado DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.brigadaconglomerado DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.especie DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clasificaciontaxonomica DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.observacion DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.muestra DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.muestraespecie DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subparcela DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subparcelamuestra DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conglomeradosubparcela DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicador DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conglomeradoindicador DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyecto DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectobrigada DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_auditoria DISABLE ROW LEVEL SECURITY;

-- Nota: spatial_ref_sys es una tabla del sistema de PostGIS, déjala como está

SELECT
    schemaname,
    tablename,
    CASE
        WHEN rowsecurity THEN 'RLS Enabled ⚠️'
        ELSE 'RLS Disabled ✅'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename NOT LIKE 'spatial_ref_sys'
ORDER BY tablename;
