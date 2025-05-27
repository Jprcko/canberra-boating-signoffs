
import { FC, useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvailability, getBookingCapacity, Availability, BookingCapacity } from "@/services/availabilityService";

interface DateTimeSectionProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  preferredTime: string;
  onPreferredTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  participants?: string;
}

export const DateTimeSection: FC<DateTimeSectionProps> = ({
  date,
  onDateChange,
  preferredTime,
  onPreferredTimeChange,
  participants = "2"
}) => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [bookingCapacity, setBookingCapacity] = useState<BookingCapacity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAvailabilityData();
  }, []);

  const loadAvailabilityData = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const [availabilityData, capacityData] = await Promise.all([
        getAvailability(startDate, endDate),
        getBookingCapacity(startDate, endDate)
      ]);
      
      setAvailability(availabilityData);
      setBookingCapacity(capacityData);
    } catch (error) {
      console.error('Error loading availability data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDateAvailable = (checkDate: Date) => {
    const dateString = format(checkDate, 'yyyy-MM-dd');
    const avail = availability.find(a => a.date === dateString);
    
    if (!avail || !avail.is_available) {
      return false;
    }

    // Check capacity
    const booking = bookingCapacity.find(b => b.booking_date === dateString);
    const currentBookings = booking?.total_participants || 0;
    const requestedParticipants = parseInt(participants);
    
    return (currentBookings + requestedParticipants) <= avail.capacity;
  };

  const getAvailableTimeSlots = () => {
    if (!date) return [];

    const dateString = format(date, 'yyyy-MM-dd');
    const avail = availability.find(a => a.date === dateString);
    
    if (!avail) return [];

    // For now, we'll show the full day time range
    // You can extend this to show specific time slots
    return [
      { value: "morning", label: `Morning (${avail.start_time} - 12:00)` },
      { value: "afternoon", label: `Afternoon (12:00 - ${avail.end_time})` },
      { value: "full-day", label: `Full Day (${avail.start_time} - ${avail.end_time})` }
    ];
  };

  const getRemainingCapacity = (checkDate: Date) => {
    const dateString = format(checkDate, 'yyyy-MM-dd');
    const avail = availability.find(a => a.date === dateString);
    const booking = bookingCapacity.find(b => b.booking_date === dateString);
    
    if (!avail) return 0;
    
    const currentBookings = booking?.total_participants || 0;
    return Math.max(0, avail.capacity - currentBookings);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Preferred Date</Label>
          <div className="p-4 text-center text-gray-500">Loading available dates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Preferred Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={"outline"} 
              className={cn(
                "w-full justify-start text-left font-normal", 
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={onDateChange} 
              initialFocus 
              disabled={(checkDate) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const maxDate = new Date();
                maxDate.setMonth(maxDate.getMonth() + 3);
                
                return checkDate < today || 
                       checkDate > maxDate || 
                       !isDateAvailable(checkDate);
              }}
              className="pointer-events-auto"
              modifiers={{
                available: (checkDate) => isDateAvailable(checkDate),
                limitedCapacity: (checkDate) => {
                  const remaining = getRemainingCapacity(checkDate);
                  return remaining > 0 && remaining <= 6;
                }
              }}
              modifiersStyles={{
                available: { backgroundColor: '#dcfce7' },
                limitedCapacity: { backgroundColor: '#fef3c7' }
              }}
            />
          </PopoverContent>
        </Popover>
        
        {date && (
          <div className="text-sm text-gray-600">
            <p>Remaining capacity: {getRemainingCapacity(date)} people</p>
          </div>
        )}
      </div>

      {date && getAvailableTimeSlots().length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="preferredTime">Preferred Time</Label>
          <select
            id="preferredTime"
            value={preferredTime}
            onChange={onPreferredTimeChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a time slot</option>
            {getAvailableTimeSlots().map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
