import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const IndexCompellingMessage = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
    window.scrollTo(0, 0);
  };

  return (
    <section className="section-padding bg-slate-light">
      <div className="container-custom text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
          ACT boat licence logbook signed off in one day. No classrooms. No stress. Just real boating.
        </h2>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
          Spend a full day on the water and walk away ready to book your ACT boat licence test.
        </p>
        <Button 
          onClick={handleBookNow}
          className="bg-water-blue hover:bg-deep-blue text-white px-8 py-6 text-lg"
        >
          Book Your Spot Now
        </Button>
      </div>
    </section>
  );
};

export default IndexCompellingMessage;
