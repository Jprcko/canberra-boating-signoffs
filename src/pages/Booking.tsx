
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/ui/Hero";
import ServiceSelection from "@/components/booking/ServiceSelection";
import BookingForm from "@/components/booking/BookingForm";
import Benefits from "@/components/booking/Benefits";

const BookingPage = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  return (
    <Layout>
      <Hero
        title="Book Your Session"
        subtitle="Schedule your boating logbook supervision and get one step closer to your licence"
        backgroundImage="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1920&q=80"
        showButton={false}
      />

      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Book Your Boating Session</h2>
            <p className="text-gray-700">
              Select one or more services that fit your needs
            </p>
          </div>

          <ServiceSelection
            selectedServices={selectedServices}
            onServiceSelection={setSelectedServices}
          />

          <BookingForm selectedServices={selectedServices} />
        </div>
      </section>

      <Benefits />
    </Layout>
  );
};

export default BookingPage;
