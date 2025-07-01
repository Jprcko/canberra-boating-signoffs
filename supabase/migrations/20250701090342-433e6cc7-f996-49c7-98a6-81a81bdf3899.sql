
-- First, let's clean up and create proper availability records for 2025
-- Delete any existing 2025 records to avoid duplicates
DELETE FROM public.availability WHERE date >= '2025-01-01' AND date <= '2025-12-31';

-- Create availability records for all Saturdays in 2025 (July through September initially)
-- This will create records for every Saturday from July 2025 through September 2025
WITH saturday_dates AS (
  SELECT generate_series(
    '2025-07-05'::date,  -- First Saturday in July 2025
    '2025-09-27'::date,  -- Last Saturday in September 2025
    '7 days'::interval
  )::date as date
)
INSERT INTO public.availability (date, is_available, capacity, start_time, end_time)
SELECT 
  date,
  true as is_available,
  7 as capacity,
  '09:00:00'::time as start_time,
  '16:00:00'::time as end_time
FROM saturday_dates;
