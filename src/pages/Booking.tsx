import { useState } from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/ui/Hero";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Book, TestTube, Users, CalendarIcon, Clock, Drink, Lunch } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const BookingPage = () => {
  const [date, setDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    {
      id: "full",
      name: "Full Logbook Package",
      price: "$499",
      description: "Complete your logbook requirements in one day",
      features: [
        "Full day on the water (9am to 4pm)",
        "Professional instructor/supervisor",
        "Complete logbook sign-offs",
        "Free lunch + drink at the Light House Pub",
        "Exam preparation guidance"
      ],
      icon: Book,
      highlight: true
    },
    {
      id: "group",
      name: "Group Package",
      description: "Cost-effective option for friends or family members learning together",
      price: "Calculated by group size",
      features: [
        "Shared full-day supervised session",
        "Per person discount",
        "Individual logbook sign-offs",
        "Fun, social learning environment",
        "Group booking convenience"
      ],
      icon: Users
    },
    {
      id: "test",
      name: "Test Readiness Session",
      price: "$150",
      description: "Online preparation for your practical test",
      features: [
        "1-hour online preparation",
        "Test simulation exercises",
        "Key skill reinforcement",
        "Final tips and guidance",
        "Confidence building"
      ],
      icon: TestTube
    }
  ];

  const isServiceSelectionValid = (serviceId: string) => {
    const updatedSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];

    // Group package can't be combined with full logbook package
    if (serviceId === 'group' && updatedSelection.includes('full')) return false;
    if (serviceId === 'full' && updatedSelection.includes('group')) return false;

    return true;
  };

  const handleServiceSelection = (serviceId: string) => {
    if (!isServiceSelectionValid(serviceId)) {
      toast({
        title: "Invalid Selection",
        description: "Group package cannot be combined with Full Logbook Package",
        variant: "destructive"
      });
      return;
    }

    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Booking Request Submitted",
        description: "We've received your booking request and will confirm shortly.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <Hero
        title="Book Your Session"
        subtitle="Schedule your boating logbook supervision and get one step closer to your licence"
        backgroundImage="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1920&q=80"
        showButton={false}
      />

      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Book Your Boating Session</h2>
            <p className="text-gray-700">
              Select one or more services that fit your needs
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your Services</CardTitle>
              <CardDescription>Choose the services that best fit your needs - you can combine compatible options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="relative">
                    <div
                      className={cn(
                        "flex flex-col h-full p-4 border rounded-lg cursor-pointer transition-all",
                        selectedServices.includes(service.id) 
                          ? "border-water-blue bg-sky-light" 
                          : "hover:bg-slate-light hover:border-gray-300"
                      )}
                      onClick={() => handleServiceSelection(service.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <service.icon className="h-5 w-5 text-water-blue" />
                        <span className="font-semibold text-lg">{service.name}</span>
                      </div>
                      <span className="text-water-blue font-bold text-xl mb-2">{service.price}</span>
                      <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                      <ul className="space-y-2 text-sm">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            {feature.includes("lunch") ? <Lunch className="h-4 w-4 text-water-blue shrink-0 mt-0.5" /> :
                             feature.includes("drink") ? <Drink className="h-4 w-4 text-water-blue shrink-0 mt-0.5" /> :
                             feature.includes("9am to 4pm") ? <Clock className="h-4 w-4 text-water-blue shrink-0 mt-0.5" /> :
                             <div className="h-4 w-4 rounded-full border-2 border-water-blue shrink-0 mt-0.5" />}
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Checkbox
                        checked={selectedServices.includes(service.id)}
                        className="absolute top-4 right-4"
                        onCheckedChange={() => handleServiceSelection(service.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
          
          <div className="mt-8 p-4 bg-slate-light rounded-lg text-center">
            <p className="text-sm text-gray-600">
              After submitting your booking request, you will receive an email with payment instructions.
              Your booking will be confirmed once payment is received.
            </p>
          </div>
        </div>
      </section>

      {/* Available Dates Section - could be expanded with a more complex booking system */}
      <section className="section-padding bg-slate-light">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Why Book With Us</h2>
            <p className="text-gray-700">
              Here's what makes our boating supervision services the best choice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Qualified Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  All our supervisors are fully qualified with extensive experience on Canberra waterways,
                  ensuring you receive expert guidance during your session.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Flexible Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We offer weekday and weekend sessions to accommodate your schedule, 
                  with early morning and afternoon options available.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle>All Equipment Provided</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We provide the boat and all necessary safety equipment for your session.
                  Just bring your logbook and appropriate clothing.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Satisfaction Guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We're committed to helping you succeed in obtaining your boat licence.
                  Our comprehensive guidance ensures you're well-prepared.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;
