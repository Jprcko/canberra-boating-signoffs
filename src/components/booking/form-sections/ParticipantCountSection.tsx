
import { FC } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ParticipantCountSectionProps {
  participants: string;
  onParticipantsChange: (value: string) => void;
}

export const ParticipantCountSection: FC<ParticipantCountSectionProps> = ({
  participants,
  onParticipantsChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Number of Participants</Label>
      <Select value={participants} onValueChange={onParticipantsChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select participants" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2">2 Participants</SelectItem>
          <SelectItem value="3">3 Participants</SelectItem>
          <SelectItem value="4">4 Participants</SelectItem>
          <SelectItem value="5">5 Participants</SelectItem>
          <SelectItem value="6">6 Participants</SelectItem>
          <SelectItem value="7">7 Participants</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
