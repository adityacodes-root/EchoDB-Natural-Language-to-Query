import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, Send, Trash2, Sparkles } from "lucide-react";
import { handleChatbotQuery } from "@/app/actions";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const suggestedQuestions = [
  "What's the average valuation of unicorns in the US?",
  "Which industries have the most unicorns?",
  "Compare unicorn growth in India vs China",
  "Show me the top 5 unicorns by valuation"
];

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
    setLoading(true);

    try {
      const response = await handleChatbotQuery(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error while processing your question. Please try again.",
          timestamp: new Date()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to Unicorn Data Assistant</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Ask me anything about unicorn companies, their valuations, industries, and more.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-md">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSuggestionClick(question)}
                  className="text-left p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-sm"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex flex-col max-w-[80%] group">
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-neutral-100 dark:bg-neutral-700"
                    }`}
                  >
                    {message.content}
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 px-1">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear chat
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about unicorn companies..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}; 