
import { MessageCircle } from "lucide-react";

const ChatbaseHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <MessageCircle className="h-6 w-6 text-water-blue animate-pulse" />
        <h3 className="text-2xl font-bold">Ask Away — Boat Licence AI</h3>
      </div>
      <p className="text-gray-700 text-base">
        Got questions? Our chatbot provides clear, up-to-date answers about
        boat licensing in ACT &amp; NSW — including the process, pricing,
        and how to book.
      </p>
    </div>
  );
};

export default ChatbaseHeader;
