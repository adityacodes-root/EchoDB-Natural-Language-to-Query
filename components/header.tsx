"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Header = ({ handleClear }: { handleClear: () => void }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the theme toggle after the component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center justify-between mb-6">
      <h1
        className="text-2xl sm:text-3xl font-bold text-foreground flex items-center cursor-pointer"
        onClick={() => handleClear()}
      >
        EchoDB - Natural Language to Query
      </h1>
      <div className="flex items-center justify-center space-x-2">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      </div>
    </div>
  );
};
