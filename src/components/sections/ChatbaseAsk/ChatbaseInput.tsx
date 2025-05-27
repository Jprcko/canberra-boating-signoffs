
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
      // First open the chatbase widget
      window.chatbase("open");
      
      // Wait a bit longer for the widget to fully load, then send the message
      setTimeout(() => {
        if (window.chatbase) {
          // Try multiple methods to ensure the message gets sent
          try {
            window.chatbase("sendMessage", question);
          } catch (error) {
            console.log("First method failed, trying alternative:", error);
            // Alternative method - try to set the input value directly
            try {
              const chatInput = document.querySelector('[data-chatbase-input], input[placeholder*="Message"], textarea[placeholder*="Message"]') as HTMLInputElement | HTMLTextAreaElement;
              if (chatInput) {
                chatInput.value = question;
                chatInput.focus();
                // Trigger input event to notify the widget
                const event = new Event('input', { bubbles: true });
                chatInput.dispatchEvent(event);
              }
            } catch (fallbackError) {
              console.log("Fallback method also failed:", fallbackError);
            }
          }
        }
      }, 1000);
      
      // Clear the input after sending
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
