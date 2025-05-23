
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ParticipantInfo } from "@/types/booking";
import { useAgeValidation } from "@/hooks/useAgeValidation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BookingFormProps } from "@/types/booking";
import { useBookingPrice } from "@/hooks/useBookingPrice";
import { submitBooking } from "@/services/bookingService";

// Import refactored sections
import { DateTimeSection } from "./form-sections/DateTimeSection";
import { AdditionalInfoSection } from "./form-sections/AdditionalInfoSection";
import { PricingSection } from "./form-sections/PricingSection";
import { ParticipantListSection } from "./form-sections/ParticipantListSection";
import { FormSubmission } from "./form-sections/FormSubmission";

const BookingForm = ({ selectedServices }: BookingFormProps) => {
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<string>("2");
  const [preferredTime, setPreferredTime] = useState<string>("");
  const [participantsInfo, setParticipantsInfo] = useState<ParticipantInfo[]>([
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
  ]);

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
    setDate(newDate);
  };

  const handlePreferredTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferredTime(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the date for PostgreSQL
      const formattedDate = date ? date.toISOString() : null;
      
      if (!formattedDate) {
        throw new Error("Please select a valid booking date");
      }

      await submitBooking({
        bookingDate: formattedDate,
        totalPrice: price,
        discountAmount: discount,
        userId: user?.id || null,
        preferredTime,
        selectedServices,
        participants,
        participantsInfo
      });

      toast({
        title: "Booking Submitted Successfully",
        description: "We've received your booking request.",
      });

      // Redirect to a confirmation page or clear the form
      navigate("/");

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Error Submitting Booking",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <form onSubmit={handleSubmit}>
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
          date={date}
          preferredTime={preferredTime}
          isSubmitting={isSubmitting}
        />
      </form>
    </Card>
  );
};

export default BookingForm;
