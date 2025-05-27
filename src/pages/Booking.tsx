
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ServiceSelection from "@/components/booking/ServiceSelection";
import BookingForm from "@/components/booking/BookingForm";

const Booking = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-light py-8">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-navy mb-4">Book Your Session</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Choose your session below to complete all your logbook requirements in one go. Once you're done, we'll sign you off and help you book your official test at Service NSW.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ServiceSelection 
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />
            
            {selectedServices.length > 0 && (
              <BookingForm selectedServices={selectedServices} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
