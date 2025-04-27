
import { LucideIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Coffee, Utensils, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ServiceCard = ({
  id,
  name,
  price,
  description,
  features,
  icon: Icon,
  isSelected,
  onSelect,
}: ServiceCardProps) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-col h-full p-4 border rounded-lg cursor-pointer transition-all",
          isSelected 
            ? "border-water-blue bg-sky-light" 
            : "hover:bg-slate-light hover:border-gray-300"
        )}
        onClick={() => onSelect(id)}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5 text-water-blue" />
          <span className="font-semibold text-lg">{name}</span>
        </div>
        <span className="text-water-blue font-bold text-xl mb-2">{price}</span>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <ul className="space-y-2 text-sm">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              {feature.includes("lunch") ? <Utensils className="h-4 w-4 text-water-blue shrink-0 mt-0.5" /> :
               feature.includes("drink") ? <Coffee className="h-4 w-4 text-water-blue shrink-0 mt-0.5" /> :
               feature.includes("9am to 4pm") ? <Clock className="h-4 w-4 text-water-blue shrink-0 mt-0.5" /> :
               <div className="h-4 w-4 rounded-full border-2 border-water-blue shrink-0 mt-0.5" />}
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="absolute top-4 right-4">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onSelect(id)}
            className="data-[state=checked]:bg-water-blue"
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
