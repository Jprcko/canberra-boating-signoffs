
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from "lucide-react";

// Updated to use the live publishable key that matches your live secret key
const stripePromise = loadStripe("pk_live_51RXOBiHS18h81dHmswoTnnoqK91yqxR834DBBywrP06yr45qWMQSBrb3JW2LVpK7VrlobG4ao9z6YrIiyZFFFyWR00B9rvJtpB");

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError, isSubmitting, disabled }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      onPaymentError("Stripe has not loaded yet");
      return;
    }

    setProcessing(true);

    try {
      console.log("Starting payment process for amount:", amount);

      // Create payment intent on the server
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            amount,
            currency: "aud",
            metadata: {
              booking_type: "boating_session"
            }
          }
        }
      );

      if (paymentError) {
        console.error("Payment intent creation error:", paymentError);
        throw new Error(paymentError.message);
      }

      console.log("Payment intent created successfully:", paymentData);

      // Confirm payment with the card element
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      console.log("Confirming payment with client secret:", paymentData.client_secret);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.client_secret,
        {
          payment_method: {
            card: cardElement,
          }
        }
      );

      if (stripeError) {
        console.error("Stripe confirmation error:", stripeError);
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent.id);
        onPaymentSuccess(paymentIntent.id);
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      onPaymentError(error.message);
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="w-full p-3 border rounded-md bg-white">
          <CardNumberElement options={elementOptions} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <div className="w-full p-3 border rounded-md bg-white">
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <div className="w-full p-3 border rounded-md bg-white">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      <Button 
        type="button"
        onClick={handlePayment}
        className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center mt-6" 
        disabled={disabled || processing || isSubmitting || !stripe}
      >
        {processing ? "Processing Payment..." : (
          <>
            <span className="mr-2">Complete Booking & Pay</span>
            <CreditCard className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

interface StripePaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export const StripePaymentForm = (props: StripePaymentFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};
