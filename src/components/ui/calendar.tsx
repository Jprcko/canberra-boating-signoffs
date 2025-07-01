import * as React from "react";
import { DayPicker } from "react-day-picker";
import { enGB } from "date-fns/locale";   // ← correct source
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = enGB,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}      // Monday-first locale
      weekStartsOn={1}     // explicit fallback
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{ /* your existing classNames… */ }}
      components={{
        IconLeft: (p) => <ChevronLeft className="h-4 w-4" {...p} />,
        IconRight: (p) => <ChevronRight className="h-4 w-4" {...p} />,
      }}
      {...props}
    />
  );
}
