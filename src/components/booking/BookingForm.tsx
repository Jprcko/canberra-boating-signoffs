
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ParticipantInfo } from "@/types/booking";
import { useAgeValidation } from "@/hooks/useAgeValidation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BookingFormProps } from "@/types/booking";
import { useBookingPrice } from "@/hooks/useBookingPrice";
import { submitBooking, BookingData } from "@/services/bookingService";
import { useForm, FormProvider } from "react-hook-form";
import StripePayment from "./StripePayment";

// Import refactored sections
import { DateTimeSection } from "./form-sections/DateTimeSection";
import { AdditionalInfoSection } from "./form-sections/AdditionalInfoSection";
import { PricingSection } from "./form-sections/PricingSection";
import { ParticipantListSection } from "./form-sections/ParticipantListSection";

interface BookingFormValues {
  date: Date | undefined;
  preferredTime: string;
  additionalInfo: string;
  promoCode: string;
}

const BookingForm = ({ selectedServices }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [participants, setParticipants] = useState<string>("2");
  const [participantsInfo, setParticipantsInfo] = useState<ParticipantInfo[]>([
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
  ]);

  const methods = useForm<BookingFormValues>({
    defaultValues: {
      date: undefined,
      preferredTime: "",
      additionalInfo: "",
      promoCode: ""
    },
    mode: "onBlur"
  });

  const { handleSubmit, watch, setValue, formState } = methods;
  const date = watch("date");
  const preferredTime = watch("preferredTime");
  
  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      console.log("Current form errors:", formState.errors);
    }
  }, [formState.errors]);

  const { toast } = useToast();
  const { validateAge } = useAgeValidation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { price, discount } = useBookingPrice(selectedServices, participants);

  const handleParticipantChange = (
    index: number,
    field: keyof ParticipantInfo,
    value: string | Date | boolean
  ) => {
    const newParticipantsInfo = [...participantsInfo];
    newParticipantsInfo[index] = {
      ...newParticipantsInfo[index],
      [field]: value,
    };
    setParticipantsInfo(newParticipantsInfo);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setValue("date", newDate);
  };

  const handlePreferredTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("preferredTime", e.target.value);
  };

  const shouldShowPayment = selectedServices.includes("full");

  const onSubmit = async (formData: BookingFormValues) => {
    setIsSubmitting(true);

    try {
      console.log("Form is being submitted with data:", formData);
      console.log("Selected services:", selectedServices);
      console.log("Participants info:", participantsInfo);
      
      const formattedDate = formData.date ? formData.date.toISOString() : null;
      
      if (!formattedDate) {
        throw new Error("Please select a valid booking date");
      }

      const newBookingData: BookingData = {
        bookingDate: formattedDate,
        totalPrice: price,
        discountAmount: discount,
        userId: user?.id || null,
        preferredTime: formData.preferredTime,
        selectedServices,
        participants,
        participantsInfo,
        additionalInfo: formData.additionalInfo,
        promoCode: formData.promoCode
      };

      if (shouldShowPayment) {
        // Store booking data and show payment form
        setBookingData(newBookingData);
        setShowPayment(true);
        setIsSubmitting(false);
      } else {
        // Submit booking directly for non-payment services
        await submitBooking(newBookingData);
        
        toast({
          title: "Booking Submitted Successfully",
          description: "We've received your booking request.",
        });

        navigate("/");
      }

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Error Submitting Booking",
        description: error.message || "There was an error submitting your booking",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!bookingData) return;

    try {
      await submitBooking(bookingData);
      
      toast({
        title: "Booking Confirmed & Paid",
        description: "Your booking has been successfully confirmed and payment processed!",
      });

      navigate("/");
    } catch (error: any) {
      console.error('Final booking submission error:', error);
      toast({
        title: "Payment Successful but Booking Error",
        description: "Your payment was processed but there was an issue with the booking. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
  };

  useEffect(() => {
    const newParticipantsInfo = Array(Number(participants))
      .fill(null)
      .map((_, index) => 
        participantsInfo[index] || { firstName: "", middleName: "", lastName: "", email: "", phone: "" }
      );
    setParticipantsInfo(newParticipantsInfo);
  }, [participants]);

  if (showPayment && bookingData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Payment</CardTitle>
            <CardDescription>Secure payment for your full logbook session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg">Booking Summary</h3>
              <p>Service: Full Logbook Package</p>
              <p>Participants: {participants}</p>
              <p>Date: {bookingData.bookingDate ? new Date(bookingData.bookingDate).toLocaleDateString() : 'Not selected'}</p>
              <p>Time: {bookingData.preferredTime}</p>
              <p className="font-bold mt-2">Total: ${price}</p>
            </div>
          </CardContent>
        </Card>

        <StripePayment
          amount={price}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          isProcessing={isProcessingPayment}
          setIsProcessing={setIsProcessingPayment}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
        <CardDescription>Fill in your details and choose your preferred date</CardDescription>
      </CardHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <ParticipantListSection
              selectedServices={selectedServices}
              participants={participants}
              participantsInfo={participantsInfo}
              setParticipants={setParticipants}
              onParticipantChange={handleParticipantChange}
            />

            <DateTimeSection 
              date={date} 
              onDateChange={handleDateChange}
              preferredTime={preferredTime}
              onPreferredTimeChange={handlePreferredTimeChange}
              participants={participants}
            />
            
            <AdditionalInfoSection />

            {(selectedServices.includes("full") || selectedServices.includes("group")) && (
              <PricingSection
                selectedServices={selectedServices}
                participants={participants}
                price={price}
                discount={discount}
              />
            )}

            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full bg-water-blue hover:bg-deep-blue text-white py-3 px-6 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedServices.length === 0 || isSubmitting || Object.keys(formState.errors).length > 0}
              >
                {isSubmitting ? "Processing..." : shouldShowPayment ? "Continue to Payment" : "Submit Booking"}
              </button>
            </div>

            {selectedServices.length === 0 && (
              <p className="text-sm text-red-500 mt-2">Please select at least one service</p>
            )}
            
            {Object.keys(formState.errors).length > 0 && (
              <p className="text-sm text-red-500 mt-2">Please fix the form errors before submitting</p>
            )}
          </CardContent>
        </form>
      </FormProvider>
    </Card>
  );
};

export default BookingForm;
