
-- Create availability records for September, October, and November 2025
-- Using the same pattern as existing records (available, capacity 12, 9:00-16:00)
INSERT INTO public.availability (date, is_available, capacity, start_time, end_time)
SELECT 
  generate_series('2025-09-01'::date, '2025-11-30'::date, '1 day'::interval)::date as date,
  true as is_available,
  12 as capacity,
  '09:00:00'::time as start_time,
  '16:00:00'::time as end_time
ON CONFLICT (date) DO NOTHING;
