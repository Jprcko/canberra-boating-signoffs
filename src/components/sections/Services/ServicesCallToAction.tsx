
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ServicesCallToAction = () => {
  return (
    <section className="py-16 bg-water-blue text-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl font-bold mb-4">Start Your Boating Journey Today</h2>
        <p className="mb-8 text-xl max-w-2xl mx-auto">
          Join hundreds of satisfied clients who have successfully completed their logbook requirements with our expert supervision
        </p>
        <Link to="/booking">
          <Button className="bg-white text-water-blue hover:bg-sky-light px-8 py-6 text-lg">
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ServicesCallToAction;
