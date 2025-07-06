
import { FC, useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { enGB } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarNavigation } from "./calendar/CalendarNavigation";
import { CalendarLegend } from "./calendar/CalendarLegend";
import { AvailabilityCalendar } from "./calendar/AvailabilityCalendar";
import { useAvailabilityData } from "./calendar/useAvailabilityData";

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
  const { availability, bookingCapacity, isLoading } = useAvailabilityData();
  const [currentMonth, setCurrentMonth] = useState<Date>(date || new Date());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
      setIsPopoverOpen(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
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
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
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
            <CalendarNavigation
              currentMonth={currentMonth}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
            />

            <AvailabilityCalendar
              date={date}
              currentMonth={currentMonth}
              availability={availability}
              bookingCapacity={bookingCapacity}
              participants={participants}
              onDateSelect={handleDateSelect}
              onMonthChange={setCurrentMonth}
            />
            
            <CalendarLegend />
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
