
// This file contains custom type definitions for Supabase tables

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          booking_date: string;
          total_price: number;
          discount_amount: number;
          user_id: string | null;
          created_at: string;
          metadata: {
            preferred_time: string;
            additional_info?: string | null;
            promo_code?: string | null;
            [key: string]: any;
          };
        };
        Insert: {
          id?: string;
          booking_date: string;
          total_price: number;
          discount_amount: number;
          user_id?: string | null;
          created_at?: string;
          metadata?: {
            preferred_time: string;
            additional_info?: string | null;
            promo_code?: string | null;
            [key: string]: any;
          };
        };
        Update: {
          id?: string;
          booking_date?: string;
          total_price?: number;
          discount_amount?: number;
          user_id?: string | null;
          created_at?: string;
          metadata?: {
            preferred_time: string;
            additional_info?: string | null;
            promo_code?: string | null;
            [key: string]: any;
          };
        };
      };
      booking_services: {
        Row: {
          id: string;
          booking_id: string;
          service_id: string;
          price_per_person: number;
          participants: number;
        };
        Insert: {
          id?: string;
          booking_id: string;
          service_id: string;
          price_per_person: number;
          participants: number;
        };
        Update: {
          id?: string;
          booking_id?: string;
          service_id?: string;
          price_per_person?: number;
          participants?: number;
        };
      };
      booking_participants: {
        Row: {
          id: string;
          booking_id: string;
          first_name: string;
          middle_name: string | null;
          last_name: string;
          email: string;
          phone: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          first_name: string;
          middle_name?: string | null;
          last_name: string;
          email: string;
          phone: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          first_name?: string;
          middle_name?: string | null;
          last_name?: string;
          email?: string;
          phone?: string;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          question: string;
          options: string;
          correct_answer: string;
          section: string | null;
          category: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          options: string;
          correct_answer: string;
          section?: string | null;
          category?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          options?: string;
          correct_answer?: string;
          section?: string | null;
          category?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
