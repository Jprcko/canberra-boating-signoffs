
import { useState } from "react";
import ChatbaseLoader from "./ChatbaseLoader";
import ChatbaseHeader from "./ChatbaseHeader";
import ChatbaseInput from "./ChatbaseInput";
import ChatbaseFooter from "./ChatbaseFooter";
import ErrorBoundary from "./ErrorBoundary";

const ChatbaseAsk = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <ErrorBoundary>
      <section className="py-12 bg-white border-t border-gray-100">
        <ChatbaseLoader onLoad={setIsLoaded} />
        <div className="container-custom max-w-3xl mx-auto">
          <ChatbaseHeader />
          <ChatbaseInput isLoaded={isLoaded} />
          <ChatbaseFooter />
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default ChatbaseAsk;
