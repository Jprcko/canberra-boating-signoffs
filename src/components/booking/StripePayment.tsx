
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const stripePromise = loadStripe("pk_live_51RXOBiHS18h81dHmswoTnnoqK91yqxR834DBBywrP06yr45qWMQSBrb3JW2LVpK7VrlobG4ao9z6YrIiyZFFFyWR00B9rvJtpB");

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError, isProcessing, setIsProcessing }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { amount }
        });
        
        if (error) throw error;
        setClientSecret(data.client_secret);
      } catch (error: any) {
        onPaymentError(error.message);
      }
    };

    createPaymentIntent();
  }, [amount, onPaymentError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError("Card element not found");
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      onPaymentError(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      onPaymentSuccess();
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed and paid!",
      });
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
    },
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-md">
            <CardElement options={cardElementOptions} />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total: ${amount}</span>
            <Button 
              type="submit" 
              disabled={!stripe || isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Processing..." : `Pay $${amount}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface StripePaymentProps {
  amount: number;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const StripePayment = ({ amount, onPaymentSuccess, onPaymentError, isProcessing, setIsProcessing }: StripePaymentProps) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        amount={amount}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </Elements>
  );
};

export default StripePayment;
