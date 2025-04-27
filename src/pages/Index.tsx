
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/ui/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const Home = () => {
  const services = [
    {
      title: "Single Session",
      description: "One-off supervised boating practice session with sign-off.",
      features: ["2-hour session", "Qualified supervisor", "Immediate sign-off"],
      price: "$199",
    },
    {
      title: "Full Logbook Package",
      description: "Complete your entire logbook with professional supervision.",
      features: ["Multiple sessions", "All required hours", "Flexible scheduling"],
      price: "$499",
      highlight: true,
    },
    {
      title: "Group Package",
      description: "Cost-effective option for 2-5 people learning together.",
      features: ["Shared session", "Per person discount", "Fun group environment"],
      price: "From $149pp",
    },
  ];

  const testimonials = [
    {
      name: "Sarah T.",
      text: "Getting my boat license was so much easier with Canberra Boating. Their instructor was patient and made the whole process stress-free.",
    },
    {
      name: "Michael R.",
      text: "I was nervous about handling a boat, but the supervisor was excellent at building my confidence. Highly recommend their services!",
    },
    {
      name: "Emma L.",
      text: "The full logbook package was perfect for me. Well-structured sessions and a friendly instructor made learning enjoyable.",
    },
  ];

  return (
    <Layout>
      <Hero
        title="Canberra Boat Licence Sign-Offs Made Easy"
        subtitle="Professional supervision and sign-off services for your boating logbook"
        backgroundImage="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Introduction Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Get Your Boat Licence Without The Stress</h2>
              <p className="mb-4 text-gray-700">
                We provide professional boating supervision and logbook sign-off services in the Canberra 
                region, making the boat licence process fast, easy, and stress-free.
              </p>
              <p className="mb-6 text-gray-700">
                Our qualified and experienced skippers will guide you through your required supervised hours,
                ensuring you develop strong boating skills while completing your logbook requirements.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services">
                  <Button variant="outline" className="btn-secondary">Learn More</Button>
                </Link>
                <Link to="/booking">
                  <Button className="btn-primary">Book a Session</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80"
                alt="Boating on Lake Ginninderra"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-slate-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the option that works best for you. All services include professional supervision and official logbook sign-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className={`${service.highlight ? 'border-water-blue shadow-lg' : ''} card-hover`}>
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-water-blue" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-2xl font-bold text-navy">{service.price}</p>
                </CardContent>
                <CardFooter>
                  <Link to="/booking" className="w-full">
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/services">
              <Button variant="outline" className="btn-secondary">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="pt-6">
                  <p className="italic text-gray-700 mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold text-navy">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-water-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Complete Your Boating Logbook?</h2>
          <p className="mb-8 text-xl max-w-2xl mx-auto">
            Book your supervised session today and get one step closer to your boat licence
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

export default Home;
