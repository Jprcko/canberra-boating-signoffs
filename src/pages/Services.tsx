import Layout from "@/components/layout/Layout";
import Hero from "@/components/ui/Hero";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { FAQ } from "@/components/sections/FAQ";

const Services = () => {
  const services = [
    {
      id: "single",
      title: "Single Session Sign-Off",
      description: "Perfect for those who just need a one-off supervised session to complete their logbook requirements.",
      price: "$199",
      features: [
        "2-hour supervised boating session",
        "Professional instructor/supervisor",
        "Official logbook sign-off",
        "Guidance on boating safety and skills",
        "Flexible scheduling options"
      ]
    },
    {
      id: "full",
      title: "Full Logbook Package",
      description: "Complete your entire logbook with our comprehensive supervision package.",
      price: "$499",
      features: [
        "All required supervised hours",
        "Multiple sessions as needed",
        "Complete logbook sign-offs",
        "Personalized skill development",
        "Exam preparation guidance",
        "Priority scheduling"
      ],
      highlight: true
    },
    {
      id: "group",
      title: "Group Package (2-5 people)",
      description: "Cost-effective option for friends or family members learning together.",
      price: "From $149 per person",
      features: [
        "Shared 3-hour supervised session",
        "Per person discount",
        "Individual logbook sign-offs",
        "Fun, social learning environment",
        "Group booking convenience"
      ]
    },
    {
      id: "test",
      title: "Test Readiness Session",
      description: "Prepare for your practical test with a focused preparation session.",
      price: "$149",
      features: [
        "1-hour intensive preparation",
        "Test simulation exercises",
        "Key skill reinforcement",
        "Final tips and guidance",
        "Confidence building"
      ]
    }
  ];

  return (
    <Layout>
      <Hero
        title="Our Services"
        subtitle="Professional boating supervision and sign-off services tailored to your needs"
        backgroundImage="https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Main Services */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Boating Logbook Services</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Our professional supervision services help you complete your boating logbook requirements 
              with confidence. Choose from our range of options to suit your individual needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className={`${service.highlight ? 'border-water-blue shadow-lg' : ''} card-hover`}
              >
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <p className="text-2xl font-bold text-water-blue">{service.price}</p>
                  <p className="text-gray-700">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-3">What's included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/booking" className="w-full">
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-slate-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Our straightforward process makes it easy to complete your logbook requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-water-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Book Your Session</h3>
              <p className="text-gray-700">
                Choose your preferred service and select an available date and time that works for you.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-water-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Meet Your Supervisor</h3>
              <p className="text-gray-700">
                Meet at the arranged location where our qualified instructor will guide you through the session.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-water-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Complete Your Logbook</h3>
              <p className="text-gray-700">
                Practice your skills while your supervisor provides guidance and officially signs off your logbook.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-water-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-semibold mb-3">Sit Your Test at Roads and Maritime</h3>
              <p className="text-gray-700">
                With your completed logbook, attend your test at Roads and Maritime Services to receive your official boat licence.
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
            Book your boating supervision session today and take the next step toward your boat licence
          </p>
          <Link to="/booking">
            <Button className="bg-white text-water-blue hover:bg-sky-light px-8 py-6 text-lg">
              Book Now
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="bg-slate-light">
        <FAQ />
      </div>

      {/* Call to Action */}
      <section className="py-16 bg-water-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-xl max-w-2xl mx-auto">
            Book your boating supervision session today and take the next step toward your boat licence
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

export default Services;
