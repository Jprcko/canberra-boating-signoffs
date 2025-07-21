
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

  const getModuleContent = () => {
    switch (module.id) {
      case 1: // Navigation marks, lights & sounds
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
      case 2: // Collision Rules
        return {
          description: "Learn the essential rules for avoiding collisions on the water, including right-of-way rules, overtaking procedures, and safe navigation practices.",
          learningObjectives: [
            "Understanding right-of-way rules between different vessel types",
            "Safe overtaking and crossing procedures",
            "Navigation rules in different waterway conditions",
            "Responsibilities of power-driven and sailing vessels",
            "Emergency collision avoidance techniques",
            "Legal requirements and penalties for rule violations"
          ]
        };
      case 3: // Lifejackets and safety equipment
        return {
          description: "Comprehensive guide to personal flotation devices and essential safety equipment required for different types of vessels and water activities.",
          learningObjectives: [
            "Types of lifejackets and their appropriate uses",
            "Legal requirements for safety equipment on different vessels",
            "Proper fitting and maintenance of lifejackets",
            "Emergency signaling devices and communication equipment",
            "Fire safety equipment and procedures",
            "First aid equipment and basic emergency response"
          ]
        };
      case 4: // Preparation, behaviour and decisions
        return {
          description: "Develop crucial decision-making skills and responsible boating behaviors for safe and enjoyable water experiences.",
          learningObjectives: [
            "Pre-departure planning and safety checks",
            "Risk assessment and decision-making on the water",
            "Responsible alcohol and drug policies",
            "Weather assessment and trip planning",
            "Passenger safety briefings and responsibilities",
            "Emergency action planning and communication"
          ]
        };
      case 5: // Waterways and designated areas
        return {
          description: "Navigate different types of waterways safely and understand the various designated areas, restrictions, and special rules that apply.",
          learningObjectives: [
            "Types of waterways and their specific rules",
            "Understanding designated swimming and skiing areas",
            "Speed limits and restricted zones",
            "Marine park and sanctuary regulations",
            "Commercial vessel right-of-way areas",
            "Anchoring and mooring regulations"
          ]
        };
      case 6: // Emergencies and incidents
        return {
          description: "Prepare for and respond effectively to various emergency situations that may occur while boating.",
          learningObjectives: [
            "Emergency communication procedures and equipment",
            "Man overboard recovery techniques",
            "Fire response and prevention on vessels",
            "Grounding and collision response procedures",
            "Search and rescue coordination",
            "Incident reporting requirements and procedures"
          ]
        };
      case 7: // Protecting the environment
        return {
          description: "Learn how to minimize your environmental impact while boating and help protect our precious marine ecosystems.",
          learningObjectives: [
            "Waste disposal and pollution prevention",
            "Fuel and oil spill prevention and response",
            "Protecting marine wildlife and habitats",
            "Sustainable fishing and water recreation practices",
            "Ballast water and invasive species prevention",
            "Legal environmental obligations for boaters"
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
        return "navigation_marks";
      case 2:
        return "collision_rules";
      case 3:
        return "lifejackets_safety";
      case 4:
        return "preparation_behaviour";
      case 5:
        return "waterways_areas";
      case 6:
        return "emergencies_incidents";
      case 7:
        return "protecting_environment";
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
