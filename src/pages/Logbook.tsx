
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import AddTripModal from "@/components/logbook/AddTripModal";

const Logbook = () => {
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  
  const trips = [
    { 
      id: 1, 
      date: "2024-01-20", 
      waterway: "Sydney Harbour", 
      verified: true,
      duration: "2 hours"
    },
    { 
      id: 2, 
      date: "2024-01-15", 
      waterway: "Pittwater", 
      verified: true,
      duration: "3 hours"
    },
    { 
      id: 3, 
      date: "2024-01-10", 
      waterway: "Botany Bay", 
      verified: false,
      duration: "1.5 hours"
    },
  ];

  const verifiedTrips = trips.filter(trip => trip.verified).length;
  const canBookTest = verifiedTrips >= 3;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-navy mb-2">Logbook</h1>
              <p className="text-gray-600">
                Log your boating trips to meet licensing requirements
              </p>
            </div>
            <Button 
              onClick={() => setIsAddTripOpen(true)}
              className="bg-water-blue hover:bg-water-blue/90 text-white rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Trip
            </Button>
          </div>

          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="p-6 bg-white shadow-lg rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-navy mb-1">Trip Requirements</h3>
                  <p className="text-gray-600">
                    You need 3 verified trips to book your test
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-water-blue">{verifiedTrips}/3</p>
                  <Badge className={canBookTest ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {canBookTest ? 'Requirements Met' : 'In Progress'}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-water-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((verifiedTrips / 3) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Trips Table */}
            <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-navy">Logged Trips</h3>
                  <Button variant="outline" className="rounded-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Waterway
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trips.map((trip) => (
                      <tr key={trip.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                          {new Date(trip.date).toLocaleDateString('en-AU')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                          {trip.waterway}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {trip.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {trip.verified ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                <Badge className="bg-green-100 text-green-800">Verified</Badge>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-600 mr-2" />
                                <Badge className="bg-red-100 text-red-800">Pending</Badge>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* Floating Action Button for Mobile */}
        <Button 
          onClick={() => setIsAddTripOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-water-blue hover:bg-water-blue/90 text-white rounded-full shadow-lg md:hidden"
        >
          <Plus className="w-6 h-6" />
        </Button>

        <AddTripModal isOpen={isAddTripOpen} onClose={() => setIsAddTripOpen(false)} />
      </div>
    </Layout>
  );
};

export default Logbook;
