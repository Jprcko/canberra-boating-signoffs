
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Play, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Quizzes = () => {
  const quizzes = [
    { id: 1, title: "Navigation Marks", status: "Passed", score: 90 },
    { id: 2, title: "Collision Rules", status: "In Progress", score: null },
    { id: 3, title: "Safety Equipment", status: "Not Started", score: null },
    { id: 4, title: "Weather and Tides", status: "Not Started", score: null },
    { id: 5, title: "Emergency Procedures", status: "Not Started", score: null },
    { id: 6, title: "PWC Safety", status: "Failed", score: 65 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed': return <CheckCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Failed': return <XCircle className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-2">Module Quizzes</h1>
                <p className="text-gray-600">
                  Complete all quizzes with 80% or higher to unlock the mock exam
                </p>
              </div>
              <Link to="/client-portal">
                <Button variant="default" className="bg-navy hover:bg-navy/90 text-white px-6 py-2 shadow-lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(quiz.status)}
                    <h3 className="text-lg font-semibold text-navy">{quiz.title}</h3>
                  </div>
                  <Badge className={getStatusColor(quiz.status)}>
                    {quiz.status}
                  </Badge>
                </div>

                {quiz.score && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Last Score</p>
                    <p className={`text-2xl font-bold ${
                      quiz.score >= 80 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {quiz.score}%
                    </p>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">10 Questions • 15 Minutes</p>
                  <p className="text-sm text-gray-600">Pass: 80% or higher</p>
                </div>

                <Button 
                  className="w-full bg-water-blue hover:bg-water-blue/90 text-white rounded-full"
                  disabled={quiz.status === 'Passed'}
                >
                  {quiz.status === 'Passed' ? 'Completed' : 
                   quiz.status === 'In Progress' ? 'Continue Quiz' : 
                   quiz.status === 'Failed' ? 'Retake Quiz' : 'Start Quiz'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Quizzes;
