import Layout from "@/components/layout/Layout";
import Hero from "@/components/ui/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Award, Users, Clock } from "lucide-react";
const About = () => {
  return <Layout>
      <Hero title="About Canberra Boating Sign-Offs" subtitle="Your trusted partner for professional boat licence logbook supervision in the ACT" backgroundImage="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80" showButton={false} />

      {/* Why I Started This Service */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Why We Started This Service</h2>
            <div className="bg-slate-light rounded-lg p-8">
              <p className="text-lg text-gray-700 leading-relaxed italic">&quot;We created Canberra Boating Sign-Offs to give people a simple, hands-on way to complete their boat licence logbook without the classroom overload. After years of boating and mentoring new skippers, we knew there had to be a better way — and now, there is.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="section-padding bg-slate-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                At Canberra Boating Sign-Offs, we believe getting your boat licence should be straightforward, 
                practical, and enjoyable. We're here to eliminate the stress and confusion from the logbook 
                process by providing professional, one-on-one supervision that gets you water-ready fast.
              </p>
              <p className="text-gray-700 mb-6">
                Our approach is simple: spend a day on the water, learn real boating skills, and walk away 
                with a completed logbook. No lengthy classroom sessions, no unnecessary complications — just 
                quality instruction that prepares you for safe, confident boating.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">What Sets Us Apart</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Complete logbook in just one day</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Hands-on learning on Lake Ginninderra</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Experienced, certified instructors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Personal attention and tailored instruction</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>All-inclusive packages with lunch included</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Values</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              These core values guide everything we do at Canberra Boating Sign-Offs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-water-blue mx-auto mb-2" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We maintain the highest standards in boating instruction and safety supervision.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-water-blue mx-auto mb-2" />
                <CardTitle>Personal Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Every student receives individual attention tailored to their learning style and pace.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-water-blue mx-auto mb-2" />
                <CardTitle>Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Complete your logbook requirements quickly without compromising on quality or safety.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-water-blue mx-auto mb-2" />
                <CardTitle>Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Honest, transparent service with clear pricing and realistic expectations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience & Qualifications */}
      <section className="section-padding bg-slate-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Experience & Qualifications</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              With years of experience on Australian waters and a passion for safe boating, 
              our team brings the expertise you need to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Professional Credentials</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Certified boat licence instructor</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Current First Aid certification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Extensive local water knowledge</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Working with Children Check</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Local Expertise</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Intimate knowledge of Lake Ginninderra</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Understanding of ACT boating regulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Years of experience training new boaters</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-water-blue shrink-0 mt-0.5" />
                  <span>Proven track record of successful students</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-water-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-xl max-w-2xl mx-auto">
            Take the first step toward your boat licence with Canberra's most trusted logbook supervision service
          </p>
          <Link to="/booking">
            <Button className="bg-white text-water-blue hover:bg-sky-light px-8 py-6 text-lg">
              Book Your Session
            </Button>
          </Link>
        </div>
      </section>
    </Layout>;
};
export default About;