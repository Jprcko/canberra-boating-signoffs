
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface FormSubmissionProps {
  selectedServices: string[];
  date: Date | undefined;
  preferredTime: string;
  isSubmitting: boolean;
}

export const FormSubmission: FC<FormSubmissionProps> = ({
  selectedServices,
  date,
  preferredTime,
  isSubmitting
}) => {
  return (
    <CardFooter>
      <Button 
        type="submit" 
        className="w-full bg-water-blue hover:bg-deep-blue" 
        disabled={selectedServices.length === 0 || !date || !preferredTime || isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Complete Booking"}
      </Button>
    </CardFooter>
  );
};
