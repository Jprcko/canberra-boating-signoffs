
import { FC } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavigationProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarNavigation: FC<CalendarNavigationProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousMonth}
        className="flex items-center gap-1 h-7 w-7 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <h3 className="text-sm font-semibold">
        {format(currentMonth, 'MMMM yyyy')}
      </h3>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNextMonth}
        className="flex items-center gap-1 h-7 w-7 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
