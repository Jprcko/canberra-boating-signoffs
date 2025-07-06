
import { FC } from "react";

export const CalendarLegend: FC = () => {
  return (
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
  );
};
