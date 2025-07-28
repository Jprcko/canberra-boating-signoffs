-- Add reminders_sent field to bookings table to track sent reminders
ALTER TABLE public.bookings 
ADD COLUMN reminders_sent TEXT[] DEFAULT '{}';

-- Add index for efficient querying of upcoming bookings
CREATE INDEX idx_bookings_date_reminders ON public.bookings(booking_date, reminders_sent);