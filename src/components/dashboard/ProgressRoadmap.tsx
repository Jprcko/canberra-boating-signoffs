import { Card } from "@/components/ui/card";
import { CheckCircle, Circle, BookOpen, Ship, FileText, Calendar, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const ProgressRoadmap = () => {
  const { user } = useAuth();

  // Fetch user's booking data
  const { data: bookingData } = useQuery({
    queryKey: ['user-booking', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_date')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching booking:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  const bookingDate = bookingData?.booking_date ? new Date(bookingData.booking_date) : null;
  const currentDate = new Date();
  const isBookingDatePassed = bookingDate && currentDate > bookingDate;

  const steps = [
    {
      id: 1,
      title: "Study",
      icon: BookOpen,
      completed: true,
      progress: 100
    },
    {
      id: 2,
      title: "Log Trips",
      icon: Ship,
      completed: isBookingDatePassed || false,
      progress: isBookingDatePassed ? 100 : 0,
      bookingDate: bookingDate
    },
    {
      id: 3,
      title: "Mock Exam",
      icon: FileText,
      completed: false,
      progress: 0
    },
    {
      id: 4,
      title: "Book Service NSW Test",
      icon: Calendar,
      completed: false,
      progress: 0
    },
    {
      id: 5,
      title: "Upload Paperwork",
      icon: Upload,
      completed: false,
      progress: 0
    }
  ];

  return (
    <Card className="p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-navy mb-6">Your Progress</h2>
      
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                step.completed 
                  ? 'bg-water-blue border-water-blue text-white' 
                  : step.progress > 0 
                    ? 'bg-water-blue/20 border-water-blue text-water-blue'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 bg-gray-200 rounded">
                  <div 
                    className="h-1 bg-water-blue rounded transition-all duration-500"
                    style={{ width: step.completed ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-navy">{step.title}</p>
              {step.id === 2 && step.bookingDate && (
                <p className="text-xs text-gray-600 mt-1">
                  Session: {format(step.bookingDate, 'MMM dd, yyyy')}
                </p>
              )}
              <div className="w-16 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-water-blue h-2 rounded-full transition-all duration-500"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">{step.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProgressRoadmap;
