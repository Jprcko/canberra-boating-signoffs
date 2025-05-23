
export interface Booking {
  id: string;
  booking_date: string;
  total_price: number;
  discount_amount: number;
  user_id: string | null;
  created_at: string;
  metadata: {
    preferred_time: string;
    [key: string]: any;
  };
}

export interface BookingService {
  id: string;
  booking_id: string;
  service_id: string;
  price_per_person: number;
  participants: number;
}

export interface BookingParticipant {
  id: string;
  booking_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone: string;
}
