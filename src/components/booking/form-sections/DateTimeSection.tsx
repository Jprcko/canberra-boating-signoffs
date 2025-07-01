import { FC, useEffect, useState } from "react";
import { format } from "date-fns";
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
        const testDate = new Date(record.date + 'T00:00:00');
        console.log(`Record ${index + 1}:`, {
          date: record.date,
          is_available: record.is_available,
          capacity: record.capacity,
          start_time: record.start_time,
          end_time: record.end_time,
          dateObject: testDate,
          dayOfWeek: testDate.getDay(),
          dayName: testDate.toLocaleDateString('en-AU', { weekday: 'long' }),
          timezoneOffset: testDate.getTimezoneOffset()
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
    console.log('Input checkDate:', checkDate);
    console.log('Input checkDate getDay():', checkDate.getDay());
    console.log('Input checkDate day name:', checkDate.toLocaleDateString('en-AU', { weekday: 'long' }));
    console.log('Input checkDate timezone offset:', checkDate.getTimezoneOffset());
    console.log('Found availability record:', !!avail);
    
    if (avail) {
      const dbDate = new Date(avail.date + 'T00:00:00');
      console.log('DB date object:', dbDate);
      console.log('DB date getDay():', dbDate.getDay());
      console.log('DB date day name:', dbDate.toLocaleDateString('en-AU', { weekday: 'long' }));
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
      console.log('Selected date getDay():', selectedDate.getDay());
      console.log('Selected date day name:', selectedDate.toLocaleDateString('en-AU', { weekday: 'long' }));
      console.log('Formatted date:', format(selectedDate, 'yyyy-MM-dd'));
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
              {date ? format(date, "PPP") : <span>Select a date</span>}
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
              initialFocus 
              captionLayout="dropdown-buttons"
              fromYear={new Date().getFullYear()}
              toYear={new Date().getFullYear() + 1}
              defaultMonth={date || new Date()}
              showOutsideDays={false}
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
              className="rounded-md border shadow-sm p-3 pointer-events-auto"
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
