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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface BookingFormProps {
  selectedServices: string[];
}

interface ParticipantInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  hasGuardianConsent?: boolean;
}

const BookingForm = ({ selectedServices }: BookingFormProps) => {
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<string>("2");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [participantsInfo, setParticipantsInfo] = useState<ParticipantInfo[]>([
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
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

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateOfBirthChange = (index: number, date: Date | undefined) => {
    if (date) {
      const age = calculateAge(date);
      if (age < 12) {
        toast({
          title: "Age Restriction",
          description: "Participants must be at least 12 years old to proceed.",
          variant: "destructive",
        });
        return;
      }
      
      handleParticipantChange(index, "dateOfBirth", date);
      
      if (age >= 12 && age < 16) {
        toast({
          title: "Guardian Required",
          description: "Participants under 16 must be accompanied by an adult.",
        });
      }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" placeholder="Your first name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" placeholder="Your middle name" />
                <p className="text-sm text-gray-500">Please enter your middle name if it appears on your official ID (driver's licence or passport)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" placeholder="Your last name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
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
                      {date ? format(date, "PPP") : <span>Select date of birth</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate) {
                          handleDateOfBirthChange(0, newDate);
                          setDate(newDate);
                        }
                      }}
                      initialFocus
                      disabled={(date) => 
                        date > new Date()
                      }
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
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
                      <Label htmlFor={`firstName-${index}`}>First Name *</Label>
                      <Input
                        id={`firstName-${index}`}
                        value={participant.firstName}
                        onChange={(e) => handleParticipantChange(index, "firstName", e.target.value)}
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`middleName-${index}`}>Middle Name</Label>
                      <Input
                        id={`middleName-${index}`}
                        value={participant.middleName}
                        onChange={(e) => handleParticipantChange(index, "middleName", e.target.value)}
                        placeholder="Middle name"
                      />
                      <p className="text-sm text-gray-500">Please enter middle name if it appears on official ID</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lastName-${index}`}>Last Name *</Label>
                      <Input
                        id={`lastName-${index}`}
                        value={participant.lastName}
                        onChange={(e) => handleParticipantChange(index, "lastName", e.target.value)}
                        placeholder="Last name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`dateOfBirth-${index}`}>Date of Birth *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !participant.dateOfBirth && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {participant.dateOfBirth ? 
                              format(participant.dateOfBirth, "PPP") : 
                              <span>Select date of birth</span>
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={participant.dateOfBirth}
                            onSelect={(newDate) => handleDateOfBirthChange(index, newDate)}
                            initialFocus
                            disabled={(date) => date > new Date()}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
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
                    
                    {participant.dateOfBirth && 
                     calculateAge(participant.dateOfBirth) >= 12 && 
                     calculateAge(participant.dateOfBirth) < 16 && (
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`guardian-consent-${index}`}
                            checked={participant.hasGuardianConsent}
                            onCheckedChange={(checked) => 
                              handleParticipantChange(index, "hasGuardianConsent", checked)
                            }
                            required
                          />
                          <label
                            htmlFor={`guardian-consent-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I confirm that an adult will be present during the session
                          </label>
                        </div>
                      </div>
                    )}
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
