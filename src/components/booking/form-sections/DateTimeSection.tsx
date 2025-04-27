
import { FC } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimeSectionProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export const DateTimeSection: FC<DateTimeSectionProps> = ({ date, onDateChange }) => {
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
              disabled={(date) => 
                date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                date > new Date(new Date().setMonth(new Date().getMonth() + 3))
              }
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred-time">Preferred Time</Label>
        <select 
          id="preferred-time"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-water-blue focus:border-transparent"
        >
          <option value="">Select a time</option>
          <option value="morning">Morning (9am - 12pm)</option>
          <option value="afternoon">Afternoon (1pm - 4pm)</option>
        </select>
      </div>
    </div>
  );
};
