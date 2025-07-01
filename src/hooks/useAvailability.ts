
import { useState, useEffect } from "react";
import { getAvailability, getBookingCapacity, Availability, BookingCapacity } from "@/services/availabilityService";

export const useAvailability = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [bookingCapacity, setBookingCapacity] = useState<BookingCapacity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAvailabilityData();
  }, []);

  const loadAvailabilityData = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const [availabilityData, capacityData] = await Promise.all([
        getAvailability(startDate, endDate),
        getBookingCapacity(startDate, endDate)
      ]);
      
      setAvailability(availabilityData);
      setBookingCapacity(capacityData);
    } catch (error) {
      console.error('Error loading availability data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    availability,
    bookingCapacity,
    isLoading,
    reloadData: loadAvailabilityData
  };
};
