import { supabase } from "@/integrations/supabase/client";
import { ParticipantInfo } from "@/types/booking";

export interface BookingData {
  bookingDate: string;
  totalPrice: number;
  discountAmount: number;
  userId: string | null;
  preferredTime: string;
  selectedServices: string[];
  participants: string;
  participantsInfo: ParticipantInfo[];
  additionalInfo?: string;
  promoCode?: string;
}

export const submitBooking = async (data: BookingData) => {
  // Format the date for PostgreSQL
  const { bookingDate, totalPrice, discountAmount, userId, preferredTime, 
    selectedServices, participants, participantsInfo, additionalInfo, promoCode } = data;
  
  // Prepare booking data
  const bookingData = {
    booking_date: bookingDate,
    total_price: totalPrice,
    discount_amount: discountAmount,
    user_id: userId,
    metadata: {
      preferred_time: preferredTime,
      additional_info: additionalInfo || null,
      promo_code: promoCode || null
    },
  };

  try {
    console.log("Submitting booking with data:", bookingData);
    
    // Insert main booking record
    const { data: newBookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (bookingError) {
      console.error('Booking insert error:', bookingError);
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }
    
    if (!newBookingData) {
      throw new Error("Failed to create booking - no data returned");
    }

    console.log("Booking created successfully:", newBookingData);
    const newBooking = newBookingData;

    // Insert selected services
    const bookingServices = selectedServices.map(serviceId => ({
      booking_id: newBooking.id,
      service_id: serviceId,
      price_per_person: serviceId === 'test' ? 149 : 499,
      participants: Number(participants)
    }));

    console.log("Adding booking services:", bookingServices);
    const { error: servicesError } = await supabase
      .from('booking_services')
      .insert(bookingServices);

    if (servicesError) {
      console.error('Services insert error:', servicesError);
      throw new Error(`Failed to add booking services: ${servicesError.message}`);
    }

    // Filter out empty participant records
    // Only keep participants that have at least first name, last name, email and phone
    const validParticipants = participantsInfo
      .slice(0, Number(participants))
      .filter(participant => 
        participant.firstName && 
        participant.lastName && 
        participant.email && 
        participant.phone
      );

    if (validParticipants.length === 0) {
      throw new Error("At least one valid participant is required");
    }

    // Transform participant information to match database schema
    const participantsToInsert = validParticipants.map(participant => ({
      booking_id: newBooking.id,
      first_name: participant.firstName,
      middle_name: participant.middleName || null,
      last_name: participant.lastName,
      email: participant.email,
      phone: participant.phone
    }));

    console.log("Adding booking participants:", participantsToInsert);
    const { error: participantsError } = await supabase
      .from('booking_participants')
      .insert(participantsToInsert);

    if (participantsError) {
      console.error('Participants insert error:', participantsError);
      throw new Error(`Failed to add booking participants: ${participantsError.message}`);
    }

    // Send confirmation email
    try {
      console.log("Sending booking confirmation email for booking ID:", newBooking.id);
      
      // Check if we need to create an account for this user
      let accountCreated = false;
      let tempPassword = null;
      let userEmail = null;
      
      // If user is not logged in but we have their email, we can create an account
      if (!userId && validParticipants.length > 0) {
        // Generate a random temporary password
        tempPassword = Math.random().toString(36).slice(-8);
        userEmail = validParticipants[0].email;
        
        // Update the booking metadata to include account creation info
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            metadata: {
              ...bookingData.metadata,
              account_created: true,
              user_email: userEmail,
              temp_password: tempPassword
            }
          })
          .eq('id', newBooking.id);
          
        if (updateError) {
          console.error('Failed to update booking with account info:', updateError);
        } else {
          accountCreated = true;
        }
      }
      
      // Call the edge function to send confirmation email
      const { error: emailError } = await supabase.functions.invoke(
        'send-booking-confirmation',
        {
          body: {
            booking_id: newBooking.id
          }
        }
      );
      
      if (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't throw here, we still want to return the booking even if email fails
      } else {
        console.log('Confirmation email sent successfully');
      }
    } catch (emailError) {
      console.error('Exception sending confirmation email:', emailError);
      // Don't throw here, we still want to return the booking even if email fails
    }

    return newBooking;
  } catch (error) {
    console.error('Error in submitBooking:', error);
    throw error;
  }
};
