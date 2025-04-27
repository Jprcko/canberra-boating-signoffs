export interface ParticipantInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  hasGuardianConsent?: boolean;
  supervisorName?: string;
}

export interface BookingFormProps {
  selectedServices: string[];
}
