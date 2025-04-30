import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { MessageSquare, Minimize2, Maximize2 } from "lucide-react";
import { Chatbot } from "./chatbot";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ChatbotDialog = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-10 w-10 rounded-full shadow-lg bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200"
          asChild
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="flex items-center justify-center w-full h-full">
              <MessageSquare className="h-5 w-5" />
            </div>
          </motion.div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] p-0 fixed bottom-4 right-4 top-auto translate-y-0 translate-x-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-right-1/2 data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-right-1/2 data-[state=open]:slide-in-from-bottom-[48%]">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
          <DialogTitle className="text-base font-medium">Unicorn Data Assistant</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
        </DialogHeader>
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Chatbot />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}; 