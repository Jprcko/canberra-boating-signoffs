
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Play, ArrowLeft, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ModuleQuiz from "@/components/study/ModuleQuiz";
import { useToughestQuestions } from "@/hooks/useToughestQuestions";

const Quizzes = () => {
  const { user } = useAuth();
  const { questions: toughestQuestions, loading: toughestLoading } = useToughestQuestions();
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showToughestQuiz, setShowToughestQuiz] = useState(false);

  // Fetch completed modules from quiz results
  useEffect(() => {
    const fetchCompletedModules = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('quiz_results')
          .select('module_id, percentage')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching quiz results:', error);
          return;
        }

        // Filter modules with passing score (80% or higher)
        const passedModules = (data || [])
          .filter(result => result.percentage >= 80)
          .map(result => parseInt(result.module_id));

        setCompletedModules(passedModules);
      } catch (error) {
        console.error('Error fetching completed modules:', error);
      }
    };

    fetchCompletedModules();
  }, [user]);

  // Dynamic module quizzes based on Study page structure
  const getModuleQuizzes = () => {
    const baseModules = [
      { id: 1, title: "Navigation marks, lights & sounds", category: "navigation_marks" },
      { id: 2, title: "Collision Rules", category: "collision_rules" },
      { id: 3, title: "Lifejackets and safety equipment", category: "safety_equipment" },
      { id: 4, title: "Preparation, behaviour and decisions", category: "preparation_behaviour" },
      { id: 5, title: "Waterways and designated areas", category: "waterways" },
      { id: 6, title: "Emergencies and incidents", category: "emergencies" },
      { id: 7, title: "Protecting the environment", category: "environment" }
    ];

    return baseModules.map((module, index) => {
      const isCompleted = completedModules.includes(module.id);
      
      // First two modules (Navigation marks and Collision Rules) are always unlocked
      if (module.id === 1 || module.id === 2) {
        return { 
          ...module, 
          status: isCompleted ? "Passed" : "Not Started", 
          locked: false,
          score: isCompleted ? 85 : null // Mock score for display
        };
      }

      // Check if either of the first two modules is completed
      const hasCompletedInitialModule = completedModules.includes(1) || completedModules.includes(2);
      
      // For subsequent modules, check if previous module is completed
      const previousModuleCompleted = index === 0 || completedModules.includes(baseModules[index - 1].id);
      
      const isUnlocked = hasCompletedInitialModule && previousModuleCompleted;
      
      return { 
        ...module, 
        status: isCompleted ? "Passed" : isUnlocked ? "Not Started" : "Locked",
        locked: !isUnlocked,
        score: isCompleted ? 85 : null // Mock score for display
      };
    });
  };

  const moduleQuizzes = getModuleQuizzes();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed': return <CheckCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Failed': return <XCircle className="w-4 h-4" />;
      case 'Locked': return <XCircle className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  if (showToughestQuiz) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <ModuleQuiz
              moduleId="toughest"
              moduleTitle="15 Toughest Questions"
              category="toughest"
              onClose={() => setShowToughestQuiz(false)}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-2">Practice Quizzes</h1>
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

          {/* 15 Toughest Questions Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-6">15 Toughest Questions</h2>
            <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg rounded-xl hover:shadow-xl transition-shadow border-2 border-red-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-navy">15 Toughest Questions</h3>
                </div>
                <Badge className="bg-red-100 text-red-800">
                  Challenge
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  {toughestLoading ? 'Loading questions...' : `${toughestQuestions.length} Questions • Dynamic content`}
                </p>
                <p className="text-sm text-gray-600">Top student mistakes</p>
                <p className="text-sm text-gray-600">Pass: 80% or higher</p>
              </div>

              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full"
                onClick={() => setShowToughestQuiz(true)}
                disabled={toughestLoading || toughestQuestions.length === 0}
              >
                {toughestLoading ? 'Loading...' : 
                 toughestQuestions.length === 0 ? 'No Data Available' : 'Start Challenge'}
              </Button>
            </Card>
          </div>

          {/* Module Quizzes Section */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Module Quizzes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moduleQuizzes.map((quiz) => (
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
                    <p className="text-sm text-gray-600">Dynamic Questions • 15 Minutes</p>
                    <p className="text-sm text-gray-600">Pass: 80% or higher</p>
                  </div>

                  <Button 
                    className="w-full bg-water-blue hover:bg-water-blue/90 text-white rounded-full"
                    disabled={quiz.status === 'Passed' || quiz.status === 'Locked'}
                  >
                    {quiz.status === 'Passed' ? 'Completed' : 
                     quiz.status === 'In Progress' ? 'Continue Quiz' : 
                     quiz.status === 'Failed' ? 'Retake Quiz' : 
                     quiz.status === 'Locked' ? 'Locked' : 'Start Quiz'}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Quizzes;
