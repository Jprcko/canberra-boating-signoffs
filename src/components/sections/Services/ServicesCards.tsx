
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Book, TestTube, Users } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesCards = () => {
  const services = [
    {
      id: "full",
      title: "Full Logbook Package",
      description: "Complete your logbook requirements in one day",
      price: "$499",
      priceBreakdown: [
        { item: "Logbook supervision", price: "$330" },
        { item: "Use of commercial vessel & fuel", price: "$90" },
        { item: "Certificate, support & resources", price: "$79" }
      ],
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
      title: "Group Package",
      description: "Cost-effective option for friends or family members learning together",
      price: "Calculated by group size",
      features: [
        "Full day on the water (9am to 4pm)",
        "Shared full-day supervised session",
        "Per person discount",
        "Individual logbook sign-offs",
        "Free lunch + drink at the Light House Pub",
        "Fun, social learning environment",
        "Group booking convenience"
      ],
      icon: Users
    },
    {
      id: "test",
      title: "Test Readiness Session",
      description: "Online preparation for your Boat Licence Knowledge Test undertaken at Service ACT",
      price: "$149 per person",
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

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Boating Logbook Services</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Our professional supervision services help you complete your boating logbook requirements 
            with confidence. Choose from our range of options to suit your individual needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className={`${service.highlight ? 'border-water-blue shadow-lg' : ''} card-hover`}
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {service.icon && <service.icon className="h-5 w-5 text-water-blue" />}
                  <CardTitle>{service.title}</CardTitle>
                </div>
                
                {service.priceBreakdown ? (
                  <div className="space-y-2 mb-4">
                    {service.priceBreakdown.map((breakdown, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{breakdown.item}:</span>
                        <span className="font-semibold">{breakdown.price}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">Total:</span>
                        <span className="text-2xl font-bold text-water-blue">{service.price} flat</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-water-blue">{service.price}</p>
                )}
                
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
  );
};

export default ServicesCards;
