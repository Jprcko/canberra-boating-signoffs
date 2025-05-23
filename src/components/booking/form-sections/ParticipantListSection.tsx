
import { FC } from "react";
import { ParticipantForm } from "../ParticipantForm";
import { ParticipantCountSection } from "./ParticipantCountSection";
import { ParticipantInfo } from "@/types/booking";

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
        <ParticipantForm
          participant={participantsInfo[0]}
          index={0}
          onChange={onParticipantChange}
        />
      )}

      {selectedServices.includes("group") && (
        <>
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
