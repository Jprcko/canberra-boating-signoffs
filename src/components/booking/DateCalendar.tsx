
import { FC } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Availability, BookingCapacity } from "@/services/availabilityService";
import { isDateAvailable, getRemainingCapacity } from "@/utils/calendarUtils";

interface DateCalendarProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  availability: Availability[];
  bookingCapacity: BookingCapacity[];
  participants: string;
}

export const DateCalendar: FC<DateCalendarProps> = ({
  date,
  onDateChange,
  availability,
  bookingCapacity,
  participants
}) => {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      console.log('Date selected:', selectedDate, 'Day:', selectedDate.getDay());
      onDateChange(selectedDate);
    }
  };

  return (
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
          weekStartsOn={1}
          fixedWeeks={true}
          disabled={(checkDate) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            
            return checkDate < today || 
                   checkDate > maxDate || 
                   !isDateAvailable(checkDate, availability, bookingCapacity, participants);
          }}
          className="rounded-md border shadow-sm"
          modifiers={{
            available: (checkDate) => isDateAvailable(checkDate, availability, bookingCapacity, participants),
            limitedCapacity: (checkDate) => {
              const remaining = getRemainingCapacity(checkDate, availability, bookingCapacity);
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
  );
};
