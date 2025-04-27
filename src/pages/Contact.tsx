
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/ui/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thanks for reaching out! We'll get back to you shortly.",
      });
      setIsSubmitting(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <Layout>
      <Hero
        title="Contact Us"
        subtitle="Get in touch with our team for inquiries and support"
        backgroundImage="https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=1920&q=80"
        showButton={false}
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-700 mb-6">
                Have questions about our boating supervision services or need assistance with booking? 
                Reach out to us using the contact form or contact us directly using the information provided.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-water-blue mt-1" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-700">0400 123 456</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-water-blue mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-700">info@canberraboating.com.au</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-water-blue mt-1" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-700">Lake Ginninderra, Canberra ACT</p>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">Operating Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span>8:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span>9:00 AM - 2:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map (Placeholder) - Would be replaced with actual Google Maps embed */}
              <div className="h-64 bg-slate-light rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Google Map would be embedded here</p>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Your contact number" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What is your message about?" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Type your message here..." 
                        className="min-h-[150px]"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-water-blue hover:bg-deep-blue"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-slate-light">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Find quick answers to some of the most common questions about our services
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How do I book a session?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  You can book a session using our online booking system, by phone, or by email. 
                  We'll confirm your booking once payment is received.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What's your cancellation policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Cancellations made more than 48 hours before your session are eligible for a full refund. 
                  Cancellations within 48 hours may be rescheduled but are not refundable.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Where do the sessions take place?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Sessions typically take place on Lake Ginninderra in Canberra. The exact meeting point 
                  will be provided in your booking confirmation.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Do you offer gift certificates?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes, we offer gift certificates for all our services. These make perfect presents for 
                  friends or family members interested in boating.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-water-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-xl max-w-2xl mx-auto">
            Book your supervised boating session today and take the next step toward your boat licence
          </p>
          <Button asChild className="bg-white text-water-blue hover:bg-sky-light px-8 py-6 text-lg">
            <a href="/booking">Book Now</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
