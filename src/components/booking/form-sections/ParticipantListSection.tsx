
import { FC } from "react";
import { ParticipantForm } from "../ParticipantForm";
import { ParticipantCountSection } from "./ParticipantCountSection";
import { ParticipantInfo } from "@/types/booking";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface ParticipantListSectionProps {
  selectedServices: string[];
  participants: string;
  participantsInfo: ParticipantInfo[];
  setParticipants: (value: string) => void;
  onParticipantChange: (
    index: number,
    field: keyof ParticipantInfo,
    value: string | Date | boolean
  ) => void;
}

export const ParticipantListSection: FC<ParticipantListSectionProps> = ({
  selectedServices,
  participants,
  participantsInfo,
  setParticipants,
  onParticipantChange
}) => {
  return (
    <>
      {!selectedServices.includes("group") && (
        <>
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-700">
              Please provide complete information for each participant. Only complete participant records will be submitted.
            </AlertDescription>
          </Alert>
          <ParticipantForm
            participant={participantsInfo[0]}
            index={0}
            onChange={onParticipantChange}
          />
        </>
      )}

      {selectedServices.includes("group") && (
        <>
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-700">
              Please provide complete information for each participant. Only complete participant records will be submitted.
            </AlertDescription>
          </Alert>
          
          <ParticipantCountSection 
            participants={participants}
            onParticipantsChange={setParticipants}
          />

          {participantsInfo.slice(0, Number(participants)).map((participant, index) => (
            <ParticipantForm
              key={index}
              participant={participant}
              index={index}
              onChange={onParticipantChange}
            />
          ))}
        </>
      )}
    </>
  );
};
