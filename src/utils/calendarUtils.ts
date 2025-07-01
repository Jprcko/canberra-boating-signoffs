
import { format } from "date-fns";
import { Availability, BookingCapacity } from "@/services/availabilityService";

export const isDateAvailable = (
  checkDate: Date,
  availability: Availability[],
  bookingCapacity: BookingCapacity[],
  participants: string
) => {
  const dateString = format(checkDate, 'yyyy-MM-dd');
  const avail = availability.find(a => a.date === dateString);
  
  if (!avail || !avail.is_available) {
    return false;
  }

  // Check capacity
  const booking = bookingCapacity.find(b => b.booking_date === dateString);
  const currentBookings = booking?.total_participants || 0;
  const requestedParticipants = parseInt(participants);
  
  const hasCapacity = (currentBookings + requestedParticipants) <= avail.capacity;
  return hasCapacity;
};

export const getRemainingCapacity = (
  checkDate: Date,
  availability: Availability[],
  bookingCapacity: BookingCapacity[]
) => {
  const dateString = format(checkDate, 'yyyy-MM-dd');
  const avail = availability.find(a => a.date === dateString);
  const booking = bookingCapacity.find(b => b.booking_date === dateString);
  
  if (!avail) return 0;
  
  const currentBookings = booking?.total_participants || 0;
  return Math.max(0, avail.capacity - currentBookings);
};
