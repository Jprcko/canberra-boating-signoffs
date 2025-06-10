import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Calendar, DollarSign, FileText } from "lucide-react";
import { useState } from "react";

const BookTest = () => {
  const [selectedTest, setSelectedTest] = useState("boat");

  const requirements = [
    { item: "Valid Photo ID", completed: true },
    { item: "Logbook with 3+ trips", completed: true },
    { item: "Study materials completed", completed: true },
    { item: "Mock exam passed", completed: false }
  ];

  const testOptions = [
    {
      id: "boat",
      name: "Boat Licence Knowledge Test",
      price: "$42",
      description: "Standard boat licence test"
    },
    {
      id: "combined",
      name: "Boat Licence + PWC Knowledge Test",
      price: "$62",
      description: "Combined fee for both tests"
    },
    {
      id: "pwc",
      name: "PWC Knowledge Test Only",
      price: "$20",
      description: "When upgrading to PWC licence"
    }
  ];

  const selectedTestOption = testOptions.find(test => test.id === selectedTest);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">Book Your Test</h1>
            <p className="text-gray-600">
              Ready to take your official boating licence test? Choose your preferred option below.
            </p>
          </div>

          <div className="space-y-8">
            {/* Requirements Checklist */}
            <Card className="p-6 bg-white shadow-lg rounded-xl">
              <h2 className="text-xl font-bold text-navy mb-4">Before You Book</h2>
              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className={`w-5 h-5 ${
                      req.completed ? 'text-green-600' : 'text-gray-300'
                    }`} />
                    <span className={req.completed ? 'text-navy' : 'text-gray-500'}>
                      {req.item}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Test Type Selection */}
            <Card className="p-6 bg-white shadow-lg rounded-xl">
              <h2 className="text-xl font-bold text-navy mb-4">Select Test Type</h2>
              <div className="space-y-3">
                {testOptions.map((test) => (
                  <div 
                    key={test.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTest === test.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTest(test.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-navy">{test.name}</h3>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                      <div className="text-lg font-bold text-navy">{test.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Booking Options */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Service NSW Option */}
              <Card className="p-6 bg-white shadow-lg rounded-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">Service NSW</h3>
                  <p className="text-gray-600">Official government testing centre</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Test fee: {selectedTestOption?.price}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Available locations across NSW
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    Bring ID and logbook
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  onClick={() => window.open('https://www.service.nsw.gov.au/OnlineBookings/ServiceCentre/Select?unitId=21', '_blank')}
                >
                  Book at Service NSW
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </div>

            {/* Important Information */}
            <Card className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="text-lg font-bold text-navy mb-3">Important Information</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• You must bring valid photo identification (driver's licence or passport)</p>
                <p>• Your completed logbook with at least 3 verified trips</p>
                <p>• The test includes both theory and practical components</p>
                <p>• Results are available immediately upon completion</p>
                <p>• Your licence will be posted within 10 business days if you pass</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookTest;
