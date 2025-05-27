import Layout from "@/components/layout/Layout";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { Testimonials } from "@/components/sections/Testimonials";
import Hero from "@/components/ui/Hero";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, TestTube, Users } from "lucide-react";
import { CheckCircle } from "lucide-react";

const Index = () => {
  return <Layout>
      <Hero title="Get Your Boat Licence with Confidence" subtitle="Professional logbook supervision and boat licence training in the ACT" backgroundImage="https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1920&q=80">
        {/* Button removed */}
      </Hero>

      {/* New compelling message section */}
      <section className="section-padding bg-slate-light">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
            Logbook signed off in one day. No classrooms. No stress. Just real boating.
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">Spend a full day on the water and walk away ready to book your boat licence test.</p>
          <Link to="/booking">
            
          </Link>
        </div>
      </section>

      {/* Urgent Weekend Availability Section */}
      <section className="py-12 bg-gradient-to-r from-water-blue to-deep-blue text-white">
        <div className="container-custom text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Want to complete your logbook this weekend? Spots are limited.
          </h3>
          <Link to="/booking">
            <Button className="bg-white text-water-blue hover:bg-sky-light font-bold px-10 py-4 text-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              Book Your Spot Now
            </Button>
          </Link>
        </div>
      </section>
      
      <HowItWorks />

      {/* Services Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Services</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              We offer professional boating supervision and logbook sign-off services tailored to your needs.
              Whether you need a single session or a complete logbook package, we're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Book className="h-5 w-5 text-water-blue" />
                  <CardTitle>Full Logbook Package</CardTitle>
                </div>
                <CardDescription>Complete your logbook requirements in one day</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-water-blue">$499</p>
                <h4 className="font-semibold my-3">What's included:</h4>
                <ul className="space-y-2">
                  {["Full day on the water (9am to 4pm)", "Professional instructor/supervisor", "Complete logbook sign-offs", "Free lunch + drink at the Light House Pub", "Exam preparation guidance"].map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>)}
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/booking" className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-water-blue" />
                  <CardTitle>Group Package</CardTitle>
                </div>
                <CardDescription>Cost-effective option for friends or family members learning together</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-water-blue">Calculated by group size</p>
                <h4 className="font-semibold my-3">What's included:</h4>
                <ul className="space-y-2">
                  {["Full day on the water (9am to 4pm)", "Shared full-day supervised session", "Per person discount", "Individual logbook sign-offs", "Free lunch + drink at the Light House Pub", "Fun, social learning environment", "Group booking convenience"].map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>)}
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/booking" className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <TestTube className="h-5 w-5 text-water-blue" />
                  <CardTitle>Test Readiness Session</CardTitle>
                </div>
                <CardDescription>Online preparation for your Boat Licence Knowledge Test undertaken at Service NSW</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-water-blue">$149 per person</p>
                <h4 className="font-semibold my-3">What's included:</h4>
                <ul className="space-y-2">
                  {["1-hour online preparation", "Test simulation exercises", "Key skill reinforcement", "Final tips and guidance", "Confidence building"].map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>)}
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/booking" className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/services">
              <Button variant="secondary" className="bg-white text-water-blue hover:bg-sky-light px-8 py-6 text-lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* Why Choose Us Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose Us</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Experienced instructors, comprehensive training, and a commitment to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-xl font-semibold mb-3">Experienced Instructors</h3>
              <p className="text-gray-700">
                Our certified instructors bring years of experience to guide you through every step.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-xl font-semibold mb-3">Comprehensive Training</h3>
              <p className="text-gray-700">
                We provide thorough training that covers all aspects of boating safety and regulations.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-xl font-semibold mb-3">Personalised Approach</h3>
              <p className="text-gray-700">
                We tailor our training to meet your individual needs and learning style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-water-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-xl max-w-2xl mx-auto">
            Take the first step toward your boat licence today!
          </p>
          <Link to="/booking">
            <Button className="bg-white text-water-blue hover:bg-sky-light px-8 py-6 text-lg">
              Book Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>;
};
export default Index;
