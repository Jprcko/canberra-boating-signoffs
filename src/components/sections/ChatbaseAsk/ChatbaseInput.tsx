
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatbaseInputProps {
  isLoaded: boolean;
}

const ChatbaseInput = ({ isLoaded }: ChatbaseInputProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleAsk = async () => {
    console.log("Ask button clicked, isLoaded:", isLoaded);
    
    if (isLoaded && window.chatbase) {
      console.log("Opening Chatbase widget");
      
      try {
        // Open the chatbase widget
        window.chatbase("open");
        
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        
        toast({
          title: "Chat Widget Opened!",
          description: "You can now ask your questions in the chat widget.",
        });
      } catch (error) {
        console.error("Error opening chatbase:", error);
        toast({
          title: "Error",
          description: "Failed to open chat widget. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      console.log("Chatbase not loaded yet");
      toast({
        title: "Loading...",
        description: "Chat assistant is still loading. Please wait a moment.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-center">
          <Button
            onClick={handleAsk}
            disabled={!isLoaded}
            className="h-12 px-8 bg-water-blue hover:bg-deep-blue flex items-center gap-2"
            data-ask-button
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Opened!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
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
