
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
    <div className="space-y-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900">Participant {index + 1}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor={`firstName-${index}`} className="text-sm font-medium">
              First Name *
            </Label>
            <Input
              id={`firstName-${index}`}
              value={participant.firstName}
              onChange={(e) => onChange(index, "firstName", e.target.value)}
              placeholder="First name"
              required
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Please enter your name as it appears on your official ID (driver's licence or passport)
            </p>
          </div>

          <div>
            <Label htmlFor={`middleName-${index}`} className="text-sm font-medium">
              Middle Name (Optional)
            </Label>
            <Input
              id={`middleName-${index}`}
              value={participant.middleName}
              onChange={(e) => onChange(index, "middleName", e.target.value)}
              placeholder="Middle Name (Optional)"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`lastName-${index}`} className="text-sm font-medium">
              Last Name *
            </Label>
            <Input
              id={`lastName-${index}`}
              value={participant.lastName}
              onChange={(e) => onChange(index, "lastName", e.target.value)}
              placeholder="Last name"
              required
              className="mt-1"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor={`email-${index}`} className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id={`email-${index}`}
              type="email"
              value={participant.email}
              onChange={(e) => onChange(index, "email", e.target.value)}
              placeholder="participant@email.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`phone-${index}`} className="text-sm font-medium">
              Phone Number *
            </Label>
            <Input
              id={`phone-${index}`}
              value={participant.phone}
              onChange={handlePhoneChange}
              placeholder="e.g., 0412345678"
              pattern="^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$"
              required
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">Please enter a valid Australian phone number</p>
          </div>

          <div>
            <Label htmlFor={`dateOfBirth-${index}`} className="text-sm font-medium">
              Date of Birth *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
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
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={participant.dateOfBirth}
                  onSelect={handleDateOfBirthChange}
                  initialFocus
                  disabled={(date) => date > new Date()}
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {participant.dateOfBirth && 
       calculateAge(participant.dateOfBirth) >= 12 && 
       calculateAge(participant.dateOfBirth) < 16 && (
        <div className="mt-6 pt-4 border-t">
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
              className="text-sm font-medium leading-none text-gray-700"
            >
              I confirm that an adult will be present during the session
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

