
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, Lock, ChevronDown, Play } from "lucide-react";
import { useState } from "react";
import ModuleQuiz, { QuizQuestion } from "./ModuleQuiz";

interface StudyModuleProps {
  module: {
    id: number;
    title: string;
    completed: boolean;
    locked: boolean;
    description?: string;
    learningObjectives?: string[];
    videoTitle?: string;
    quizQuestions?: QuizQuestion[];
  };
}

const StudyModule = ({ module }: StudyModuleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Default content for Navigation Marks module
  const getModuleContent = () => {
    switch (module.id) {
      case 1: // Navigation Marks, Lights and Sound
        return {
          description: "This module introduces the key navigational aids, lighting systems, and sound signals you'll encounter on NSW waterways and how to use them for safe and legal boating.",
          learningObjectives: [
            "The different types of navigation marks and their meanings",
            "How to identify marks by shape, colour, and lights",
            "Understanding navigation lights on vessels and their significance",
            "Sound signals and their proper use in different situations",
            "What the law says about passing and obeying marks",
            "Practical safety tips and real-world examples"
          ]
        };
      default:
        return {
          description: `This module covers important aspects of ${module.title} for safe boating practices.`,
          learningObjectives: [
            `Key concepts in ${module.title}`,
            "Safety considerations and best practices",
            "Legal requirements and regulations",
            "Practical applications and examples"
          ]
        };
    }
  };

  const moduleContent = getModuleContent();
  
  // Get category for quiz questions
  const getQuizCategory = () => {
    switch (module.id) {
      case 1: 
        return "Navigation marks, lights & sounds";
      default:
        return null;
    }
  };

  const handleTakeQuiz = () => {
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  return (
    <Card className="overflow-hidden shadow-lg rounded-xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  module.completed 
                    ? 'bg-green-100 text-green-600' 
                    : module.locked 
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-blue-100 text-blue-600'
                }`}>
                  {module.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : module.locked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-navy">{module.title}</h3>
                  <p className="text-sm text-gray-600">
                    {module.completed ? 'Completed' : module.locked ? 'Locked' : 'Available'}
                  </p>
                </div>
              </div>
              
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`} />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="pt-6 space-y-6">
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Play className="w-12 h-12 mx-auto mb-2" />
                  <p>Video: {module.videoTitle || module.title}</p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold text-navy mb-3">Module: {module.title}</h4>
                <p className="text-gray-700 mb-4">
                  {module.description || moduleContent.description}
                </p>
                <h5 className="text-md font-semibold text-navy mb-2">What You'll Learn:</h5>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {(module.learningObjectives || moduleContent.learningObjectives).map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
              
              <Button 
                onClick={handleTakeQuiz}
                className="w-full bg-water-blue hover:bg-water-blue/90 text-white rounded-full"
                disabled={module.locked || !getQuizCategory()}
              >
                {!getQuizCategory() ? 'Quiz Coming Soon' : 'Take Module Quiz'}
              </Button>

              {showQuiz && getQuizCategory() && (
                <ModuleQuiz
                  moduleId={module.id.toString()}
                  moduleTitle={module.title}
                  category={getQuizCategory()}
                  onClose={handleCloseQuiz}
                />
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default StudyModule;
