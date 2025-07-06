
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingFormProps } from "@/types/booking";
import { useBookingPrice } from "@/hooks/useBookingPrice";
import { useForm, FormProvider } from "react-hook-form";
import { useBookingFormState } from "@/hooks/useBookingFormState";
import { useBookingSubmission } from "@/hooks/useBookingSubmission";

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
  const {
    participants,
    setParticipants,
    participantsInfo,
    handleParticipantChange
  } = useBookingFormState();

  const { isSubmitting, submitBookingForm } = useBookingSubmission();

  const methods = useForm<BookingFormValues>({
    defaultValues: {
      date: undefined,
      additionalInfo: "",
      promoCode: "",
      paymentIntentId: undefined
    },
    mode: "onBlur"
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

  const { price, discount } = useBookingPrice(selectedServices, participants);

  const handleDateChange = (newDate: Date | undefined) => {
    setValue("date", newDate);
  };

  const onSubmit = async (formData: BookingFormValues) => {
    await submitBookingForm(
      formData,
      selectedServices,
      participants,
      participantsInfo,
      price,
      discount
    );
  };

  // Set payment intent ID when payment is successful
  const handlePaymentSuccess = (paymentId: string) => {
    setValue("paymentIntentId", paymentId);
    // Automatically submit the form after successful payment
    handleSubmit(onSubmit)();
  };

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
