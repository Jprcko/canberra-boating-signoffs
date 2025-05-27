
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ServicesCallToAction = () => {
  return (
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
  );
};

export default ServicesCallToAction;
