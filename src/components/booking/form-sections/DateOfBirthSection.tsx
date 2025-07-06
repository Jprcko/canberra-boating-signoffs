
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParticipantInfo } from "@/types/booking";

interface DateOfBirthSectionProps {
  participant: ParticipantInfo;
  index: number;
  onDateChange: (date: Date | undefined) => void;
}

export const DateOfBirthSection = ({ participant, index, onDateChange }: DateOfBirthSectionProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Handle date selection with stopPropagation to prevent unintended form submission
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Prevent event propagation to avoid triggering form validation
      onDateChange(date);
      setIsPopoverOpen(false); // Close the popover when date is selected
    }
  };
  
  return (
    <div>
      <Label htmlFor={`dateOfBirth-${index}`} className="text-sm font-medium">
        Date of Birth *
      </Label>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id={`dateOfBirth-${index}`}
            type="button" // Explicitly set type to button to prevent form submission
            variant={"outline"}
            className={cn(
              "w-full mt-1 justify-start text-left font-normal",
              !participant.dateOfBirth && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {participant.dateOfBirth ? (
              format(participant.dateOfBirth, "dd MMMM yyyy")
            ) : (
              <span>Select your date of birth</span>
            )}
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
            selected={participant.dateOfBirth}
            onSelect={handleDateSelect}
            disabled={(date) => date > new Date()}
            initialFocus
            captionLayout="dropdown-buttons"
            fromYear={1900}
            toYear={new Date().getFullYear()}
            defaultMonth={participant.dateOfBirth || new Date(2000, 0)}
            showOutsideDays={false}
            className="rounded-md border shadow-sm p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <p className="text-sm text-gray-500 mt-1">
        You must be at least 12 years old to participate
      </p>
    </div>
  );
};
