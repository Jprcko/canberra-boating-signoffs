
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

        // Initialize chatbase if not already done
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
        
        script.onload = () => {
          console.log("Chatbase script loaded successfully");
          onLoad(true);
        };
        
        script.onerror = (error) => {
          console.error("Failed to load Chatbase script:", error);
          onLoad(false);
        };
        
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error in loadChatbase:", error);
        onLoad(false);
      }
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
      window.removeEventListener("load", loadChatbase);
    };
  }, [onLoad]);

  return null;
};

export default ChatbaseLoader;
