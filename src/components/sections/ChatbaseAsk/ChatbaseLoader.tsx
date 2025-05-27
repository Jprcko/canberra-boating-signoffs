
import { useEffect, useState } from "react";

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
      script.onload = () => onLoad(true);
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      loadChatbase();
    } else {
      window.addEventListener("load", loadChatbase);
    }

    return () => {
      const existingScript = document.getElementById("H-qdfYx1JpgXU91FNJDWl");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [onLoad]);

  return null;
};

export default ChatbaseLoader;
