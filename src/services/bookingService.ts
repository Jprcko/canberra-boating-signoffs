
import { supabase } from "@/integrations/supabase/custom-client";
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

    // Transform participant information to match database schema
    const participantsToInsert = participantsInfo
      .slice(0, Number(participants))
      .map(participant => ({
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

    return newBooking;
  } catch (error) {
    console.error('Error in submitBooking:', error);
    throw error;
  }
};
