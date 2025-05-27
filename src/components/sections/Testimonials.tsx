import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Canberra",
      text: "So easy! I got my logbook done in one day and got my licence the next day.",
      rating: 5
    },
    {
      id: 2,
      name: "Mike Chen",
      location: "ACT",
      text: "Professional service and great instruction. The full day package was worth every penny!",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Wilson",
      location: "Queanbeyan",
      text: "Highly recommend! The instructor was patient and knowledgeable. Made the whole process stress-free.",
      rating: 5
    },
    {
      id: 4,
      name: "David Thompson",
      location: "Belconnen",
      text: "Fantastic experience! The on-water training was comprehensive and I felt completely prepared for my test.",
      rating: 5
    },
    {
      id: 5,
      name: "Lisa Martinez",
      location: "Tuggeranong",
      text: "Best decision I made! The instructor was excellent and the lunch at the pub was a nice touch. Passed my test first try!",
      rating: 5
    }
  ];

  return (
    <section className="section-padding bg-slate-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">What Our Clients Say</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients who successfully completed their boat licence requirements.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <div className="p-1">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="flex flex-col items-center text-center p-8">
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-lg text-gray-700 mb-6 italic">
                          "{testimonial.text}"
                        </blockquote>
                        <div>
                          <div className="font-semibold text-navy">{testimonial.name}</div>
                          <div className="text-gray-600">{testimonial.location}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export { Testimonials };
