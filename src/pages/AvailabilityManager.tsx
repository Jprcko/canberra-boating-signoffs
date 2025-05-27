import { useState, useEffect } from "react";
import { format, addMonths, startOfMonth, endOfMonth, subMonths } from "date-fns";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAvailability, getBookingCapacity, updateAvailability, Availability, BookingCapacity } from "@/services/availabilityService";

const AvailabilityManager = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [bookingCapacity, setBookingCapacity] = useState<BookingCapacity[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(addMonths(currentMonth, 3));

  useEffect(() => {
    loadAvailabilityData();
  }, [currentMonth]);

  const loadAvailabilityData = async () => {
    try {
      setIsLoading(true);
      const [availabilityData, capacityData] = await Promise.all([
        getAvailability(startDate, endDate),
        getBookingCapacity(startDate, endDate)
      ]);
      
      setAvailability(availabilityData);
      setBookingCapacity(capacityData);
    } catch (error) {
      console.error('Error loading availability data:', error);
      toast({
        title: "Error",
        description: "Failed to load availability data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvailabilityUpdate = async (id: string, updates: Partial<Availability>) => {
    try {
      await updateAvailability(id, updates);
      await loadAvailabilityData();
      toast({
        title: "Success",
        description: "Availability updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      });
    }
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return availability.find(a => a.date === dateString);
  };

  const getBookingCountForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const booking = bookingCapacity.find(b => b.booking_date === dateString);
    return booking?.total_participants || 0;
  };

  const selectedAvailability = selectedDate ? getAvailabilityForDate(selectedDate) : null;
  const selectedBookingCount = selectedDate ? getBookingCountForDate(selectedDate) : 0;

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="text-center">Loading availability data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Availability Manager</h1>
          <p className="text-gray-600">Manage your booking availability and capacity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>Click on a date to view and edit availability</CardDescription>
              
              {/* Month Navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousMonth}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <h3 className="text-lg font-semibold">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextMonth}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
                modifiers={{
                  available: (date) => {
                    const avail = getAvailabilityForDate(date);
                    return avail?.is_available || false;
                  },
                  fullyBooked: (date) => {
                    const avail = getAvailabilityForDate(date);
                    const bookingCount = getBookingCountForDate(date);
                    return avail?.is_available && bookingCount >= (avail?.capacity || 0);
                  }
                }}
                modifiersStyles={{
                  available: { backgroundColor: '#dcfce7', color: '#166534' },
                  fullyBooked: { backgroundColor: '#fecaca', color: '#dc2626' }
                }}
              />
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span>Fully Booked</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, 'PPPP') : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {selectedAvailability ? 'Edit availability settings' : 'No availability data for this date'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedAvailability ? (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="available">Available for Booking</Label>
                    <Switch
                      id="available"
                      checked={selectedAvailability.is_available}
                      onCheckedChange={(checked) => 
                        handleAvailabilityUpdate(selectedAvailability.id, { is_available: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity (People)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="50"
                      value={selectedAvailability.capacity}
                      onChange={(e) => 
                        handleAvailabilityUpdate(selectedAvailability.id, { 
                          capacity: parseInt(e.target.value) || 12 
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={selectedAvailability.start_time}
                        onChange={(e) => 
                          handleAvailabilityUpdate(selectedAvailability.id, { 
                            start_time: e.target.value 
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={selectedAvailability.end_time}
                        onChange={(e) => 
                          handleAvailabilityUpdate(selectedAvailability.id, { 
                            end_time: e.target.value 
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Booking Status</h4>
                    <div className="text-sm text-gray-600">
                      <p>Current Bookings: {selectedBookingCount} people</p>
                      <p>Remaining Capacity: {selectedAvailability.capacity - selectedBookingCount} people</p>
                      <p className={`font-medium ${
                        selectedBookingCount >= selectedAvailability.capacity 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {selectedBookingCount >= selectedAvailability.capacity ? 'Fully Booked' : 'Available'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {selectedDate ? 'No availability data for this date' : 'Please select a date'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AvailabilityManager;
