
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAgeValidation } from "@/hooks/useAgeValidation";
import { ParticipantInfo } from "@/types/booking";

interface ParticipantFormProps {
  participant: ParticipantInfo;
  index: number;
  onChange: (index: number, field: keyof ParticipantInfo, value: string | Date | boolean) => void;
}

export const ParticipantForm = ({ participant, index, onChange }: ParticipantFormProps) => {
  const { validateAge, calculateAge } = useAgeValidation();

  const handleDateOfBirthChange = (date: Date | undefined) => {
    if (date && validateAge(date)) {
      onChange(index, "dateOfBirth", date);
    }
  };

  const validateAustralianPhone = (phone: string) => {
    // Regex for Australian phone numbers (mobile and landline)
    const australianPhoneRegex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
    return australianPhoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    onChange(index, "phone", phone);
    
    if (phone && !validateAustralianPhone(phone)) {
      e.target.setCustomValidity("Please enter a valid Australian phone number");
    } else {
      e.target.setCustomValidity("");
    }
  };

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
      <h3 className="font-medium">Participant {index + 1}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`firstName-${index}`}>First Name *</Label>
          <Input
            id={`firstName-${index}`}
            value={participant.firstName}
            onChange={(e) => onChange(index, "firstName", e.target.value)}
            placeholder="First name"
            required
          />
          <p className="text-sm text-gray-500">
            Please enter your name as it appears on your official ID (driver's licence or passport)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`middleName-${index}`}>Middle Name (Optional)</Label>
          <Input
            id={`middleName-${index}`}
            value={participant.middleName}
            onChange={(e) => onChange(index, "middleName", e.target.value)}
            placeholder="Middle Name (Optional)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`lastName-${index}`}>Last Name *</Label>
          <Input
            id={`lastName-${index}`}
            value={participant.lastName}
            onChange={(e) => onChange(index, "lastName", e.target.value)}
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
                onSelect={handleDateOfBirthChange}
                initialFocus
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`email-${index}`}>Email Address *</Label>
          <Input
            id={`email-${index}`}
            type="email"
            value={participant.email}
            onChange={(e) => onChange(index, "email", e.target.value)}
            placeholder="participant@email.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
          <Input
            id={`phone-${index}`}
            value={participant.phone}
            onChange={handlePhoneChange}
            placeholder="e.g., 0412345678"
            pattern="^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$"
            required
          />
          <p className="text-sm text-gray-500">Please enter a valid Australian phone number</p>
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
                  onChange(index, "hasGuardianConsent", checked)
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
  );
};

