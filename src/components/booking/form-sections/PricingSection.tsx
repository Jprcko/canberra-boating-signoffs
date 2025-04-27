
import { FC } from "react";

interface PricingSectionProps {
  selectedServices: string[];
  participants: string;
  price: number;
  discount: number;
}

export const PricingSection: FC<PricingSectionProps> = ({ 
  selectedServices, 
  participants, 
  price, 
  discount 
}) => {
  return (
    <div className="mt-4 p-4 bg-sky-50 rounded-lg">
      <div className="flex flex-col space-y-2">
        <p className="text-lg font-semibold text-gray-900">
          {selectedServices.includes("group") ? (
            <>Total Price (for {participants} participants): ${price.toFixed(2)}</>
          ) : (
            <>Price: ${price.toFixed(2)}</>
          )}
        </p>
        {discount > 0 && (
          <p className="text-sm text-green-600">
            Total savings: ${discount.toFixed(2)} ({participants} participants discount)
          </p>
        )}
        {selectedServices.includes("group") && (
          <p className="text-sm text-gray-600">
            Price per person: ${(price / Number(participants)).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};
