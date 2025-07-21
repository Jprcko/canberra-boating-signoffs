
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import StudyModule from "@/components/study/StudyModule";

const Study = () => {
  const boatingModules = [
    { id: 1, title: "Navigation marks, lights & sounds", completed: true, locked: false },
    { id: 2, title: "Collision Rules", completed: false, locked: false },
    { id: 3, title: "Lifejackets and safety equipment", completed: false, locked: false },
    { id: 4, title: "Preparation, behaviour and decisions", completed: false, locked: false },
    { id: 5, title: "Waterways and designated areas", completed: false, locked: false },
    { id: 6, title: "Emergencies and incidents", completed: false, locked: false },
    { id: 7, title: "Protecting the environment", completed: false, locked: false }
  ];

  const pwcModules = [
    { id: 1, title: "PWC Safety", completed: false, locked: false },
    { id: 2, title: "Operating Rules", completed: false, locked: true },
    { id: 3, title: "Maintenance", completed: false, locked: true }
  ];

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
