
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ParticipantInfo } from "@/types/booking";

interface PersonalInfoSectionProps {
  participant: ParticipantInfo;
  index: number;
  onChange: (index: number, field: keyof ParticipantInfo, value: string) => void;
}

export const PersonalInfoSection = ({ participant, index, onChange }: PersonalInfoSectionProps) => {
  return (
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
  );
};
