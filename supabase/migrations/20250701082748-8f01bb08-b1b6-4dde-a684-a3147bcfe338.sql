
-- Update all existing availability records to have capacity of 7
UPDATE public.availability 
SET capacity = 7;

-- Also update the migration to use 7 as default for future records
