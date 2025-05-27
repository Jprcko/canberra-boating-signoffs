import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MessageCircle } from "lucide-react";
declare global {
  interface Window {
    chatbase: any;
  }
}
const ChatbaseAsk = () => {
  const [question, setQuestion] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // Load Chatbase script
    const loadChatbase = () => {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args: any[]) => {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return (...args: any[]) => target(prop, ...args);
          }
        });
      }
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "H-qdfYx1JpgXU91FNJDWl";
      script.setAttribute("domain", "www.chatbase.co");
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    };
    if (document.readyState === "complete") {
      loadChatbase();
    } else {
      window.addEventListener("load", loadChatbase);
    }
    return () => {
      // Cleanup
      const existingScript = document.getElementById("H-qdfYx1JpgXU91FNJDWl");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);
  const handleAsk = () => {
    if (question.trim() && isLoaded && window.chatbase) {
      // Open Chatbase with the question pre-filled
      window.chatbase("open");
      // You could also try to send the message directly if the API allows
      setTimeout(() => {
        if (window.chatbase) {
          window.chatbase("sendMessage", question);
        }
      }, 500);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAsk();
    }
  };
  return <section className="py-12 bg-white border-t border-gray-100">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-6 w-6 text-water-blue" />
            <h3 className="text-2xl font-bold">Ask Away — Boat Licence AI</h3>
          </div>
          <p className="text-gray-700 text-base">Got questions? Our chatbot provides clear, up-to-date answers about boat licensing in ACT &amp; NSW — including the process, pricing, and how to book.</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input type="text" placeholder="Type your question here..." value={question} onChange={e => setQuestion(e.target.value)} onKeyPress={handleKeyPress} className="pl-10 h-12 text-base" />
              </div>
              <Button onClick={handleAsk} disabled={!question.trim() || !isLoaded} className="h-12 px-6 bg-water-blue hover:bg-deep-blue">
                Ask
              </Button>
            </div>
            
            {!isLoaded && <p className="text-sm text-gray-500 mt-3 text-center">
                Loading chat assistant...
              </p>}
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Get instant answers about boat licensing, logbook requirements, and our services
          </p>
        </div>
      </div>
    </section>;
};
export default ChatbaseAsk;