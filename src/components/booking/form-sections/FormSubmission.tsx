
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { ChevronDown, ChevronUp, CreditCard, ArrowRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [paymentMethod, setPaymentMethod] = useState("card");
  const isMobile = useIsMobile();

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
              <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                <TabsList className={`grid w-full mb-4 ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-6'}`}>
                  <TabsTrigger value="card" className="text-xs sm:text-sm">Card</TabsTrigger>
                  <TabsTrigger value="afterpay" className="text-xs sm:text-sm">AfterPay</TabsTrigger>
                  <TabsTrigger value="paypal" className="text-xs sm:text-sm">PayPal</TabsTrigger>
                  <TabsTrigger value="applepay" className="text-xs sm:text-sm">Apple Pay</TabsTrigger>
                  <TabsTrigger value="googlepay" className="text-xs sm:text-sm">Google Pay</TabsTrigger>
                  <TabsTrigger value="zip" className="text-xs sm:text-sm">Zip Pay</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="afterpay" className="text-center py-4">
                  <p className="text-sm sm:text-base">Pay in 4 interest-free instalments</p>
                  <div className="flex justify-center my-4">
                    <img 
                      src="https://play-lh.googleusercontent.com/2REJKKe0mTHpfQU_UjTk_lMBMBhiSQk1kN7xTS5K3RpJp_pHbTDZ3XjnLqN9D8LMcA" 
                      alt="AfterPay Logo" 
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    You'll be redirected to AfterPay to complete your payment
                  </p>
                </TabsContent>
                
                <TabsContent value="paypal" className="text-center py-4">
                  <div className="flex justify-center my-4">
                    <img 
                      src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" 
                      alt="PayPal Logo"
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    You'll be redirected to PayPal to complete your payment
                  </p>
                </TabsContent>
                
                <TabsContent value="applepay" className="text-center py-4">
                  <div className="flex justify-center my-4">
                    <img 
                      src="https://developer.apple.com/assets/elements/icons/apple-pay/apple-pay.svg" 
                      alt="Apple Pay Logo"
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Complete your payment with Apple Pay
                  </p>
                </TabsContent>
                
                <TabsContent value="googlepay" className="text-center py-4">
                  <div className="flex justify-center my-4">
                    <img 
                      src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png" 
                      alt="Google Pay Logo"
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Complete your payment with Google Pay
                  </p>
                </TabsContent>
                
                <TabsContent value="zip" className="text-center py-4">
                  <p className="text-sm sm:text-base">Shop now, pay later in 4 interest-free instalments</p>
                  <div className="flex justify-center my-4">
                    <img 
                      src="https://cdn.zip.co/web/au/logo.svg" 
                      alt="Zip Pay Logo"
                      className="h-8 sm:h-10 object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    You'll be redirected to Zip to complete your payment
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center" 
              disabled={selectedServices.length === 0 || isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting ? "Processing..." : (
                <>
                  <span className="mr-2">Complete Booking & Pay</span>
                  {paymentMethod === "card" && <CreditCard className="h-4 w-4" />}
                  {paymentMethod !== "card" && <ArrowRight className="h-4 w-4" />}
                </>
              )}
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
