
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Upload, Download, Filter, UserPlus, BarChart3 } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/seo/SEO";

const Admin = () => {
  const [selectedCohort, setSelectedCohort] = useState("all");

  const cohortData = [
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      mockExamBest: 85,
      tripsLogged: 3,
      testBooked: true,
      progress: 95
    },
    {
      name: "Mike Chen",
      email: "mike@example.com",
      mockExamBest: 72,
      tripsLogged: 2,
      testBooked: false,
      progress: 70
    },
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      mockExamBest: 88,
      tripsLogged: 4,
      testBooked: true,
      progress: 100
    }
  ];

  const auditLogs = [
    {
      timestamp: "2024-01-20 14:30",
      action: "Mock exam completed",
      userId: "sarah@example.com",
      details: "Score: 85%"
    },
    {
      timestamp: "2024-01-20 12:15",
      action: "Trip logged",
      userId: "mike@example.com", 
      details: "Pittwater - 2 hours"
    },
    {
      timestamp: "2024-01-19 16:45",
      action: "Study module completed",
      userId: "emma@example.com",
      details: "Navigation Marks"
    }
  ];

  return (
    <Layout>
      <SEO title="Admin Dashboard | ACT Boats & Licensing" description="Admin tools and cohort management." canonicalPath="/admin" noindex />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              Manage cohorts, track progress and monitor system activity
            </p>
          </div>

          <Tabs defaultValue="cohort" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="cohort">Cohort Tracker</TabsTrigger>
              <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>

            <TabsContent value="cohort" className="space-y-6">
              {/* Filters */}
              <Card className="p-4 bg-white shadow-lg rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select 
                      value={selectedCohort}
                      onChange={(e) => setSelectedCohort(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="all">All Cohorts</option>
                      <option value="2024-jan">January 2024</option>
                      <option value="2024-feb">February 2024</option>
                    </select>
                  </div>
                  <Button variant="outline" className="rounded-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </Card>

              {/* Cohort Table */}
              <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mock Exam Best
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trips Logged
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Booked
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cohortData.map((student, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-navy">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-lg font-bold ${
                              student.mockExamBest >= 80 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {student.mockExamBest}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">
                            {student.tripsLogged}/3
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={student.testBooked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {student.testBooked ? 'Booked' : 'Not Booked'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="bg-water-blue h-2 rounded-full"
                                  style={{ width: `${student.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-navy">{student.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="enrollment" className="space-y-6">
              <Card className="p-6 bg-white shadow-lg rounded-xl">
                <h3 className="text-xl font-bold text-navy mb-4">Bulk Enrollment</h3>
                <p className="text-gray-600 mb-6">
                  Upload a CSV file to create multiple learner accounts and send invitations
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-navy mb-2">Upload CSV File</h4>
                  <p className="text-gray-600 mb-4">
                    File should contain: Name, Email, Cohort
                  </p>
                  <Button className="bg-water-blue hover:bg-water-blue/90 text-white rounded-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>

                <div className="mt-6">
                  <Button variant="outline" className="rounded-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-lg rounded-xl">
                <h3 className="text-xl font-bold text-navy mb-4">Manual Enrollment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input placeholder="Student Name" />
                  <Input placeholder="Email Address" type="email" />
                  <select className="border border-gray-300 rounded-lg px-3 py-2">
                    <option>Select Cohort</option>
                    <option>January 2024</option>
                    <option>February 2024</option>
                  </select>
                </div>
                <Button className="bg-navy hover:bg-navy/90 text-white rounded-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6">
              <Card className="bg-white shadow-lg rounded-xl">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-navy">System Activity Log</h3>
                    <Button variant="outline" className="rounded-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auditLogs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {log.timestamp}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {log.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
