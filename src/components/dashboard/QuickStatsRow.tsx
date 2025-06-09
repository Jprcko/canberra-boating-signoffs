
import { Card } from "@/components/ui/card";
import { Trophy, Ship, Calendar } from "lucide-react";

const QuickStatsRow = () => {
  const stats = [
    {
      title: "Last Mock Exam Score",
      value: "82%",
      icon: Trophy,
      color: "text-green-600"
    },
    {
      title: "Trips Logged",
      value: "2/3",
      icon: Ship,
      color: "text-blue-600"
    },
    {
      title: "Days Until Test",
      value: "14",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuickStatsRow;
