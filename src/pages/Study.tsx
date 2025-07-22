
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import StudyModule from "@/components/study/StudyModule";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Study = () => {
  const { user } = useAuth();
  const [completedModules, setCompletedModules] = useState<number[]>([]);

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

  // Sequential unlocking logic for boating modules
  const getBoatingModules = () => {
    const baseModules = [
      { id: 1, title: "Navigation marks, lights & sounds" },
      { id: 2, title: "Collision Rules" },
      { id: 3, title: "Lifejackets and safety equipment" },
      { id: 4, title: "Preparation, behaviour and decisions" },
      { id: 5, title: "Waterways and designated areas" },
      { id: 6, title: "Emergencies and incidents" },
      { id: 7, title: "Protecting the environment" }
    ];

    return baseModules.map((module, index) => {
      const isCompleted = completedModules.includes(module.id);
      
      // First two modules (Navigation marks and Collision Rules) are always unlocked
      if (module.id === 1 || module.id === 2) {
        return { ...module, completed: isCompleted, locked: false };
      }

      // Check if either of the first two modules is completed
      const hasCompletedInitialModule = completedModules.includes(1) || completedModules.includes(2);
      
      // For subsequent modules, check if previous module is completed
      const previousModuleCompleted = index === 0 || completedModules.includes(baseModules[index - 1].id);
      
      const isUnlocked = hasCompletedInitialModule && previousModuleCompleted;
      
      return { 
        ...module, 
        completed: isCompleted, 
        locked: !isUnlocked 
      };
    });
  };

  const pwcModules = [
    { id: 1, title: "PWC Safety", completed: false, locked: false },
    { id: 2, title: "Operating Rules", completed: false, locked: true },
    { id: 3, title: "Maintenance", completed: false, locked: true }
  ];

  const boatingModules = getBoatingModules();

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-2">Study Library</h1>
                <p className="text-gray-600">
                  Complete all modules to unlock your mock exam
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

          <Tabs defaultValue="boating" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="boating">Boating Handbook</TabsTrigger>
              <TabsTrigger value="pwc">PWC Handbook</TabsTrigger>
            </TabsList>

            <TabsContent value="boating" className="space-y-4">
              {boatingModules.map((module) => (
                <StudyModule key={module.id} module={module} />
              ))}
            </TabsContent>

            <TabsContent value="pwc" className="space-y-4">
              {pwcModules.map((module) => (
                <StudyModule key={module.id} module={module} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Study;
