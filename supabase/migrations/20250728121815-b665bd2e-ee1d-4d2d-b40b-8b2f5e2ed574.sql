-- Enable required extensions for cron scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the send-reminders function to run daily at 9 AM
SELECT cron.schedule(
  'daily-booking-reminders',
  '0 9 * * *', -- Every day at 9:00 AM
  $$
  SELECT
    net.http_post(
        url:='https://bnhvxnoabedbsqharezp.supabase.co/functions/v1/send-reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaHZ4bm9hYmVkYnNxaGFyZXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTEyNzIsImV4cCI6MjA2MzQ4NzI3Mn0.2tiewoleX10RPmGIAnAcM3ColRMIQgXToeboGfhnvJ4"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);