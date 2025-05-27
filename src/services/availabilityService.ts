
import { supabase } from "@/integrations/supabase/client";

export interface Availability {
  id: string;
  date: string;
  is_available: boolean;
  capacity: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface BookingCapacity {
  booking_date: string;
  total_participants: number;
}

export const getAvailability = async (startDate: Date, endDate: Date): Promise<Availability[]> => {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date');

  if (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }

  return data || [];
};

export const getBookingCapacity = async (startDate: Date, endDate: Date): Promise<BookingCapacity[]> => {
  const { data, error } = await supabase
    .from('booking_capacity_view')
    .select('*')
    .gte('booking_date', startDate.toISOString().split('T')[0])
    .lte('booking_date', endDate.toISOString().split('T')[0]);

  if (error) {
    console.error('Error fetching booking capacity:', error);
    throw error;
  }

  return data || [];
};

export const updateAvailability = async (id: string, updates: Partial<Availability>) => {
  const { data, error } = await supabase
    .from('availability')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating availability:', error);
    throw error;
  }

  return data;
};

export const createAvailability = async (availability: Omit<Availability, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('availability')
    .insert(availability)
    .select()
    .single();

  if (error) {
    console.error('Error creating availability:', error);
    throw error;
  }

  return data;
};
