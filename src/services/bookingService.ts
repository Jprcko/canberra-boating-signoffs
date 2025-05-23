
import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingService, BookingParticipant } from "@/types/database";
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

  // Insert main booking record - Using a complete type assertion
  const { data: newBookingData, error: bookingError } = await (supabase
    .from('bookings') as any)
    .insert(bookingData)
    .select()
    .single();

  if (bookingError) throw bookingError;
  
  if (!newBookingData) throw new Error("Failed to create booking");

  // Use type assertion for the response data
  const newBooking = newBookingData as any;

  // Insert selected services
  const bookingServices = selectedServices.map(serviceId => ({
    booking_id: newBooking.id,
    service_id: serviceId,
    price_per_person: serviceId === 'test' ? 149 : 499,
    participants: Number(participants)
  }));

  const { error: servicesError } = await (supabase
    .from('booking_services') as any)
    .insert(bookingServices);

  if (servicesError) throw servicesError;

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

  const { error: participantsError } = await (supabase
    .from('booking_participants') as any)
    .insert(participantsToInsert);

  if (participantsError) throw participantsError;

  return newBooking;
};
