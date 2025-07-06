
import { FC, useEffect, useState } from "react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvailability, getBookingCapacity, Availability, BookingCapacity } from "@/services/availabilityService";

interface DateTimeSectionProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  participants?: string;
}

export const DateTimeSection: FC<DateTimeSectionProps> = ({
  date,
  onDateChange,
  participants = "2"
}) => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [bookingCapacity, setBookingCapacity] = useState<BookingCapacity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<Date>(date || new Date());

  useEffect(() => {
    loadAvailabilityData();
  }, []);

  const loadAvailabilityData = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      console.log('=== AVAILABILITY DATA LOADING ===');
      console.log('Loading availability data from:', startDate.toISOString().split('T')[0], 'to:', endDate.toISOString().split('T')[0]);

      const [availabilityData, capacityData] = await Promise.all([
        getAvailability(startDate, endDate),
        getBookingCapacity(startDate, endDate)
      ]);
      
      console.log('=== RAW AVAILABILITY DATA ===');
      console.log('Raw availability data:', availabilityData);
      console.log('Number of availability records:', availabilityData.length);
      
      console.log('=== DETAILED AVAILABILITY RECORDS ===');
      availabilityData.forEach((record, index) => {
        console.log(`Record ${index + 1}:`, {
          date: record.date,
          is_available: record.is_available,
          capacity: record.capacity,
          start_time: record.start_time,
          end_time: record.end_time
        });
      });
      
      console.log('=== RAW CAPACITY DATA ===');
      console.log('Raw capacity data:', capacityData);
      console.log('Number of capacity records:', capacityData.length);
      
      setAvailability(availabilityData);
      setBookingCapacity(capacityData);
    } catch (error) {
      console.error('=== ERROR LOADING AVAILABILITY ===');
      console.error('Error loading availability data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      console.log('=== DATE SELECTED ===');
      console.log('Selected date:', selectedDate);
      console.log('Formatted date:', format(selectedDate, 'yyyy-MM-dd'));
      console.log('Day of week:', selectedDate.toLocaleDateString('en-US', { weekday: 'long' }));
      onDateChange(selectedDate);
    }
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
              type="button"
              variant={"outline"} 
              className={cn(
                "w-full justify-start text-left font-normal", 
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: enGB }) : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start" 
            side="bottom" 
            sideOffset={5}
            onClick={e => e.stopPropagation()}
          >
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={handleDateSelect} 
              month={currentMonth}
              onMonthChange={setCurrentMonth}
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
              className="rounded-md border shadow-sm p-3"
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
            <div className="p-3 border-t text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span>Limited Capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span>Fully Booked</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {date && (
          <div className="text-sm text-gray-600">
            <p>Remaining capacity: {getRemainingCapacity(date)} people</p>
          </div>
        )}
      </div>

      {date && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md border border-blue-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Session runs from <strong>9:00 AM to 4:00 PM</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
