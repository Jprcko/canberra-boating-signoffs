import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BookingFormProps {
  selectedServices: string[];
}

interface ParticipantInfo {
  name: string;
  email: string;
  phone: string;
}

const BookingForm = ({ selectedServices }: BookingFormProps) => {
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<string>("2");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [participantsInfo, setParticipantsInfo] = useState<ParticipantInfo[]>([
    { name: "", email: "", phone: "" },
    { name: "", email: "", phone: "" },
    ]);

  useEffect(() => {
    if (selectedServices.includes("full")) {
      setPrice(499);
      setDiscount(0);
    } else if (selectedServices.includes("group")) {
      const basePrice = 499;
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
      const totalPrice = pricePerPerson * Number(participants);
      setDiscount(discountAmount * Number(participants));
      setPrice(totalPrice);
    } else {
      setPrice(0);
      setDiscount(0);
    }
  }, [selectedServices, participants]);

  useEffect(() => {
    // Update participant info array when number of participants changes
    const newParticipantsInfo = Array(Number(participants))
      .fill(null)
      .map((_, index) => 
        participantsInfo[index] || { name: "", email: "", phone: "" }
      );
    setParticipantsInfo(newParticipantsInfo);
  }, [participants]);

  const handleParticipantChange = (
    index: number,
    field: keyof ParticipantInfo,
    value: string
  ) => {
    const newParticipantsInfo = [...participantsInfo];
    newParticipantsInfo[index] = {
      ...newParticipantsInfo[index],
      [field]: value,
    };
    setParticipantsInfo(newParticipantsInfo);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Your contact number" required />
              </div>
            </div>
          )}

          {selectedServices.includes("group") && (
            <>
              <div className="space-y-2">
                <Label>Number of Participants</Label>
                <Select value={participants} onValueChange={setParticipants}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select participants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Participants</SelectItem>
                    <SelectItem value="3">3 Participants</SelectItem>
                    <SelectItem value="4">4 Participants</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {participantsInfo.map((participant, index) => (
                <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium">Participant {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Full Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={participant.name}
                        onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                        placeholder="Participant's full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`email-${index}`}>Email Address</Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        value={participant.email}
                        onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                        placeholder="participant@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                      <Input
                        id={`phone-${index}`}
                        value={participant.phone}
                        onChange={(e) => handleParticipantChange(index, "phone", e.target.value)}
                        placeholder="Contact number"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => 
                    date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                    date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred-time">Preferred Time</Label>
            <select 
              id="preferred-time"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-water-blue focus:border-transparent"
            >
              <option value="">Select a time</option>
              <option value="morning">Morning (9am - 12pm)</option>
              <option value="afternoon">Afternoon (1pm - 4pm)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea 
              id="message" 
              placeholder="Any special requirements or questions..." 
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="promo">Promo Code (Optional)</Label>
            <Input id="promo" placeholder="Enter promo code if you have one" />
          </div>

          {(selectedServices.includes("full") || selectedServices.includes("group")) && (
            <div className="mt-4 p-4 bg-sky-50 rounded-lg">
              <div className="flex flex-col space-y-2">
                <p className="text-lg font-semibold text-gray-900">
                  {selectedServices.includes("group") ? (
                    <>Total Price (for {participants} participants): ${price.toFixed(2)}</>
                  ) : (
                    <>Price: ${price.toFixed(2)}</>
                  )}
                </p>
                {discount > 0 && (
                  <p className="text-sm text-green-600">
                    Total savings: ${discount.toFixed(2)} ({participants} participants discount)
                  </p>
                )}
                {selectedServices.includes("group") && (
                  <p className="text-sm text-gray-600">
                    Price per person: ${(price / Number(participants)).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
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
