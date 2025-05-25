"use client";

import type React from "react";

import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowUp, AlertCircle } from "lucide-react";
import { generateTable } from "@/app/actions";
import TableDisplay from "@/components/table-display";
import type { TableData } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prevPrompt, setPrevPrompt] = useState("");
  const [useCompactLayout, setUseCompactLayout] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content fits in the viewport
  useEffect(() => {
    const checkContentFit = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        setUseCompactLayout(
          contentHeight > viewportHeight || window.innerHeight < 800
        );
      }
    };

    // Check on mount and when table data changes
    checkContentFit();

    // Check on resize
    window.addEventListener("resize", checkContentFit);
    return () => window.removeEventListener("resize", checkContentFit);
  }, [tableData]);

  const handlePromptChange = useCallback(
    (newPrompt: string) => {
      setPrompt(newPrompt);

      // If we have a table and the prompt changes, reset the table
      if (tableData && newPrompt !== prevPrompt) {
        handleResetTable();
      }
      setPrevPrompt(newPrompt);
    },
    [tableData, prevPrompt]
  );

  const handleResetTable = useCallback(() => {
    setTableData(null);
    setError(null);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Reset table first if needed
    if (tableData) {
      handleResetTable();
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await generateTable(prompt);
      setTableData(data);
    } catch (err) {
      console.error("Error generating table:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate table. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Simple static background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500"></div>

      {/* Content container */}
      <div
        ref={contentRef}
        className="relative z-10 p-4 md:p-6 w-full h-full min-h-screen"
      >
        {/* Large screen layout (3x3 grid) - Only shown when content fits and screen is large enough */}
        <div
          className={`${
            !useCompactLayout && window.innerWidth >= 1280 ? "grid" : "hidden"
          } grid-cols-3 grid-rows-3 gap-10 h-full`}
        >
          {/* Top-left: Prompt */}
          <div className="min-w-[240px]">
            <div className="sticky top-8">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative rounded-lg border border-white/20 bg-white/90 backdrop-blur-sm shadow-lg">
                  <textarea
                    value={prompt}
                    onChange={(e) => handlePromptChange(e.target.value)}
                    placeholder="What kind of table do you want to generate?"
                    className="w-full resize-none rounded-lg border-0 p-3 pr-12 text-sm focus:ring-0 h-[160px] bg-transparent placeholder:text-gray-600"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300 shadow-lg"
                    aria-label="Generate table"
                  >
                    {isLoading ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <Alert
                  variant="destructive"
                  className="mt-4 bg-red-50/90 backdrop-blur-sm border-red-200"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-inter text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Top-center: Empty */}
          <div></div>

          {/* Top-right: Empty */}
          <div></div>

          {/* Middle-left: Empty */}
          <div></div>

          {/* Middle-center: Table */}
          <div className="flex items-center justify-center">
            {tableData ? (
              <TableDisplay tableData={tableData} />
            ) : (
              <div className="flex items-center justify-center h-full text-white/70 text-center p-4">
                <div className="text-lg">
                  Enter a prompt in the top-left corner to generate a table
                </div>
              </div>
            )}
          </div>

          {/* Middle-right: Empty */}
          <div></div>

          {/* Bottom-left: Empty */}
          <div></div>

          {/* Bottom-center: Empty */}
          <div></div>

          {/* Bottom-right: Empty */}
          <div></div>
        </div>

        {/* Compact layout (stacked) - Used when content doesn't fit or on smaller screens */}
        <div
          className={`${
            useCompactLayout || window.innerWidth < 1280 ? "flex" : "hidden"
          } flex-col items-center justify-start gap-6 py-4`}
        >
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative rounded-lg border border-white/20 bg-white/90 backdrop-blur-sm shadow-lg">
                <textarea
                  value={prompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  placeholder="What kind of table do you want to generate?"
                  className="w-full resize-none rounded-lg border-0 p-4 pr-12 text-sm focus:ring-0 min-h-[100px] bg-transparent placeholder:text-gray-600"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300 shadow-lg"
                  aria-label="Generate table"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <ArrowUp className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>

            {error && (
              <Alert
                variant="destructive"
                className="mt-4 bg-red-50/90 backdrop-blur-sm border-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-inter">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="w-full max-w-5xl mx-auto">
            {tableData && <TableDisplay tableData={tableData} />}
          </div>
        </div>
      </div>
    </main>
  );
}
