
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
      
      // Since we can't programmatically send the message due to iframe restrictions,
      // we'll copy the question to clipboard and show a helpful message
      navigator.clipboard.writeText(question).then(() => {
        console.log("Question copied to clipboard for pasting into chat");
        
        // Show a brief visual feedback that the question was copied
        const button = document.querySelector('[data-ask-button]') as HTMLButtonElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = "Copied!";
          setTimeout(() => {
            button.textContent = originalText;
          }, 1500);
        }
      }).catch(() => {
        console.log("Could not copy to clipboard, user will need to manually type the question");
      });
      
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
            data-ask-button
          >
            Ask
          </Button>
        </div>

        {!isLoaded && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            Loading chat assistant...
          </p>
        )}
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Click "Ask" to open the chat widget with your question copied to clipboard
        </p>
      </CardContent>
    </Card>
  );
};

export default ChatbaseInput;
