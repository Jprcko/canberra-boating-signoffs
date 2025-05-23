
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
      // Always update the actual date field first
      onChange(index, "dateOfBirth", date);
      
      const age = calculateAge(date);
      
      if (age >= 12 && age < 16) {
        // Store the date for supervisor dialog
        setTempDate(date);
        setShowAgeDialog(true);
      } else {
        // For other ages, validate but don't show dialog
        validateAge(date);
      }
    }
  };

  const handleAgeDialogAccept = (supervisorName: string) => {
    if (supervisorName) {
      // The date is already set in handleDateOfBirthChange
      // Just update the supervisor name
      onChange(index, "supervisorName", supervisorName);
      setShowAgeDialog(false);
      setTempDate(null);
    }
  };

  const handleAgeDialogClose = () => {
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
          <p className="text-sm text-gray-600">
            Supervising Adult: {participant.supervisorName}
          </p>
        </div>
      )}
    </div>
  );
};
