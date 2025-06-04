
import { MessageCircle } from "lucide-react";

const ChatbaseHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-water-blue animate-pulse flex-shrink-0" />
        <h3 className="text-xl md:text-2xl font-bold">Ask Away — Boat Licence AI</h3>
      </div>
      <p className="text-gray-700 text-sm md:text-base px-2">
        Got questions? Our chatbot provides clear, up-to-date answers about
        boat licensing in ACT &amp; NSW — including the process, pricing,
        and how to book.
      </p>
    </div>
  );
};

export default ChatbaseHeader;
