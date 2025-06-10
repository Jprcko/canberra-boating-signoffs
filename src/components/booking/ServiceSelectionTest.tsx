
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, TestTube, Users } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { toast } from "@/components/ui/use-toast";

export interface Service {
  id: string;
  name: string;
  price: string;
  priceBreakdown?: Array<{ item: string; price: string }>;
  description: string;
  features: string[];
  icon: any;
  highlight?: boolean;
}

interface ServiceSelectionProps {
  selectedServices: string[];
  onServiceSelection: (services: string[]) => void;
}

const ServiceSelectionTest = ({ selectedServices, onServiceSelection }: ServiceSelectionProps) => {
  const services: Service[] = [
    {
      id: "full",
      name: "Full Logbook Package",
      price: "$1",
      priceBreakdown: [
        { item: "Logbook supervision", price: "$0.50" },
        { item: "Use of commercial vessel & fuel", price: "$0.30" },
        { item: "Certificate, support & resources", price: "$0.20" }
      ],
      description: "Complete your logbook requirements in one day",
      features: [
        "Full day on the water (9am to 4pm)",
        "Professional instructor/supervisor",
        "Complete logbook sign-offs",
        "Complimentary lunch + drink at the Light House Pub",
        "Exam preparation guidance"
      ],
      icon: Book,
      highlight: true
    },
    {
      id: "group",
      name: "Group Package",
      description: "Cost-effective option for friends or family members learning together",
      price: "Calculated by group size",
      features: [
        "Full day on the water (9am to 4pm)",
        "Shared full-day supervised session",
        "Per person discount",
        "Individual logbook sign-offs",
        "Complimentary lunch + drink at the Light House Pub",
        "Fun, social learning environment",
        "Group booking convenience"
      ],
      icon: Users
    },
    {
      id: "test",
      name: "Test Readiness Session",
      price: "$149 per person",
      description: "Online preparation for your Boat Licence Knowledge Test undertaken at Service NSW",
      features: [
        "1-hour online preparation",
        "Test simulation exercises",
        "Key skill reinforcement",
        "Final tips and guidance",
        "Confidence building"
      ],
      icon: TestTube
    }
  ];

  const isServiceSelectionValid = (serviceId: string) => {
    const updatedSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];

    if (serviceId === 'group' && updatedSelection.includes('full')) return false;
    if (serviceId === 'full' && updatedSelection.includes('group')) return false;

    return true;
  };

  const handleServiceSelection = (serviceId: string) => {
    if (!isServiceSelectionValid(serviceId)) {
      toast({
        title: "Invalid Selection",
        description: "Group package cannot be combined with Full Logbook Package",
        variant: "destructive"
      });
      return;
    }

    onServiceSelection(
      selectedServices.includes(serviceId)
        ? selectedServices.filter(id => id !== serviceId)
        : [...selectedServices, serviceId]
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Select Your Services</CardTitle>
        <CardDescription>Choose the services that best fit your needs - you can combine compatible options</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
              isSelected={selectedServices.includes(service.id)}
              onSelect={handleServiceSelection}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelectionTest;
