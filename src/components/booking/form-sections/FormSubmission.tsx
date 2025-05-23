
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";

interface FormSubmissionProps {
  selectedServices: string[];
  isSubmitting: boolean;
}

export const FormSubmission: FC<FormSubmissionProps> = ({
  selectedServices,
  isSubmitting
}) => {
  const { formState } = useFormContext();
  const { isValid } = formState;

  return (
    <CardFooter>
      <Button 
        type="submit" 
        className="w-full bg-water-blue hover:bg-deep-blue" 
        disabled={selectedServices.length === 0 || !isValid || isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Complete Booking"}
      </Button>
    </CardFooter>
  );
};
