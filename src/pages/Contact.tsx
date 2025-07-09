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
import { FAQ } from "@/components/sections/FAQ";
import ChatbaseAsk from "@/components/sections/ChatbaseAsk";
const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thanks for reaching out! We'll get back to you shortly."
      });
      setIsSubmitting(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };
  return <Layout>
      <Hero title="Contact Us" subtitle="Get in touch with our team for inquiries and support" backgroundImage="https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=1920&q=80" showButton={false} />

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
                    <p className="text-gray-700">team@actboatlicencesignoff.com.au</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-water-blue mt-1" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-700">Macdermott Place Boat Ramp
Belconnen ACT 2617</p>
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
                      <Button asChild variant="link" className="p-0 h-auto text-water-blue text-base font-normal">
                        <a href="/booking">Book Online</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map showing Macdermott Place Boat Ramp */}
              <div className="h-64 bg-slate-light rounded-lg flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2234.9713245856124!2d149.0618760095852!3d-35.228320053744994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b17ad0b6385146b%3A0x69bffcca7d5de4fa!2sMacdermott%20Place%20Boat%20Ramp!5e1!3m2!1sen!2sau!4v1752041454665!5m2!1sen!2sau"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
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
                      <Textarea id="message" placeholder="Type your message here..." className="min-h-[150px]" required />
                    </div>
                    
                    <Button type="submit" className="w-full bg-water-blue hover:bg-deep-blue" disabled={isSubmitting}>
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
      <div className="bg-slate-light">
        <FAQ />
      </div>

      {/* Chatbase Ask Section */}
      <ChatbaseAsk />

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
    </Layout>;
};
export default Contact;