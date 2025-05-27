
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatbaseInputProps {
  isLoaded: boolean;
}

const ChatbaseInput = ({ isLoaded }: ChatbaseInputProps) => {
  const [question, setQuestion] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleAsk = async () => {
    if (question.trim() && isLoaded && window.chatbase) {
      console.log("Opening Chatbase with question:", question);
      
      // First try to copy to clipboard
      try {
        await navigator.clipboard.writeText(question);
        console.log("Question copied to clipboard successfully");
        
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        
        toast({
          title: "Question Copied!",
          description: "Your question has been copied to clipboard. Paste it in the chat widget.",
        });
        
        // Open the chatbase widget after successful copy
        window.chatbase("open");
        
        // Clear our input
        setQuestion("");
        
      } catch (error) {
        console.log("Clipboard copy failed:", error);
        
        // Fallback: show the question in a toast for manual copying
        toast({
          title: "Copy this question:",
          description: question,
          duration: 10000,
        });
        
        // Still open the widget
        window.chatbase("open");
      }
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
            className="h-12 px-6 bg-water-blue hover:bg-deep-blue flex items-center gap-2"
            data-ask-button
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Ask
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
            Click "Ask" to copy your question and open the chat widget
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Then paste your question (Ctrl+V) into the chat
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatbaseInput;
