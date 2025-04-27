
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    title: "Book Your Session",
    description: "Choose a single logbook package, or group package. Pick a date and time that suits you — and book easily online with instant confirmation and access to your online portal with useful information."
  },
  {
    number: 2,
    title: "Join Us On The Water",
    description: "We'll guide you through real-world boating skills across three separate trips — all in one day."
  },
  {
    number: 3,
    title: "Get Your Logbook Signed Off",
    description: "After you complete the required activities, we will verify and sign off your boating logbook — ensuring it's ready for your official test."
  },
  {
    number: 4,
    title: "Book Your Official Test",
    description: "With your signed logbook in hand, you can now book and sit your General Boat Licence Knowledge Test at Service NSW."
  },
  {
    number: 5,
    title: "Start Your Boating Adventures!",
    description: "Once you pass the knowledge test, you're officially licensed to hit the water with confidence!"
  }
];

export const HowItWorks = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="section-padding bg-slate-light" ref={ref}>
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Your journey to getting your boat licence, made simple
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                "bg-white rounded-lg p-6 shadow-md transform transition-all duration-700 flex items-start gap-6",
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10",
              )}
              style={{ transitionDelay: inView ? `${index * 200}ms` : '0ms' }}
            >
              <div className="w-12 h-12 bg-water-blue rounded-full flex-shrink-0 flex items-center justify-center text-white text-xl font-bold">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

