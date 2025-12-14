import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const IndexUrgentAvailability = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-water-blue to-deep-blue text-white">
      <div className="container-custom text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Want to complete your ACT boat licence logbook this weekend? Spots are limited.
        </h3>
        <Button 
          onClick={handleBookNow}
          className="bg-white text-water-blue hover:bg-sky-light font-bold px-10 py-4 text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Book Your Spot Now
        </Button>
      </div>
    </section>
  );
};

export default IndexUrgentAvailability;
