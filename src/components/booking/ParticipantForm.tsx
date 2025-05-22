
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAgeValidation } from "@/hooks/useAgeValidation";
import { ParticipantInfo } from "@/types/booking";
import { AgeVerificationDialog } from "./AgeVerificationDialog";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { ContactInfoSection } from "./form-sections/ContactInfoSection";
import { DateOfBirthSection } from "./form-sections/DateOfBirthSection";

interface ParticipantFormProps {
  participant: ParticipantInfo;
  index: number;
  onChange: (index: number, field: keyof ParticipantInfo, value: string | Date | boolean) => void;
}

export const ParticipantForm = ({ participant, index, onChange }: ParticipantFormProps) => {
  const { validateAge, calculateAge } = useAgeValidation();
  const [showAgeDialog, setShowAgeDialog] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const validateAustralianPhone = (phone: string) => {
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

  const handleDateOfBirthChange = (date: Date | undefined) => {
    if (date) {
      const age = calculateAge(date);
      
      // For participants between 12 and 16, show the dialog
      if (age >= 12 && age < 16) {
        setTempDate(date);
        setShowAgeDialog(true);
      } else {
        // For other ages, update directly
        onChange(index, "dateOfBirth", date);
        
        // Reset supervisor name if the participant is now 16 or older
        if (participant.supervisorName && age >= 16) {
          onChange(index, "supervisorName", "");
          onChange(index, "hasGuardianConsent", false);
        }
      }
    } else {
      // Handle case when date is undefined (e.g., user cleared the selection)
      onChange(index, "dateOfBirth", undefined);
    }
  };

  const handleAgeDialogAccept = (supervisorName: string) => {
    if (tempDate && supervisorName) {
      onChange(index, "dateOfBirth", tempDate);
      onChange(index, "supervisorName", supervisorName);
      onChange(index, "hasGuardianConsent", true);
      setShowAgeDialog(false);
      setTempDate(null);
    }
  };

  const handleAgeDialogClose = () => {
    // If dialog is closed without accepting, still set the date but mark as needing consent
    if (tempDate) {
      onChange(index, "dateOfBirth", tempDate);
      // Don't set hasGuardianConsent here, let the user check it separately
    }
    
    setShowAgeDialog(false);
    setTempDate(null);
  };

  return (
    <div className="space-y-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900">Participant {index + 1}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonalInfoSection
          participant={participant}
          index={index}
          onChange={onChange}
        />
        
        <div className="space-y-4">
          <ContactInfoSection
            participant={participant}
            index={index}
            onChange={onChange}
            onPhoneChange={handlePhoneChange}
          />
          
          <DateOfBirthSection
            participant={participant}
            index={index}
            onDateChange={handleDateOfBirthChange}
          />
        </div>
      </div>

      <AgeVerificationDialog
        isOpen={showAgeDialog}
        onClose={handleAgeDialogClose}
        onAccept={handleAgeDialogAccept}
      />

      {participant.supervisorName && (
        <div className="mt-4 p-4 bg-sky-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Supervising Adult:</strong> {participant.supervisorName}
          </p>
        </div>
      )}
      
      {participant.dateOfBirth && 
       calculateAge(participant.dateOfBirth) >= 12 && 
       calculateAge(participant.dateOfBirth) < 16 && (
        <div className="mt-6 pt-4 border-t">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  id={`guardian-consent-${index}`}
                  checked={participant.hasGuardianConsent === true}
                  onCheckedChange={(checked) => 
                    onChange(index, "hasGuardianConsent", checked === true)
                  }
                />
                <label
                  htmlFor={`guardian-consent-${index}`}
                  className="text-sm font-medium leading-none text-gray-700"
                >
                  I confirm that an adult will be present during the session
                </label>
              </div>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-4 bg-white" 
              align="start" 
              side="top" 
              sideOffset={5}
            >
              <p className="text-sm text-gray-600">
                For safety reasons, participants between 12 and 16 years old must be accompanied by an adult during the session.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};
