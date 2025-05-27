
const IndexWhyChooseUs = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Why Choose Us</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Experienced instructors, comprehensive training, and a commitment to your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">Experienced Instructors</h3>
            <p className="text-gray-700">
              Our certified instructors bring years of experience to guide you through every step.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">Comprehensive Training</h3>
            <p className="text-gray-700">
              We provide thorough training that covers all aspects of boating safety and regulations.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">Personalised Approach</h3>
            <p className="text-gray-700">
              We tailor our training to meet your individual needs and learning style.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndexWhyChooseUs;
