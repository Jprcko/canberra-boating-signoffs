
import { useState, useEffect } from "react";
import { ParticipantInfo } from "@/types/booking";

export const useBookingFormState = () => {
  const [participants, setParticipants] = useState<string>("2");
  const [participantsInfo, setParticipantsInfo] = useState<ParticipantInfo[]>([
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
    { firstName: "", middleName: "", lastName: "", email: "", phone: "" },
  ]);

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

  useEffect(() => {
    const newParticipantsInfo = Array(Number(participants))
      .fill(null)
      .map((_, index) => 
        participantsInfo[index] || { firstName: "", middleName: "", lastName: "", email: "", phone: "" }
      );
    setParticipantsInfo(newParticipantsInfo);
  }, [participants]);

  return {
    participants,
    setParticipants,
    participantsInfo,
    handleParticipantChange
  };
};
