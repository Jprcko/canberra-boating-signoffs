
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
    console.log(`Metadata:`, metadata);
    console.log(`isNewAccount:`, isNewAccount);

    // Send invite for new account (no automatic account creation with temp passwords)
    if (isNewAccount && metadata.user_email) {
      console.log('Sending account invitation to:', metadata.user_email);
      try {
        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
          metadata.user_email
        );

        if (inviteError) {
          console.error('Error sending account invitation:', inviteError);
          // Don't throw here, continue with confirmation emails
        } else {
          console.log('Account invitation sent successfully');
        }
      } catch (inviteError) {
        console.error('Exception sending account invitation:', inviteError);
        // Don't throw here, continue with confirmation emails
      }
    }

    // Send emails to all participants
    const emailPromises = participants.map(async (participant, index) => {
      try {
         // Prepare email content with explicit anti-ellipsis styling
         let emailContent = `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; white-space: normal; text-overflow: clip; overflow: visible; word-wrap: break-word;">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px; white-space: normal; text-overflow: clip; overflow: visible;">Booking Confirmation</h1>
             <p style="white-space: normal; text-overflow: clip; overflow: visible;">Dear ${participant.first_name},</p>
             <p style="white-space: normal; text-overflow: clip; overflow: visible;">Your boating session booking has been confirmed!</p>
             
             <div style="background-color: #f0f4f8; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: normal; text-overflow: clip; overflow: visible;">
               <h2 style="color: #1e40af; margin-top: 0; white-space: normal; text-overflow: clip; overflow: visible;">Booking Details</h2>
               <p style="white-space: normal; text-overflow: clip; overflow: visible;"><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString('en-AU', {
                 weekday: 'long',
                 year: 'numeric', 
                 month: 'long', 
                 day: 'numeric'
               })}</p>
               <p style="white-space: normal; text-overflow: clip; overflow: visible;"><strong>Start Time:</strong> 9:00 AM</p>
               <p style="white-space: normal; text-overflow: clip; overflow: visible;"><strong>Total Amount:</strong> $${booking.total_price}</p>
               ${participants.length > 1 ? `<p style="white-space: normal; text-overflow: clip; overflow: visible;"><strong>Group Size:</strong> ${participants.length} participants</p>` : ''}
             </div>

             <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: normal; text-overflow: clip; overflow: visible;">
               <h3 style="color: #065f46; margin-top: 0; white-space: normal; text-overflow: clip; overflow: visible;">What to Expect</h3>
               <ul style="color: #064e3b; white-space: normal; text-overflow: clip; overflow: visible;">
                 <li style="white-space: normal; text-overflow: clip; overflow: visible;">Complete your logbook requirements in one comprehensive session</li>
                 <li style="white-space: normal; text-overflow: clip; overflow: visible;">Professional supervision and guidance throughout</li>
                 <li style="white-space: normal; text-overflow: clip; overflow: visible;">Official sign-off upon successful completion</li>
                 <li style="white-space: normal; text-overflow: clip; overflow: visible;">Assistance with booking your Service NSW test</li>
               </ul>
             </div>

             <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: normal; text-overflow: clip; overflow: visible;">
               <h3 style="color: #92400e; margin-top: 0; white-space: normal; text-overflow: clip; overflow: visible;">What to Bring</h3>
               <ul style="color: #78350f; white-space: normal; text-overflow: clip; overflow: visible;">
                 <li style="white-space: normal; text-overflow: clip; overflow: visible;">Valid photo ID (driver's licence or passport)</li>
                 <li style="white-space: normal; text-overflow: clip; overflow: visible;">Comfortable clothing suitable for water activities</li>
                 <li style="white-space: normal; text-overflow: clip; overflow: visible;">Sun protection (hat, sunscreen, sunglasses)</li>
                 <li style="white-space: normal; text-overflow: clip; overflow: visible;">Water bottle and snacks</li>
               </ul>
             </div>
         `;

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

    // Check which participant emails need signup emails (don't have accounts yet)
    if (successfulEmails > 0) {
      // Get unique email addresses from participants
      const uniqueEmails = [...new Set(participants.map(p => p.email).filter(email => email && email.trim()))];
      console.log('Checking accounts for unique emails:', uniqueEmails);
      
      for (const email of uniqueEmails) {
        try {
          // Check if account exists for this email
          const { data: existingUser, error: userCheckError } = await supabaseAdmin.auth.admin.listUsers();
          
          const accountExists = existingUser?.users?.some(user => user.email === email);
          console.log(`Account check for ${email}: ${accountExists ? 'exists' : 'does not exist'}`);
          
          if (!accountExists) {
            console.log('Sending signup email to new email address:', email);
            
            const signupEmailContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #dbeafe; border-radius: 8px; white-space: normal; text-overflow: clip; overflow: visible;">
                <h3 style="color: #1e40af; margin-top: 0; white-space: normal; text-overflow: clip; overflow: visible;">Access Your Client Portal</h3>
                <p style="white-space: normal; text-overflow: clip; overflow: visible;">Set up your account to view bookings, update details, undertake quizzes, look at study material, and more. Use your email: ${email}</p>
                <p style="white-space: normal; text-overflow: clip; overflow: visible;"><a href="https://canberra-boating-signoffs.lovable.app/portal/signup?email=${encodeURIComponent(email)}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; white-space: normal; text-overflow: clip; overflow: visible;">Set Up Account</a></p>
                <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 14px; white-space: normal; text-overflow: clip; overflow: visible;">
                  Best regards,<br>ACT Boats & Licensing Team
                </div>
              </div>
            `;

            const { error: signupEmailError } = await resend.emails.send({
              from: "Boating Sessions <team@actboatsandlicensing.com.au>",
              to: email,
              subject: "Set Up Your Boating Portal Account",
              html: signupEmailContent,
            });

            if (signupEmailError) {
              console.error(`Error sending signup email to ${email}:`, signupEmailError);
            } else {
              console.log('Signup email sent successfully to:', email);
            }
          } else {
            console.log(`Skipping signup email for ${email} - account already exists`);
          }
        } catch (error) {
          console.error(`Exception checking/sending signup email for ${email}:`, error);
        }
      }
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
