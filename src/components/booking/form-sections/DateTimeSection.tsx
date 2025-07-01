
import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { useAvailability } from "@/hooks/useAvailability";
import { DateCalendar } from "@/components/booking/DateCalendar";
import { getRemainingCapacity } from "@/utils/calendarUtils";

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
  const { availability, bookingCapacity, isLoading } = useAvailability();

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
        <DateCalendar
          date={date}
          onDateChange={onDateChange}
          availability={availability}
          bookingCapacity={bookingCapacity}
          participants={participants}
        />
        
        {date && (
          <div className="text-sm text-gray-600">
            <p>Remaining capacity: {getRemainingCapacity(date, availability, bookingCapacity)} people</p>
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
