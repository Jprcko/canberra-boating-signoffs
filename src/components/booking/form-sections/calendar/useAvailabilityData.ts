
import { useState, useEffect } from "react";
import { getAvailability, getBookingCapacity, Availability, BookingCapacity } from "@/services/availabilityService";

export const useAvailabilityData = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [bookingCapacity, setBookingCapacity] = useState<BookingCapacity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAvailabilityData = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      console.log('=== AVAILABILITY DATA LOADING ===');
      console.log('Loading availability data from:', startDate.toISOString().split('T')[0], 'to:', endDate.toISOString().split('T')[0]);

      const [availabilityData, capacityData] = await Promise.all([
        getAvailability(startDate, endDate),
        getBookingCapacity(startDate, endDate)
      ]);
      
      console.log('=== RAW AVAILABILITY DATA ===');
      console.log('Raw availability data:', availabilityData);
      console.log('Number of availability records:', availabilityData.length);
      
      console.log('=== DETAILED AVAILABILITY RECORDS ===');
      availabilityData.forEach((record, index) => {
        console.log(`Record ${index + 1}:`, {
          date: record.date,
          is_available: record.is_available,
          capacity: record.capacity,
          start_time: record.start_time,
          end_time: record.end_time
        });
      });
      
      console.log('=== RAW CAPACITY DATA ===');
      console.log('Raw capacity data:', capacityData);
      console.log('Number of capacity records:', capacityData.length);
      
      setAvailability(availabilityData);
      setBookingCapacity(capacityData);
    } catch (error) {
      console.error('=== ERROR LOADING AVAILABILITY ===');
      console.error('Error loading availability data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailabilityData();
  }, []);

  return {
    availability,
    bookingCapacity,
    isLoading
  };
};
