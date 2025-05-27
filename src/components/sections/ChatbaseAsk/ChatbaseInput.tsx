
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface ChatbaseInputProps {
  isLoaded: boolean;
}

const ChatbaseInput = ({ isLoaded }: ChatbaseInputProps) => {
  const [question, setQuestion] = useState("");

  const handleAsk = () => {
    if (question.trim() && isLoaded && window.chatbase) {
      console.log("Opening Chatbase with question:", question);
      
      // Open the chatbase widget
      window.chatbase("open");
      
      // Wait for the widget to open, then try to populate the input
      setTimeout(() => {
        try {
          // Look for the chatbase input field in the widget
          const chatInput = document.querySelector('iframe[src*="chatbase.co"] + * input, iframe[src*="chatbase.co"] + * textarea') || 
                           document.querySelector('[placeholder*="Message"], [placeholder*="message"], textarea') as HTMLInputElement | HTMLTextAreaElement;
          
          if (chatInput) {
            console.log("Found chat input, setting value");
            chatInput.value = question;
            chatInput.focus();
            
            // Trigger events to ensure the widget recognizes the input
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            chatInput.dispatchEvent(inputEvent);
            chatInput.dispatchEvent(changeEvent);
          } else {
            console.log("Could not find chat input field");
            // If we can't find the input, at least the widget is open for the user
          }
        } catch (error) {
          console.log("Error setting chat input:", error);
        }
      }, 1500);
      
      // Clear our input
      setQuestion("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAsk();
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button
            onClick={handleAsk}
            disabled={!question.trim() || !isLoaded}
            className="h-12 px-6 bg-water-blue hover:bg-deep-blue"
          >
            Ask
          </Button>
        </div>

        {!isLoaded && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            Loading chat assistant...
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatbaseInput;
