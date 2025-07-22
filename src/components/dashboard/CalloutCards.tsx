
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const CalloutCards = () => {
  const callouts = [
    {
      title: "Continue Learning",
      description: "Jump back to your last module",
      icon: BookOpen,
      action: "Continue Module",
      link: "/study",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "15 Toughest Questions",
      description: "Top student mistakes",
      icon: HelpCircle,
      action: "Start Quiz",
      link: "/quizzes",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Book Your Test",
      description: "Book your Service NSW test",
      icon: Calendar,
      action: "Book Test",
      link: "/book-test",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {callouts.map((callout, index) => (
        <Card key={index} className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition-all hover:-translate-y-1">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${callout.color} flex items-center justify-center mb-4`}>
            <callout.icon className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-lg font-bold text-navy mb-2">{callout.title}</h3>
          <p className="text-gray-600 mb-4">{callout.description}</p>
          
          <Link to={callout.link}>
            <Button className="w-full bg-navy hover:bg-navy/90 text-white rounded-full">
              {callout.action}
            </Button>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default CalloutCards;
