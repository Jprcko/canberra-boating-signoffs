import Layout from "@/components/layout/Layout";
import { HowItWorks } from "@/components/sections/HowItWorks";
import Hero from "@/components/ui/Hero";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <Layout>
      <Hero
        title="Get Your Boat Licence with Confidence"
        subtitle="Professional logbook supervision and boat licence training in NSW"
        backgroundImage="https://images.unsplash.com/photo-1559180709-73e7982729bb?auto=format&fit=crop&w=1920&q=80"
      >
        <div className="flex gap-4 mt-8">
          <Link to="/services">
            <Button className="bg-water-blue hover:bg-deep-blue text-white px-8 py-6 text-lg">
              View Services
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary" className="bg-white text-water-blue hover:bg-sky-light px-8 py-6 text-lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </Hero>
      
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
            {/* Example Service Card - Replace with actual data */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Single Session Sign-Off</CardTitle>
                <CardDescription>Perfect for those needing a one-off supervised session.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-water-blue">$199</p>
                {/* Add service details here */}
              </CardContent>
              <CardFooter>
                <Link to="/booking" className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Full Logbook Package</CardTitle>
                <CardDescription>Complete your entire logbook with our comprehensive package.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-water-blue">$499</p>
                {/* Add service details here */}
              </CardContent>
              <CardFooter>
                <Link to="/booking" className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Group Package (2-5 people)</CardTitle>
                <CardDescription>Cost-effective option for friends or family learning together.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-water-blue">From $149 per person</p>
                {/* Add service details here */}
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

      {/* Why Choose Us Section */}
      <section className="section-padding bg-slate-light">
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
              <h3 className="text-xl font-semibold mb-3">Personalized Approach</h3>
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
    </Layout>
  );
};

export default Index;
