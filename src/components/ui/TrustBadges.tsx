
import { Shield, Award, MapPin, Anchor } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      title: "Fully Licensed",
      description: "Qualified instructors"
    },
    {
      icon: Award,
      title: "Insured",
      description: "Comprehensive coverage"
    },
    {
      icon: MapPin,
      title: "ACT-Based Business",
      description: "Local expertise"
    },
    {
      icon: Anchor,
      title: "AMSA Compliant",
      description: "Maritime standards"
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-2 text-center">
          <badge.icon className="h-5 w-5 text-water-blue" />
          <div className="text-left">
            <div className="font-semibold text-navy text-sm">{badge.title}</div>
            <div className="text-xs text-gray-600">{badge.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
