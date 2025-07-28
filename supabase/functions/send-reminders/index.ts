import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Australia/Canberra timezone offset (AEDT: UTC+11, AEST: UTC+10)
const CANBERRA_TZ = "Australia/Canberra";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get current date in Canberra timezone
    const now = new Date();
    const canberraDate = new Intl.DateTimeFormat('en-AU', {
      timeZone: CANBERRA_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);

    // Calculate dates for 7 days and 24 hours ahead
    const nowInCanberra = new Date(now.toLocaleString("en-US", { timeZone: CANBERRA_TZ }));
    
    const sevenDaysFromNow = new Date(nowInCanberra);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const oneDayFromNow = new Date(nowInCanberra);
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    console.log(`Processing reminders for dates: 7-day (${sevenDaysFromNow.toISOString().split('T')[0]}), 24-hour (${oneDayFromNow.toISOString().split('T')[0]})`);

    // Query bookings for 7-day reminders
    const { data: sevenDayBookings, error: sevenDayError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        booking_participants (*),
        booking_services (*)
      `)
      .eq('booking_date', sevenDaysFromNow.toISOString().split('T')[0])
      .not('reminders_sent', 'cs', '["7day"]'); // Not contains '7day'

    if (sevenDayError) {
      console.error('Error fetching 7-day reminder bookings:', sevenDayError);
    }

    // Query bookings for 24-hour reminders
    const { data: oneDayBookings, error: oneDayError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        booking_participants (*),
        booking_services (*)
      `)
      .eq('booking_date', oneDayFromNow.toISOString().split('T')[0])
      .not('reminders_sent', 'cs', '["24hour"]'); // Not contains '24hour'

    if (oneDayError) {
      console.error('Error fetching 24-hour reminder bookings:', oneDayError);
    }

    let totalEmailsSent = 0;
    let totalEmailsFailed = 0;

    // Process 7-day reminders
    if (sevenDayBookings && sevenDayBookings.length > 0) {
      console.log(`Processing ${sevenDayBookings.length} bookings for 7-day reminders`);
      
      for (const booking of sevenDayBookings) {
        const emailResults = await sendReminderEmails(booking, '7-day', resend);
        totalEmailsSent += emailResults.successful;
        totalEmailsFailed += emailResults.failed;

        // Update booking to mark 7-day reminder as sent
        const currentReminders = booking.reminders_sent || [];
        const updatedReminders = [...currentReminders, '7day'];
        
        await supabaseAdmin
          .from('bookings')
          .update({ reminders_sent: updatedReminders })
          .eq('id', booking.id);
      }
    }

    // Process 24-hour reminders
    if (oneDayBookings && oneDayBookings.length > 0) {
      console.log(`Processing ${oneDayBookings.length} bookings for 24-hour reminders`);
      
      for (const booking of oneDayBookings) {
        const emailResults = await sendReminderEmails(booking, '24-hour', resend);
        totalEmailsSent += emailResults.successful;
        totalEmailsFailed += emailResults.failed;

        // Update booking to mark 24-hour reminder as sent
        const currentReminders = booking.reminders_sent || [];
        const updatedReminders = [...currentReminders, '24hour'];
        
        await supabaseAdmin
          .from('bookings')
          .update({ reminders_sent: updatedReminders })
          .eq('id', booking.id);
      }
    }

    console.log(`Reminder processing complete - Sent: ${totalEmailsSent}, Failed: ${totalEmailsFailed}`);

    return new Response(
      JSON.stringify({
        message: "Reminder processing completed",
        seven_day_bookings: sevenDayBookings?.length || 0,
        one_day_bookings: oneDayBookings?.length || 0,
        total_emails_sent: totalEmailsSent,
        total_emails_failed: totalEmailsFailed,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Helper function to send reminder emails to all participants
async function sendReminderEmails(booking: any, reminderType: '7-day' | '24-hour', resend: any) {
  const participants = booking.booking_participants;
  const metadata = booking.metadata;
  let successful = 0;
  let failed = 0;

  // Determine reminder timing text
  const timingText = reminderType === '7-day' 
    ? 'Your boating session is coming up in one week!'
    : 'Your boating session is tomorrow!';
  
  const urgencyStyle = reminderType === '24-hour'
    ? 'background-color: #fef2f2; border-left: 4px solid #ef4444;'
    : 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;';

  // Send emails to all participants
  const emailPromises = participants.map(async (participant: any) => {
    try {
      // Create personalized reminder email content
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px;">Booking Reminder</h1>
          
          <div style="${urgencyStyle} padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">${timingText}</p>
          </div>
          
          <p>Dear ${participant.first_name},</p>
          <p>This is a friendly reminder about your upcoming boating session booking.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">Booking Details</h2>
            <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: CANBERRA_TZ
            })}</p>
            <p><strong>Preferred Time:</strong> ${metadata.preferred_time || 'To be confirmed'}</p>
            <p><strong>Total Amount:</strong> $${booking.total_price}</p>
            ${participants.length > 1 ? `<p><strong>Group Size:</strong> ${participants.length} participants</p>` : ''}
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">What to Bring</h3>
            <ul style="color: #78350f;">
              <li>Valid photo ID (driver's licence or passport)</li>
              <li>Comfortable clothing suitable for water activities</li>
              <li>Sun protection (hat, sunscreen, sunglasses)</li>
              <li>Water bottle and snacks</li>
            </ul>
          </div>

          ${reminderType === '24-hour' ? `
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065f46; margin-top: 0;">Final Preparations</h3>
            <ul style="color: #064e3b;">
              <li>Check the weather forecast and dress appropriately</li>
              <li>Ensure you have all required items packed</li>
              <li>Plan your route to the meeting location</li>
              <li>Get a good night's sleep before your session</li>
            </ul>
          </div>
          ` : ''}

          <div style="margin: 30px 0; text-align: center;">
            <p>If you have any questions or need to make changes, please contact us as soon as possible.</p>
            <p><a href="https://canberra-boating-signoffs.lovable.app/portal" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Your Booking
              </a></p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Best regards,<br>ACT Boats & Licensing Team</p>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #9ca3af; margin: 5px 0;">
                We use your email only for booking-related communications.
              </p>
              <p style="font-size: 12px; margin: 5px 0;">
                <a href="mailto:team@actboatsandlicensing.com.au?subject=Unsubscribe Request" 
                   style="color: #6b7280; text-decoration: underline;">
                  Unsubscribe from booking communications
                </a>
              </p>
            </div>
          </div>
        </div>
      `;

      // Send the reminder email
      const { error: emailError } = await resend.emails.send({
        from: "Boating Sessions <team@actboatsandlicensing.com.au>",
        to: participant.email,
        subject: `${reminderType === '7-day' ? 'One Week' : 'Tomorrow'} - Boating Session Reminder`,
        html: emailContent,
      });

      if (emailError) {
        console.error(`Error sending ${reminderType} reminder to ${participant.email}:`, emailError);
        failed++;
        return { success: false, email: participant.email };
      }

      console.log(`${reminderType} reminder sent successfully to ${participant.email}`);
      successful++;
      return { success: true, email: participant.email };
    } catch (error) {
      console.error(`Failed to send ${reminderType} reminder to ${participant.email}:`, error);
      failed++;
      return { success: false, email: participant.email };
    }
  });

  // Wait for all emails to be sent
  await Promise.allSettled(emailPromises);

  return { successful, failed };
}