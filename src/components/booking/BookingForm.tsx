
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BookingFormProps {
  selectedServices: string[];
}

const BookingForm = ({ selectedServices }: BookingFormProps) => {
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Booking Request Submitted",
        description: "We've received your booking request and will confirm shortly.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
        <CardDescription>Fill in your details and choose your preferred date</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your@email.com" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Your contact number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">Number of Participants</Label>
              <Input 
                id="participants" 
                type="number" 
                min="1" 
                max="5" 
                defaultValue="1" 
                disabled={!selectedServices.includes("group")} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => 
                    date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                    date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred-time">Preferred Time</Label>
            <select 
              id="preferred-time"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-water-blue focus:border-transparent"
            >
              <option value="">Select a time</option>
              <option value="morning">Morning (9am - 12pm)</option>
              <option value="afternoon">Afternoon (1pm - 4pm)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea 
              id="message" 
              placeholder="Any special requirements or questions..." 
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="promo">Promo Code (Optional)</Label>
            <Input id="promo" placeholder="Enter promo code if you have one" />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-water-blue hover:bg-deep-blue" 
            disabled={selectedServices.length === 0 || !date || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Complete Booking"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;
