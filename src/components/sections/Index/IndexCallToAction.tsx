
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const IndexCallToAction = () => {
  return (
    <section className="py-16 bg-water-blue text-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Your ACT Boat Licence?</h2>
        <p className="mb-8 text-xl max-w-2xl mx-auto">
          Take the first step toward your ACT boat licence today with professional training in Canberra!
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

export default IndexCallToAction;
