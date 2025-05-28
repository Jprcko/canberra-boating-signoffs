import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
const Testimonials = () => {
  const testimonials = [{
    id: 1,
    name: "Sarah Johnson",
    location: "Canberra",
    text: "So easy! I got my logbook done in one day and got my licence the next day.",
    rating: 5
  }, {
    id: 2,
    name: "Mike Chen",
    location: "ACT",
    text: "Professional service and great instruction. The full day package was worth every penny!",
    rating: 5
  }, {
    id: 3,
    name: "Emma Wilson",
    location: "Queanbeyan",
    text: "Highly recommend! The instructor was patient and knowledgeable. Made the whole process stress-free.",
    rating: 5
  }];
  return <section className="section-padding bg-slate-light bg-white">
      <div className="container-custom bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">What Our Clients Say</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients who successfully completed their boat licence requirements.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => <Card key={testimonial.id} className="border-0 shadow-lg">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <blockquote className="text-lg text-gray-700 mb-6 italic">
                    "{testimonial.text}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-navy">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>
    </section>;
};
export { Testimonials };