
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatbaseInputProps {
  isLoaded: boolean;
}

const ChatbaseInput = ({ isLoaded }: ChatbaseInputProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const { toast } = useToast();

  const handleAsk = async () => {
    if (isOpening) return;
    
    console.log("Ask button clicked, isLoaded:", isLoaded);
    
    if (!isLoaded) {
      toast({
        title: "Loading...",
        description: "Chat assistant is still loading. Please wait a moment.",
      });
      return;
    }

    try {
      setIsOpening(true);
      
      if (window.chatbase && typeof window.chatbase === 'function') {
        console.log("Opening Chatbase widget");
        window.chatbase("open");
        
        toast({
          title: "Chat Widget Opened!",
          description: "You can now ask your questions in the chat widget.",
        });
      } else {
        throw new Error("Chatbase not properly initialized");
      }
    } catch (error) {
      console.error("Error opening chatbase:", error);
      toast({
        title: "Error",
        description: "Failed to open chat widget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsOpening(false), 2000);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-center">
          <Button
            onClick={handleAsk}
            disabled={!isLoaded || isOpening}
            className="h-12 px-8 bg-water-blue hover:bg-deep-blue flex items-center gap-2"
            data-ask-button
          >
            {isOpening ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Opening...
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4" />
                Ask Questions
              </>
            )}
          </Button>
        </div>

        {!isLoaded && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            Loading chat assistant...
          </p>
        )}
        
        <div className="text-center mt-3">
          <p className="text-xs text-gray-500">
            Click "Ask Questions" to open the chat widget
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Ask anything about boat licensing in ACT & NSW
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatbaseInput;
