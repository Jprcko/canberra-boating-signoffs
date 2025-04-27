
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

    // Fetch booking details including participants and metadata
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        booking_participants (*)
      `)
      .eq('id', booking_id)
      .single();

    if (bookingError) throw bookingError;
    if (!booking) throw new Error('Booking not found');

    const participant = booking.booking_participants[0];
    const metadata = booking.metadata;
    const isNewAccount = metadata?.account_created === true;

    // Prepare email content
    let emailContent = `
      <h1>Booking Confirmation</h1>
      <p>Dear ${participant.first_name},</p>
      <p>Your booking has been confirmed for ${new Date(booking.booking_date).toLocaleDateString()}.</p>
      <p>Total amount: $${booking.total_price}</p>
    `;

    // Add account credentials if a new account was created
    if (isNewAccount) {
      const tempPassword = metadata.temp_password;
      emailContent += `
        <h2>Your Account Details</h2>
        <p>We've created an account for you to manage your bookings:</p>
        <p>Email: ${metadata.user_email}</p>
        <p>Temporary Password: ${tempPassword}</p>
        <p>Please log in and change your password as soon as possible.</p>
      `;

      // Create the user account
      const { error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email: metadata.user_email,
        password: tempPassword,
        email_confirm: true
      });

      if (signUpError) throw signUpError;
    }

    // Send the email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: "Bookings <onboarding@resend.dev>",
      to: participant.email,
      subject: "Your Booking Confirmation",
      html: emailContent,
    });

    if (emailError) throw emailError;

    return new Response(
      JSON.stringify({ message: "Confirmation email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
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
