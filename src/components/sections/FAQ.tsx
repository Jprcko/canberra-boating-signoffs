
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Eligibility and Logbook Requirements",
    items: [
      {
        question: "What is the minimum age to start the boating logbook?",
        answer: "You must be at least 12 years old to begin your boating logbook and practical supervised trips."
      },
      {
        question: "Are there restrictions for drivers under 16 years old?",
        answer: `Yes. Young drivers under 16 must follow special rules:
        • No towing above 10 knots
        • No exceeding 20 knots at any time
        • No boating faster than 10 knots at night
        • No PWC (jet ski) driving at night`
      },
      {
        question: "How many trips do I need to complete for the logbook?",
        answer: "You must complete at least three separate supervised trips, practicing a variety of boating skills."
      },
      {
        question: "Can all three trips be completed on the same day?",
        answer: "Yes! Each trip covers different skills and is separately logged."
      },
      {
        question: "How long is my completed logbook valid for?",
        answer: "Once completed and signed, your logbook is valid for 12 months. You must apply for your licence within this period."
      }
    ]
  },
  {
    title: "Booking, Sessions, and Using a Boat",
    items: [
      {
        question: "How do I book a supervision session?",
        answer: "Bookings are done through our easy online system. Select your session type, choose your date and time, and pay securely. There are discounts for group bookings."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept Visa, Mastercard, American Express, and debit cards via Stripe or Square during online booking."
      },
      {
        question: "Do I need my own boat to complete the trips?",
        answer: "No. We provide a vessel for supervised sessions at no extra charge."
      },
      {
        question: "How much does your service cost?",
        answer: `Prices vary depending on the package selected:
        • Single Session Supervision
        • Full Logbook Completion Package (3 trips in 1 day)
        • Group Discounts (2–5 participants)
        Visit our Services page for full pricing details.`
      }
    ]
  },
  {
    title: "Completing Your Licence",
    items: [
      {
        question: "What happens after my logbook is signed off?",
        answer: "You'll take your signed logbook to Service NSW and book the General Boat Licence Knowledge Test."
      },
      {
        question: "How hard is the knowledge test?",
        answer: "The test is straightforward, multiple-choice, and covers boating basics like rules, safety, and navigation. With real-world practice and a quick revision, most people pass easily."
      },
      {
        question: "How long does the knowledge test take?",
        answer: "The test usually takes around 30 minutes to 1 hour, depending on your pace."
      },
      {
        question: "Why do Canberra residents need to go to Service NSW?",
        answer: `The ACT does not run its own boat licensing program. All boat licences for Canberra residents must be obtained through Service NSW, with the nearest office located at:
        Service NSW Queanbeyan
        259 Crawford Street, Queanbeyan NSW 2620
        It's a short drive from central Canberra.`
      },
      {
        question: "How much does the boat licence cost at Service NSW?",
        answer: `Licence Type and Cost (2025):
        • 1-year Licence: $68
        • 3-year Licence: $180
        • 5-year Licence: $280
        (Prices are as per Service NSW current 2025 rates — they may adjust slightly year-to-year.)`
      }
    ]
  },
  {
    title: "Weather, Changes, and Cancellations",
    items: [
      {
        question: "What happens if bad weather cancels my session?",
        answer: "If the weather is unsafe, we will reschedule your session at no extra cost."
      },
      {
        question: "Can I reschedule my booking?",
        answer: "Yes. You may reschedule once for free, provided you notify us at least 48 hours before your session."
      },
      {
        question: "What is your cancellation policy?",
        answer: `• Full refund available if cancelled 48+ hours before the scheduled session.
        • No refund if cancelled within 48 hours, but one free reschedule is offered.`
      }
    ]
  }
];

export const FAQ = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Find answers to common questions about our boat licence training and logbook services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqCategories.map((category, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-navy">{category.title}</h3>
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item, itemIndex) => (
                  <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="whitespace-pre-line text-gray-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
