import { Search as SearchIcon, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface SearchProps {
  handleClear: () => void;
  handleSubmit: (suggestion?: string) => Promise<void>;
  inputValue: string;
  setInputValue: (value: string) => void;
  submitted: boolean;
}

export function Search({
  handleClear,
  handleSubmit,
  inputValue,
  setInputValue,
  submitted,
}: SearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
        <textarea
          className="w-full pl-12 pr-24 py-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:ring-primary/20 dark:focus:border-primary transition-all resize-none"
          placeholder="Ask a question about your data..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{
            minHeight: "56px",
            maxHeight: "200px",
          }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 px-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              Clear
            </Button>
          )}
          <Button
            onClick={() => handleSubmit()}
            disabled={!inputValue.trim()}
            className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-neutral-500 dark:text-neutral-400"
        >
          <p>Press Enter to submit, Shift + Enter for a new line</p>
        </motion.div>
      )}
    </motion.div>
  );
}
