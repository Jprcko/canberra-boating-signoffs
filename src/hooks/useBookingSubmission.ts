
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { submitBooking, BookingData } from "@/services/bookingService";
import { ParticipantInfo } from "@/types/booking";

export const useBookingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const submitBookingForm = async (
    formData: any,
    selectedServices: string[],
    participants: string,
    participantsInfo: ParticipantInfo[],
    price: number,
    discount: number
  ) => {
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
      
      const formattedDate = formData.date ? formData.date.toISOString() : null;
      
      if (!formattedDate) {
        console.error("No date provided for booking");
        throw new Error("Please select a valid booking date");
      }

      console.log("Formatted date:", formattedDate);

      const bookingData: BookingData = {
        bookingDate: formattedDate,
        totalPrice: price,
        discountAmount: discount,
        userId: user?.id || null,
        preferredTime: "",
        selectedServices,
        participants,
        participantsInfo,
        additionalInfo: formData.additionalInfo,
        promoCode: formData.promoCode
      };

      console.log("About to call submitBooking with:", bookingData);
      const result = await submitBooking(bookingData);
      console.log("submitBooking returned:", result);

      toast({
        title: "Booking Submitted Successfully",
        description: "We've received your booking request and payment.",
      });

      navigate("/");

    } catch (error: any) {
      console.error('Booking error:', error);
      console.error('Error stack:', error.stack);
      toast({
        title: "Error Submitting Booking",
        description: error.message || "There was an error submitting your booking",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitBookingForm
  };
};
