
import { useToast } from "@/hooks/use-toast";

export const useAgeValidation = () => {
  const { toast } = useToast();

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateAge = (date: Date) => {
    const age = calculateAge(date);
    
    if (age < 12) {
      toast({
        title: "Age Restriction",
        description: "Participants must be at least 12 years old to proceed.",
        variant: "destructive",
      });
      return false;
    }
    
    if (age >= 12 && age < 16) {
      toast({
        title: "Guardian Required",
        description: "Participants under 16 must be accompanied by an adult.",
      });
      return true;
    }

    return true;
  };

  return {
    calculateAge,
    validateAge,
  };
};
