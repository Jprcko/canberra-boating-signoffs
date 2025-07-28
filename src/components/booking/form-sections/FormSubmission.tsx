import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { StripePaymentForm } from "../StripePaymentForm";
import { useBookingPriceTest } from "@/hooks/useBookingPriceTest";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormSubmissionProps {
  selectedServices: string[];
  isSubmitting: boolean;
  onPaymentSuccess: (paymentId: string) => void;
}

export const FormSubmission: FC<FormSubmissionProps> = ({
  selectedServices,
  isSubmitting,
  onPaymentSuccess
}) => {
  const { formState, handleSubmit, setValue } = useFormContext();
  const { isValid, errors } = formState;
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Use the test pricing hook for the test booking page
  const { price } = useBookingPriceTest(selectedServices, "2"); // Default to 2 participants for now

  // Log form errors to help with debugging
  if (Object.keys(errors).length > 0) {
    console.log("Form validation errors:", errors);
  }

  const handlePaymentSuccess = (paymentId: string) => {
    console.log("Payment successful in FormSubmission:", paymentId);
    setPaymentIntentId(paymentId);
    // Call the parent's payment success handler which will trigger form submission
    onPaymentSuccess(paymentId);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment failed:", error);
    // Handle payment error
  };

  return (
    <CardFooter className="flex flex-col gap-4">
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
          <div className="space-y-6">
            <div className="text-sm">
              <p className="font-semibold mb-4">Payment Information</p>
              <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                <TabsList className={`grid w-full mb-6 ${isMobile ? 'grid-cols-3 gap-2' : 'grid-cols-6'}`}>
                  <TabsTrigger value="card" className="bg-muted hover:bg-water-blue/10 data-[state=active]:bg-water-blue data-[state=active]:text-white">Card</TabsTrigger>
                  <TabsTrigger value="afterpay" className="bg-muted hover:bg-water-blue/10 data-[state=active]:bg-water-blue data-[state=active]:text-white">AfterPay</TabsTrigger>
                  <TabsTrigger value="paypal" className="bg-muted hover:bg-water-blue/10 data-[state=active]:bg-water-blue data-[state=active]:text-white">PayPal</TabsTrigger>
                  <TabsTrigger value="applepay" className="bg-muted hover:bg-water-blue/10 data-[state=active]:bg-water-blue data-[state=active]:text-white">Apple Pay</TabsTrigger>
                  <TabsTrigger value="googlepay" className="bg-muted hover:bg-water-blue/10 data-[state=active]:bg-water-blue data-[state=active]:text-white">Google Pay</TabsTrigger>
                  <TabsTrigger value="zip" className="bg-muted hover:bg-water-blue/10 data-[state=active]:bg-water-blue data-[state=active]:text-white">Zip Pay</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-6">
                  <StripePaymentForm
                    amount={price}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    isSubmitting={isSubmitting}
                    disabled={selectedServices.length === 0 || Object.keys(errors).length > 0}
                  />
                </TabsContent>
                
                <TabsContent value="afterpay" className="text-center py-6">
                  <p className="text-sm sm:text-base mb-4">Pay in 4 interest-free instalments</p>
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://play-lh.googleusercontent.com/2REJKKe0mTHpfQU_UjTk_lMBMBhiSQk1kN7xTS5K3RpJp_pHbTDZ3XjnLqN9D8LMcA" 
                      alt="AfterPay Logo" 
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    You'll be redirected to AfterPay to complete your payment
                  </p>
                </TabsContent>
                
                <TabsContent value="paypal" className="text-center py-6">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" 
                      alt="PayPal Logo"
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    You'll be redirected to PayPal to complete your payment
                  </p>
                </TabsContent>
                
                <TabsContent value="applepay" className="text-center py-6">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://developer.apple.com/assets/elements/icons/apple-pay/apple-pay.svg" 
                      alt="Apple Pay Logo"
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Complete your payment with Apple Pay
                  </p>
                </TabsContent>
                
                <TabsContent value="googlepay" className="text-center py-6">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png" 
                      alt="Google Pay Logo"
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Complete your payment with Google Pay
                  </p>
                </TabsContent>
                
                <TabsContent value="zip" className="text-center py-6">
                  <p className="text-sm sm:text-base mb-4">Shop now, pay later in 4 interest-free instalments</p>
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://cdn.zip.co/web/au/logo.svg" 
                      alt="Zip Pay Logo"
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    You'll be redirected to Zip to complete your payment
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {selectedServices.length === 0 && (
        <p className="text-sm text-red-500 mt-2">Please select at least one service</p>
      )}
      
      {/* Show any validation errors if they exist */}
      {Object.keys(errors).length > 0 && (
        <p className="text-sm text-red-500 mt-2">Please fix the form errors before submitting</p>
      )}
      
      {/* Show payment success message */}
      {paymentIntentId && (
        <p className="text-sm text-green-600 mt-2">Payment completed successfully! Payment ID: {paymentIntentId}</p>
      )}
    </CardFooter>
  );
};
