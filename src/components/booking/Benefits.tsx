import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const Benefits = () => {
  return <section className="section-padding bg-slate-light">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Why Book With Us</h2>
          <p className="text-gray-700">
            Here's what makes our boating supervision services the best choice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Qualified Instructors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                All our supervisors are fully qualified with extensive experience on Canberra waterways,
                ensuring you receive expert guidance during your session.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Flexible Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">We run weekend sessions from 9am to 4pm — a full day on the water designed to complete your entire logbook in one go.</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>All Equipment Provided</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">We provide the boat and all necessary safety equipment for your session. Just bring appropriate clothing.</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Satisfaction Guaranteed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We're committed to helping you succeed in obtaining your boat licence.
                Our comprehensive guidance ensures you're well-prepared.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default Benefits;