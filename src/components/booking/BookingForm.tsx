
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ParticipantForm } from "./ParticipantForm";
import { BookingFormProps, ParticipantInfo } from "@/types/booking";
import { useAgeValidation } from "@/hooks/useAgeValidation";
import { PricingSection } from "./form-sections/PricingSection";
import { DateTimeSection } from "./form-sections/DateTimeSection";
import { AdditionalInfoSection } from "./form-sections/AdditionalInfoSection";
import { ParticipantCountSection } from "./form-sections/ParticipantCountSection";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const BookingForm = ({ selectedServices }: BookingFormProps) => {
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<string>("2");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
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

  useEffect(() => {
    let totalPrice = 0;
    let totalDiscount = 0;
    const basePrice = 499;
    const testPrice = 149; // Updated from 150 to 149
    
    if (selectedServices.includes("full")) {
      totalPrice = basePrice;
    } 
    
    if (selectedServices.includes("group")) {
      let discountPercent = 0;
      
      switch (participants) {
        case "2":
          discountPercent = 10;
          break;
        case "3":
          discountPercent = 12;
          break;
        case "4":
          discountPercent = 15;
          break;
        default:
          discountPercent = 0;
      }
      
      const discountAmount = (basePrice * discountPercent) / 100;
      const pricePerPerson = basePrice - discountAmount;
      totalPrice = pricePerPerson * Number(participants);
      totalDiscount = discountAmount * Number(participants);
    }

    if (selectedServices.includes("test")) {
      const participantCount = selectedServices.includes("group") ? Number(participants) : 1;
      let testTotalPrice = testPrice * participantCount;
      
      if (selectedServices.includes("group")) {
        // Apply the same discount structure to test price
        let discountPercent = 0;
        switch (participants) {
          case "2":
            discountPercent = 10;
            break;
          case "3":
            discountPercent = 12;
            break;
          case "4":
            discountPercent = 15;
            break;
        }
        const testDiscountAmount = (testTotalPrice * discountPercent) / 100;
        testTotalPrice -= testDiscountAmount;
        totalDiscount += testDiscountAmount;
      }
      
      totalPrice += testTotalPrice;
    }

    setPrice(totalPrice);
    setDiscount(totalDiscount);
  }, [selectedServices, participants]);

  useEffect(() => {
    const newParticipantsInfo = Array(Number(participants))
      .fill(null)
      .map((_, index) => 
        participantsInfo[index] || { firstName: "", middleName: "", lastName: "", email: "", phone: "" }
      );
    setParticipantsInfo(newParticipantsInfo);
  }, [participants]);

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
      // Check for valid booking date
      if (!date) {
        toast({
          title: "Error Submitting Booking",
          description: "Please select a valid booking date",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Format the date for PostgreSQL
      const formattedDate = date.toISOString();
      
      // Validate all required participant information
      const activeParticipants = participantsInfo.slice(0, Number(participants));
      const missingInfo = activeParticipants.some(participant => {
        // Check for missing name or contact information
        if (!participant.firstName || !participant.lastName || !participant.email || !participant.phone) {
          return true;
        }
        
        // Check for guardian consent for participants aged 12-15
        if (participant.dateOfBirth) {
          const age = calculateAge(participant.dateOfBirth);
          if (age >= 12 && age < 16 && !participant.hasGuardianConsent) {
            return true;
          }
        }
        
        return false;
      });
      
      if (missingInfo) {
        toast({
          title: "Missing Information",
          description: "Please complete all required fields for each participant",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare booking data
      const bookingData = {
        booking_date: formattedDate,
        total_price: price,
        discount_amount: discount,
        user_id: user?.id || null,
        metadata: {
          preferred_time: preferredTime
        },
      };

      // Insert main booking record
      const { data: newBooking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Insert selected services
      const bookingServices = selectedServices.map(serviceId => ({
        booking_id: newBooking.id,
        service_id: serviceId,
        price_per_person: serviceId === 'test' ? 149 : 499,
        participants: Number(participants)
      }));

      const { error: servicesError } = await supabase
        .from('booking_services')
        .insert(bookingServices);

      if (servicesError) throw servicesError;

      // Transform participant information to match database schema
      const participantsToInsert = activeParticipants.map(participant => ({
        booking_id: newBooking.id,
        first_name: participant.firstName,
        middle_name: participant.middleName || null,
        last_name: participant.lastName,
        email: participant.email,
        phone: participant.phone
      }));

      const { error: participantsError } = await supabase
        .from('booking_participants')
        .insert(participantsToInsert);

      if (participantsError) throw participantsError;

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

  // Helper function to calculate age
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
        <CardDescription>Fill in your details and choose your preferred date</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!selectedServices.includes("group") && (
            <ParticipantForm
              participant={participantsInfo[0]}
              index={0}
              onChange={handleParticipantChange}
            />
          )}

          {selectedServices.includes("group") && (
            <>
              <ParticipantCountSection 
                participants={participants}
                onParticipantsChange={setParticipants}
              />

              {participantsInfo.slice(0, Number(participants)).map((participant, index) => (
                <ParticipantForm
                  key={index}
                  participant={participant}
                  index={index}
                  onChange={handleParticipantChange}
                />
              ))}
            </>
          )}

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
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-water-blue hover:bg-deep-blue" 
            disabled={selectedServices.length === 0 || !date || !preferredTime || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Complete Booking"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;
