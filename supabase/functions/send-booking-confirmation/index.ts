
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking_id } = await req.json();
    
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

    // Fetch booking details including participants and services
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        booking_participants (*),
        booking_services (*)
      `)
      .eq('id', booking_id)
      .single();

    if (bookingError) throw bookingError;
    if (!booking) throw new Error('Booking not found');

    const participants = booking.booking_participants;
    const services = booking.booking_services;
    const metadata = booking.metadata;
    const isNewAccount = metadata?.account_created === true;

    console.log(`Processing booking confirmation for ${participants.length} participants`);

    // Send invite for new account (for the first participant's email)
    if (isNewAccount && metadata.user_email) {
      console.log('Sending account invitation to:', metadata.user_email);
      try {
        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
          metadata.user_email
        );

        if (inviteError) {
          console.error('Error sending account invitation:', inviteError);
          // Don't throw here, still send emails even if invite fails
        } else {
          console.log('Account invitation sent successfully');
        }
      } catch (inviteError) {
        console.error('Exception sending account invitation:', inviteError);
        // Don't throw here, still send emails even if invite fails
      }
    }

    // Send emails to all participants
    const emailPromises = participants.map(async (participant, index) => {
      try {
        // Prepare email content for each participant with mobile-friendly styling
        let emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px;">Booking Confirmation</h1>
            <p>Dear ${participant.first_name},</p>
            <p>Your boating session booking has been confirmed!</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1e40af; margin-top: 0;">Booking Details</h2>
              <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString('en-AU', {
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              })}</p>
              <p><strong>Preferred Time:</strong> ${metadata.preferred_time || 'To be confirmed'}</p>
              <p><strong>Total Amount:</strong> $${booking.total_price}</p>
              ${participants.length > 1 ? `<p><strong>Group Size:</strong> ${participants.length} participants</p>` : ''}
            </div>

            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">What to Expect</h3>
              <ul style="color: #064e3b;">
                <li>Complete your logbook requirements in one comprehensive session</li>
                <li>Professional supervision and guidance throughout</li>
                <li>Official sign-off upon successful completion</li>
                <li>Assistance with booking your Service NSW test</li>
              </ul>
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
        `;

        // Add account setup invitation if this is the primary participant and account was created
        if (index === 0 && isNewAccount && metadata.user_email === participant.email) {
          emailContent += `
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Set Up Your Account</h3>
              <p>Set up your account to view bookings, update details, and more.</p>
              <p><strong>Use your email:</strong> ${metadata.user_email}</p>
              <p style="margin: 15px 0;">
                <a href="https://canberra-boating-signoffs.lovable.app/portal/signup?email=${encodeURIComponent(metadata.user_email)}" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Set Up Account
                </a>
              </p>
              <p style="color: #374151; font-size: 14px;">
                An account invitation has been sent to your email. Check your inbox for setup instructions.
              </p>
            </div>
          `;
        }

        emailContent += `
            <div style="margin: 30px 0; text-align: center;">
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Looking forward to seeing you on the water!</p>
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

        // Send individual email
        const { data: emailResult, error: emailError } = await resend.emails.send({
          from: "Boating Sessions <team@actboatsandlicensing.com.au>",
          to: participant.email,
          subject: `Booking Confirmed - ${new Date(booking.booking_date).toLocaleDateString('en-AU')}`,
          html: emailContent,
        });

        if (emailError) {
          console.error(`Error sending email to ${participant.email}:`, emailError);
          throw emailError;
        }

        console.log(`Email sent successfully to ${participant.email}`);
        return { success: true, email: participant.email };
      } catch (error) {
        console.error(`Failed to send email to ${participant.email}:`, error);
        return { success: false, email: participant.email, error: error.message };
      }
    });

    // Wait for all emails to be sent
    const emailResults = await Promise.allSettled(emailPromises);
    
    // Count successful and failed emails
    const successfulEmails = emailResults.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;
    
    const failedEmails = emailResults.filter(result => 
      result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
    ).length;

    console.log(`Email summary - Successful: ${successfulEmails}, Failed: ${failedEmails}`);

    if (failedEmails > 0) {
      console.warn(`Some emails failed to send. Successful: ${successfulEmails}, Failed: ${failedEmails}`);
    }

    return new Response(
      JSON.stringify({ 
        message: "Email processing completed",
        successful_emails: successfulEmails,
        failed_emails: failedEmails,
        total_participants: participants.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: successfulEmails > 0 ? 200 : 500,
      }
    );
  } catch (error) {
    console.error("Error in send-booking-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
