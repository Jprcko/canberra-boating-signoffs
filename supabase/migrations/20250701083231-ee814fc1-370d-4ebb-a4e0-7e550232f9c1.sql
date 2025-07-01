
-- Update all existing availability records to be available
UPDATE public.availability 
SET is_available = true, updated_at = now()
WHERE is_available = false;
