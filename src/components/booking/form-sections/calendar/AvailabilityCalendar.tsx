
import { FC } from "react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Availability, BookingCapacity } from "@/services/availabilityService";

interface AvailabilityCalendarProps {
  date: Date | undefined;
  currentMonth: Date;
  availability: Availability[];
  bookingCapacity: BookingCapacity[];
  participants: string;
  onDateSelect: (selectedDate: Date | undefined) => void;
  onMonthChange: (month: Date) => void;
}

export const AvailabilityCalendar: FC<AvailabilityCalendarProps> = ({
  date,
  currentMonth,
  availability,
  bookingCapacity,
  participants,
  onDateSelect,
  onMonthChange
}) => {
  const isDateAvailable = (checkDate: Date) => {
    const dateString = format(checkDate, 'yyyy-MM-dd');
    const avail = availability.find(a => a.date === dateString);
    
    console.log(`=== CHECKING DATE: ${dateString} ===`);
    console.log('Day of week:', checkDate.toLocaleDateString('en-US', { weekday: 'long' }));
    console.log('Found availability record:', !!avail);
    
    if (avail) {
      console.log('Availability record details:', {
        date: avail.date,
        is_available: avail.is_available,
        capacity: avail.capacity,
        start_time: avail.start_time,
        end_time: avail.end_time
      });
    } else {
      console.log('No availability record found for:', dateString);
      console.log('Available dates in system:', availability.map(a => a.date));
    }
    
    if (!avail || !avail.is_available) {
      console.log(`Date ${dateString} NOT AVAILABLE:`, avail ? 'marked as unavailable' : 'no record found');
      return false;
    }

    // Check capacity
    const booking = bookingCapacity.find(b => b.booking_date === dateString);
    const currentBookings = booking?.total_participants || 0;
    const requestedParticipants = parseInt(participants);
    
    const hasCapacity = (currentBookings + requestedParticipants) <= avail.capacity;
    console.log(`Date ${dateString} capacity check:`, {
      currentBookings,
      requestedParticipants,
      totalCapacity: avail.capacity,
      hasCapacity
    });
    
    console.log(`=== FINAL RESULT FOR ${dateString}: ${hasCapacity ? 'AVAILABLE' : 'NOT AVAILABLE'} ===`);
    return hasCapacity;
  };

  const getRemainingCapacity = (checkDate: Date) => {
    const dateString = format(checkDate, 'yyyy-MM-dd');
    const avail = availability.find(a => a.date === dateString);
    const booking = bookingCapacity.find(b => b.booking_date === dateString);
    
    if (!avail) return 0;
    
    const currentBookings = booking?.total_participants || 0;
    return Math.max(0, avail.capacity - currentBookings);
  };

  return (
    <Calendar 
      mode="single" 
      selected={date} 
      onSelect={onDateSelect} 
      month={currentMonth}
      onMonthChange={onMonthChange}
      disabled={(checkDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        
        const isDisabled = checkDate < today || 
               checkDate > maxDate || 
               !isDateAvailable(checkDate);
        
        if (isDisabled) {
          console.log(`Date ${format(checkDate, 'yyyy-MM-dd')} is DISABLED`);
        }
        
        return isDisabled;
      }}
      className="w-full [&_.rdp-nav]:!hidden [&_.rdp-nav_button]:!hidden [&_.rdp-button_reset]:!hidden [&_button[name='previous-month']]:!hidden [&_button[name='next-month']]:!hidden [&_.rdp]:w-full [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full"
      locale={enGB}
      weekStartsOn={1}
      modifiers={{
        available: (checkDate) => isDateAvailable(checkDate),
        limitedCapacity: (checkDate) => {
          const remaining = getRemainingCapacity(checkDate);
          return remaining > 0 && remaining <= 6;
        },
        fullyBooked: (checkDate) => {
          const dateString = format(checkDate, 'yyyy-MM-dd');
          const avail = availability.find(a => a.date === dateString);
          const booking = bookingCapacity.find(b => b.booking_date === dateString);
          const currentBookings = booking?.total_participants || 0;
          return avail?.is_available && currentBookings >= (avail?.capacity || 0);
        }
      }}
      modifiersStyles={{
        available: { backgroundColor: '#dcfce7', color: '#166534' },
        limitedCapacity: { backgroundColor: '#fef3c7' },
        fullyBooked: { backgroundColor: '#fecaca', color: '#dc2626' }
      }}
    />
  );
};
