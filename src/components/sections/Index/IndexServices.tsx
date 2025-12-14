import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, TestTube, Users, CheckCircle } from "lucide-react";

const IndexServices = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
    window.scrollTo(0, 0);
  };

  return (
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
          <Card className="card-hover flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-5 w-5 text-water-blue" />
                <CardTitle>Full Logbook Package</CardTitle>
              </div>
              <CardDescription>Complete your logbook requirements in one day</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Logbook supervision:</span>
                  <span className="font-semibold">$330</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Use of commercial vessel & fuel:</span>
                  <span className="font-semibold">$90</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Certificate, support & resources:</span>
                  <span className="font-semibold">$79</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="text-2xl font-bold text-water-blue">$499 flat</span>
                  </div>
                </div>
              </div>
              <h4 className="font-semibold my-3">What's included:</h4>
              <ul className="space-y-2">
                {["Full day on the water (9am to 4pm)", "Professional instructor/supervisor", "Complete logbook sign-offs", "Complimentary lunch + drink at the Light House Pub", "Exam preparation guidance"].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" onClick={handleBookNow}>Book Now</Button>
            </CardFooter>
          </Card>

          <Card className="card-hover flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-water-blue" />
                <CardTitle>Group Package</CardTitle>
              </div>
              <CardDescription>Cost-effective option for friends or family members learning together</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-2xl font-bold text-water-blue">Calculated by group size</p>
              <h4 className="font-semibold my-3">What's included:</h4>
              <ul className="space-y-2">
                {["Full day on the water (9am to 4pm)", "Shared full-day supervised session", "Per person discount", "Individual logbook sign-offs", "Complimentary lunch + drink at the Light House Pub", "Fun, social learning environment", "Group booking convenience"].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" onClick={handleBookNow}>Book Now</Button>
            </CardFooter>
          </Card>

          <Card className="card-hover flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <TestTube className="h-5 w-5 text-water-blue" />
                <CardTitle>Test Readiness Session</CardTitle>
              </div>
              <CardDescription>Online preparation for your Boat Licence Knowledge Test undertaken at Service NSW</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-2xl font-bold text-water-blue">$149 per person</p>
              <h4 className="font-semibold my-3">What's included:</h4>
              <ul className="space-y-2">
                {["1-hour online preparation", "Test simulation exercises", "Key skill reinforcement", "Final tips and guidance", "Confidence building"].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" onClick={handleBookNow}>Book Now</Button>
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
  );
};

export default IndexServices;
