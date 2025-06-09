
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

const MockExam = () => {
  const [adaptiveMode, setAdaptiveMode] = useState(false);

  const previousAttempts = [
    { date: "2024-01-15", score: 82, passed: true },
    { date: "2024-01-10", score: 76, passed: false },
    { date: "2024-01-05", score: 69, passed: false },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">Mock Exam</h1>
            <p className="text-gray-600">
              Test your knowledge with our comprehensive 50-question practice exam
            </p>
          </div>

          <div className="space-y-8">
            {/* Main Exam Card */}
            <Card className="p-8 bg-white shadow-lg rounded-xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-navy mb-2">50-Question Mock Test</h2>
                <p className="text-gray-600 mb-6">
                  Complete practice exam covering all topics. Pass mark: 80%
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-bold text-navy">45 Minutes</p>
                </div>
                <div className="text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Pass Mark</p>
                  <p className="text-lg font-bold text-navy">40/50 (80%)</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Best Score</p>
                  <p className="text-lg font-bold text-navy">82%</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-navy">Adaptive Review Mode</p>
                  <p className="text-sm text-gray-600">Cycles missed questions until 3 consecutive correct</p>
                </div>
                <Switch checked={adaptiveMode} onCheckedChange={setAdaptiveMode} />
              </div>

              <Button className="w-full bg-gradient-to-r from-navy to-blue-700 hover:from-navy/90 hover:to-blue-700/90 text-white rounded-full py-4 text-lg font-semibold">
                Start Mock Exam
              </Button>
            </Card>

            {/* Previous Attempts */}
            <Card className="p-6 bg-white shadow-lg rounded-xl">
              <h3 className="text-xl font-bold text-navy mb-4">Previous Attempts</h3>
              <div className="space-y-3">
                {previousAttempts.map((attempt, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-navy">
                        {new Date(attempt.date).toLocaleDateString('en-AU')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Score: {attempt.score}%
                      </p>
                    </div>
                    <Badge className={attempt.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MockExam;
