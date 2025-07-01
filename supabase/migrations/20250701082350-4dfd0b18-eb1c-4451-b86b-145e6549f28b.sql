
-- First, set all existing availability to unavailable
UPDATE public.availability 
SET is_available = false;

-- Delete all existing availability records to start fresh
DELETE FROM public.availability;

-- Create availability records for Saturdays only from 2025 to 2050
INSERT INTO public.availability (date, is_available, capacity, start_time, end_time)
SELECT 
  date_series as date,
  true as is_available,
  12 as capacity,
  '09:00:00'::time as start_time,
  '16:00:00'::time as end_time
FROM (
  SELECT generate_series('2025-01-01'::date, '2050-12-31'::date, '1 day'::interval)::date as date_series
) dates
WHERE EXTRACT(DOW FROM date_series) = 6; -- 6 = Saturday (0=Sunday, 1=Monday, ..., 6=Saturday)
