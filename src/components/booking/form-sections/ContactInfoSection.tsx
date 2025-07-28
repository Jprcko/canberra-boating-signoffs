
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ParticipantInfo } from "@/types/booking";

interface ContactInfoSectionProps {
  participant: ParticipantInfo;
  index: number;
  onChange: (index: number, field: keyof ParticipantInfo, value: string) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactInfoSection = ({ participant, index, onChange, onPhoneChange }: ContactInfoSectionProps) => {
  return (
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
          onChange={onPhoneChange}
          placeholder="e.g., 0412345678"
          pattern="^(?:\+?61|0)[234578](?:[ -]?[0-9]){8}$"
          required
          className="mt-1"
        />
        <p className="text-sm text-gray-500 mt-1">Please enter a valid Australian phone number</p>
      </div>
    </div>
  );
};
