
import { useEffect } from "react";

declare global {
  interface Window {
    chatbase: any;
  }
}

interface ChatbaseLoaderProps {
  onLoad: (loaded: boolean) => void;
}

const ChatbaseLoader = ({ onLoad }: ChatbaseLoaderProps) => {
  useEffect(() => {
    const loadChatbase = () => {
      try {
        console.log("Loading Chatbase script...");
        
        // Check if script already exists
        const existingScript = document.getElementById("H-qdfYx1JpgXU91FNJDWl");
        if (existingScript) {
          console.log("Chatbase script already exists");
          onLoad(true);
          return;
        }

        // Simple chatbase initialization without proxy
        if (!window.chatbase) {
          window.chatbase = function(...args: any[]) {
            if (!window.chatbase.q) {
              window.chatbase.q = [];
            }
            window.chatbase.q.push(args);
          };
          window.chatbase.q = [];
        }

        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "H-qdfYx1JpgXU91FNJDWl";
        script.setAttribute("domain", "www.chatbase.co");
        script.defer = true;
        
        script.onload = () => {
          console.log("Chatbase script loaded successfully");
          setTimeout(() => onLoad(true), 100);
        };
        
        script.onerror = (error) => {
          console.error("Failed to load Chatbase script:", error);
          onLoad(false);
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error("Error in loadChatbase:", error);
        onLoad(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (document.readyState === "complete") {
        loadChatbase();
      } else {
        window.addEventListener("load", loadChatbase);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("load", loadChatbase);
    };
  }, [onLoad]);

  return null;
};

export default ChatbaseLoader;
