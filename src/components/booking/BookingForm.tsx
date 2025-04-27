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

const BookingForm = ({ selectedServices }: BookingFormProps) => {
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<string>("2");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [participantsInfo, setParticipantsInfo] = useState<ParticipantInfo[]>([
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
  ]);

  const { toast } = useToast();
  const { validateAge } = useAgeValidation();

  useEffect(() => {
    let totalPrice = 0;
    let totalDiscount = 0;
    const basePrice = 499;
    const testPrice = 150;
    
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
    if (newDate) {
      validateAge(newDate) && setDate(newDate);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Booking Request Submitted",
        description: "We've received your booking request and will confirm shortly.",
      });
      setIsSubmitting(false);
    }, 1500);
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

              {participantsInfo.map((participant, index) => (
                <ParticipantForm
                  key={index}
                  participant={participant}
                  index={index}
                  onChange={handleParticipantChange}
                />
              ))}
            </>
          )}

          <DateTimeSection date={date} onDateChange={handleDateChange} />
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
            disabled={selectedServices.length === 0 || !date || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Complete Booking"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;
