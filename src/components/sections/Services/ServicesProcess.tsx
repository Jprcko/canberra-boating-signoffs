
const ServicesProcess = () => {
  return (
    <section className="section-padding bg-slate-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Our straightforward process makes it easy to complete your logbook requirements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="w-16 h-16 bg-water-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-3">Book Your Session</h3>
            <p className="text-gray-700">
              Choose your preferred service and select an available date and time that works for you.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="w-16 h-16 bg-water-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-3">Meet Your Supervisor</h3>
            <p className="text-gray-700">
              Meet at the arranged location where our qualified instructor will guide you through the session.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="w-16 h-16 bg-water-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-3">Complete Your Logbook</h3>
            <p className="text-gray-700">
              Practice your skills while your supervisor provides guidance and officially signs off your logbook.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="w-16 h-16 bg-water-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
            <h3 className="text-xl font-semibold mb-3">Sit Your Test at Roads and Maritime</h3>
            <p className="text-gray-700">
              With your completed logbook, attend your test at Roads and Maritime Services to receive your official boat licence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesProcess;
