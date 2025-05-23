
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

export interface AdditionalInfoValues {
  additionalInfo: string;
  promoCode: string;
}

export const AdditionalInfoSection: FC = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <FormControl>
              <Textarea 
                id="message" 
                placeholder="Any special requirements or questions..." 
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="promoCode"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <Label htmlFor="promo">Promo Code (Optional)</Label>
            <FormControl>
              <Input 
                id="promo" 
                placeholder="Enter promo code if you have one" 
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
