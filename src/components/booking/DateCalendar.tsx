import { FC, useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { enGB as baseEnGB } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Availability, BookingCapacity } from "@/services/availabilityService";
import { isDateAvailable } from "@/utils/calendarUtils";

// ✅ This overrides week start to Monday
const enGB = {
  ...baseEnGB,
  options: {
    ...baseEnGB.options,
    weekStartsOn: 1,
  },
};

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
  participants,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(date || new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      console.log("Date selected:", selectedDate, "Day:", selectedDate.getDay());
      onDateChange(selectedDate);
    }
  };

  const getAvailabilityForDate = (checkDate: Date) => {
    const dateString = format(checkDate, "yyyy-MM-dd");
    return availability.find((a) => a.date === dateString);
  };

  const getBookingCountForDate = (checkDate: Date) => {
    const dateString = format(checkDate, "yyyy-MM-dd");
    const booking = bookingCapacity.find((b) => b.booking_date === dateString);
    return booking?.total_participants || 0;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
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
        className="w-auto p-0 bg-white z-50"
        align="start"
        side="bottom"
        sideOffset={5}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousMonth}
              className="flex items-center gap-1"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <h3 className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </h3>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="flex items-center gap-1"
              type="button"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={enGB}
            showOutsideDays={false}
            disabled={(checkDate) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const maxDate = new Date();
              maxDate.setMonth(maxDate.getMonth() + 3);

              return (
                checkDate < today ||
                checkDate > maxDate ||
                !isDateAvailable(checkDate, availability, bookingCapacity, participants)
              );
            }}
            className="rounded-md border p-3 pointer-events-auto"
            modifiers={{
              available: (checkDate) => {
                const avail = getAvailabilityForDate(checkDate);
                const bookingCount = getBookingCountForDate(checkDate);
                return avail?.is_available && bookingCount < (avail?.capacity || 0);
              },
              fullyBooked: (checkDate) => {
                const avail = getAvailabilityForDate(checkDate);
                const bookingCount = getBookingCountForDate(checkDate);
                return avail?.is_available && bookingCount >= (avail?.capacity || 0);
              },
            }}
            modifiersStyles={{
              available: { backgroundColor: "#dcfce7", color: "#166534" },
              fullyBooked: { backgroundColor: "#fecaca", color: "#dc2626" },
            }}
          />

          {/* Legend */}
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Fully Booked</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
