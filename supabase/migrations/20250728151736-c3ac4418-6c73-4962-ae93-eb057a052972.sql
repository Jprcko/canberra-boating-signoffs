-- Add reminders_sent field to bookings table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'reminders_sent'
    ) THEN
        ALTER TABLE public.bookings 
        ADD COLUMN reminders_sent text[] DEFAULT ARRAY[]::text[];
    END IF;
END $$;