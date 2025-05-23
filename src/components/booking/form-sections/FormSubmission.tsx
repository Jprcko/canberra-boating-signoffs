
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
  const { isValid, errors } = formState;

  // Log form errors to help with debugging
  if (Object.keys(errors).length > 0) {
    console.log("Form validation errors:", errors);
  }

  return (
    <CardFooter className="flex flex-col gap-2">
      <Button 
        type="submit" 
        className="w-full bg-water-blue hover:bg-deep-blue" 
        disabled={selectedServices.length === 0 || isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Complete Booking"}
      </Button>
      
      {selectedServices.length === 0 && (
        <p className="text-sm text-red-500">Please select at least one service</p>
      )}
      
      {/* Show any validation errors if they exist */}
      {Object.keys(errors).length > 0 && (
        <p className="text-sm text-red-500">Please fix the form errors before submitting</p>
      )}
    </CardFooter>
  );
};
