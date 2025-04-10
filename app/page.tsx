"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateChartConfig,
  generateQuery,
  runGenerateSQLQuery,
} from "./actions";
import { Config, Result } from "@/lib/types";
import { Loader2, Database, Code, BarChart3, X } from "lucide-react";
import { toast } from "sonner";
import { Results } from "@/components/results";
import { SuggestedQueries } from "@/components/suggested-queries";
import { QueryViewer } from "@/components/query-viewer";
import { Search } from "@/components/search";
import { Header } from "@/components/header";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [activeQuery, setActiveQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [chartConfig, setChartConfig] = useState<Config | null>(null);
  const [operationResult, setOperationResult] = useState<{ message: string; affectedRows: number; operation: string } | null>(null);

  const handleSubmit = async (suggestion?: string) => {
    const question = suggestion ?? inputValue;
    if (inputValue.length === 0 && !suggestion) return;
    clearExistingData();
    if (question.trim()) {
      setSubmitted(true);
    }
    setLoading(true);
    setLoadingStep(1);
    setActiveQuery("");
    setOperationResult(null);
    try {
      const query = await generateQuery(question);
      if (query === undefined) {
        toast.error("An error occurred. Please try again.");
        setLoading(false);
        return;
      }
      setActiveQuery(query);
      setLoadingStep(2);
      const result = await runGenerateSQLQuery(query);
      
      // Handle CRUD operation results
      if (typeof result === 'object' && 'message' in result) {
        setOperationResult(result);
        setResults([]);
        setColumns([]);
      } else {
        setResults(result);
        setColumns(result.length > 0 ? Object.keys(result[0]) : []);
      }
      
      setLoading(false);
      if (Array.isArray(result) && result.length > 0) {
        const generation = await generateChartConfig(result, question);
        setChartConfig(generation.config);
      }
    } catch (e) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setInputValue(suggestion);
    try {
      await handleSubmit(suggestion);
    } catch (e) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const clearExistingData = () => {
    setActiveQuery("");
    setResults([]);
    setColumns([]);
    setChartConfig(null);
    setOperationResult(null);
  };

  const handleClear = () => {
    setSubmitted(false);
    setInputValue("");
    clearExistingData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 flex flex-col">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col">
        <motion.div
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 flex-grow flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="p-6 sm:p-8 flex flex-col flex-grow">
            <Header handleClear={handleClear} />
            <Search
              handleClear={handleClear}
              handleSubmit={handleSubmit}
              inputValue={inputValue}
              setInputValue={setInputValue}
              submitted={submitted}
            />
            <div
              id="main-container"
              className="flex-grow flex flex-col sm:min-h-[420px] mt-6"
            >
              <div className="flex-grow h-full">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <SuggestedQueries
                      handleSuggestionClick={handleSuggestionClick}
                    />
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="sm:h-full min-h-[400px] flex flex-col"
                    >
                      {activeQuery.length > 0 && (
                        <QueryViewer
                          activeQuery={activeQuery}
                          inputValue={inputValue}
                        />
                      )}
                      {loading ? (
                        <div className="h-full flex flex-col items-center justify-center">
                          <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg flex flex-col items-center max-w-md w-full">
                            <div className="relative">
                              <Loader2 className="h-12 w-12 animate-spin text-primary" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                              </div>
                            </div>
                            <p className="text-foreground mt-6 font-medium text-lg">
                              {loadingStep === 1
                                ? "Generating SQL query..."
                                : "Running SQL query..."}
                            </p>
                            <div className="flex items-center mt-4 space-x-3">
                              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${loadingStep >= 1 ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'}`}></div>
                              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${loadingStep >= 2 ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'}`}></div>
                              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${loadingStep >= 3 ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'}`}></div>
                            </div>
                          </div>
                        </div>
                      ) : operationResult ? (
                        <div className="flex-grow flex items-center justify-center">
                          <div className="text-center p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-sm max-w-md w-full">
                            <div className="mb-4">
                              {operationResult.operation === 'INSERT' && (
                                <div className="h-12 w-12 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {operationResult.operation === 'UPDATE' && (
                                <div className="h-12 w-12 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                </div>
                              )}
                              {operationResult.operation === 'DELETE' && (
                                <div className="h-12 w-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {operationResult.operation} Operation Successful
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                              {operationResult.message}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-500">
                              {operationResult.affectedRows} row{operationResult.affectedRows !== 1 ? 's' : ''} affected
                            </p>
                          </div>
                        </div>
                      ) : results.length === 0 ? (
                        <div className="flex-grow flex items-center justify-center">
                          <div className="text-center p-8 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                            <Database className="h-12 w-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-4" />
                            <p className="text-center text-muted-foreground text-lg">
                              No results found.
                            </p>
                            <button 
                              onClick={handleClear}
                              className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Try a different query
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Results
                          results={results}
                          chartConfig={chartConfig}
                          columns={columns}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
