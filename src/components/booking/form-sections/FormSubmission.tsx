
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [open, setOpen] = useState(false);

  // Log form errors to help with debugging
  if (Object.keys(errors).length > 0) {
    console.log("Form validation errors:", errors);
  }

  return (
    <CardFooter className="flex flex-col gap-2">
      <Collapsible 
        open={open} 
        onOpenChange={setOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button 
            type="button"
            className="w-full bg-water-blue hover:bg-deep-blue flex items-center justify-center" 
            disabled={selectedServices.length === 0}
          >
            <span className="flex-grow text-center">Proceed to Payment</span>
            {open ? 
              <ChevronUp className="h-4 w-4 ml-2" /> : 
              <ChevronDown className="h-4 w-4 ml-2" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 border rounded-md p-4">
          <div className="space-y-4">
            <div className="text-sm">
              <p className="font-semibold mb-2">Payment Information</p>
              <p>After submission, you will receive an email with payment instructions.</p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700" 
              disabled={selectedServices.length === 0 || isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting ? "Processing..." : "Complete Booking"}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
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
