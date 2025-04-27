
import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const AdditionalInfoSection: FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Additional Information</Label>
        <Textarea 
          id="message" 
          placeholder="Any special requirements or questions..." 
          className="min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="promo">Promo Code (Optional)</Label>
        <Input id="promo" placeholder="Enter promo code if you have one" />
      </div>
    </div>
  );
};
