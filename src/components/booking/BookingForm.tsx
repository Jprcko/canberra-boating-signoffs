
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

// Import refactored sections
import { DateTimeSection } from "./form-sections/DateTimeSection";
import { AdditionalInfoSection } from "./form-sections/AdditionalInfoSection";
import { PricingSection } from "./form-sections/PricingSection";
import { ParticipantListSection } from "./form-sections/ParticipantListSection";
import { FormSubmission } from "./form-sections/FormSubmission";

interface BookingFormValues {
  date: Date | undefined;
  additionalInfo: string;
  promoCode: string;
  paymentIntentId?: string;
}

const BookingForm = ({ selectedServices }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      additionalInfo: "",
      promoCode: "",
      paymentIntentId: undefined
    },
    mode: "onBlur" // Validate fields when they lose focus
  });

  const { handleSubmit, watch, setValue, formState } = methods;
  const date = watch("date");
  const paymentIntentId = watch("paymentIntentId");
  
  // Log form errors when they change
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

  const onSubmit = async (formData: BookingFormValues) => {
    // Only submit if we have a successful payment
    if (!formData.paymentIntentId) {
      toast({
        title: "Payment Required",
        description: "Please complete your payment before submitting the booking.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Form is being submitted with data:", formData);
      console.log("Selected services:", selectedServices);
      console.log("Participants info:", participantsInfo);
      console.log("Payment Intent ID:", formData.paymentIntentId);
      
      // Format the date for PostgreSQL
      const formattedDate = formData.date ? formData.date.toISOString() : null;
      
      if (!formattedDate) {
        throw new Error("Please select a valid booking date");
      }

      const bookingData: BookingData = {
        bookingDate: formattedDate,
        totalPrice: price,
        discountAmount: discount,
        userId: user?.id || null,
        preferredTime: "", // No longer needed, sessions are full day
        selectedServices,
        participants,
        participantsInfo,
        additionalInfo: formData.additionalInfo,
        promoCode: formData.promoCode
      };

      await submitBooking(bookingData);

      toast({
        title: "Booking Submitted Successfully",
        description: "We've received your booking request and payment.",
      });

      // Redirect to a confirmation page or clear the form
      navigate("/");

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Error Submitting Booking",
        description: error.message || "There was an error submitting your booking",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set payment intent ID when payment is successful
  const handlePaymentSuccess = (paymentId: string) => {
    setValue("paymentIntentId", paymentId);
    // Automatically submit the form after successful payment
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    const newParticipantsInfo = Array(Number(participants))
      .fill(null)
      .map((_, index) => 
        participantsInfo[index] || { firstName: "", middleName: "", lastName: "", email: "", phone: "" }
      );
    setParticipantsInfo(newParticipantsInfo);
  }, [participants]);

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
          </CardContent>
          <FormSubmission 
            selectedServices={selectedServices}
            isSubmitting={isSubmitting}
          />
        </form>
      </FormProvider>
    </Card>
  );
};

export default BookingForm;
