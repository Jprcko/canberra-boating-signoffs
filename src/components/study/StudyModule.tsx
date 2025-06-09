
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, Lock, ChevronDown, Play } from "lucide-react";
import { useState } from "react";

interface StudyModuleProps {
  module: {
    id: number;
    title: string;
    completed: boolean;
    locked: boolean;
  };
}

const StudyModule = ({ module }: StudyModuleProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
                  <p>Video: {module.title}</p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold text-navy mb-3">Lesson Content</h4>
                <p className="text-gray-700 mb-4">
                  This module covers the essential aspects of {module.title.toLowerCase()}. 
                  You'll learn the key concepts, regulations, and practical applications 
                  that are essential for safe boating.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Key terminology and definitions</li>
                  <li>Regulatory requirements</li>
                  <li>Best practices and safety considerations</li>
                  <li>Common scenarios and examples</li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-water-blue hover:bg-water-blue/90 text-white rounded-full"
                disabled={module.locked}
              >
                Take Module Quiz
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default StudyModule;
