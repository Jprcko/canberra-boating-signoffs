
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudyModule from "@/components/study/StudyModule";

const Study = () => {
  const boatingModules = [
    { id: 1, title: "Navigation Marks", completed: true, locked: false },
    { id: 2, title: "Collision Rules", completed: false, locked: false },
    { id: 3, title: "Safety Equipment", completed: false, locked: true },
    { id: 4, title: "Weather and Tides", completed: false, locked: true },
    { id: 5, title: "Emergency Procedures", completed: false, locked: true }
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
            <h1 className="text-3xl font-bold text-navy mb-2">Study Library</h1>
            <p className="text-gray-600">
              Complete all modules to unlock your mock exam
            </p>
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
