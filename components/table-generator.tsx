"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowUp, AlertCircle } from "lucide-react"
import { generateTable } from "@/app/actions"
import TableDisplay from "./table-display"
import type { TableData } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TableGeneratorProps {
  onPromptChange?: (prompt: string) => void
  onTableGenerated?: (prompt: string) => void
  onResetTable?: () => void
  layoutMode?: "grid" | "grid-table" | "stacked"
  hidePrompt?: boolean
}

export default function TableGenerator({
  onPromptChange,
  onTableGenerated,
  onResetTable,
  layoutMode = "stacked",
  hidePrompt = false,
}: TableGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prevPrompt, setPrevPrompt] = useState("")

  // Use ref to track if we should call onPromptChange
  const isInitialMount = useRef(true)

  // Only call onPromptChange when prompt changes, not on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (onPromptChange && prompt !== prevPrompt) {
      onPromptChange(prompt)
      setPrevPrompt(prompt)
    }
  }, [prompt, onPromptChange, prevPrompt])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    // Reset table first if needed
    if (tableData && onResetTable) {
      onResetTable()
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await generateTable(prompt)
      setTableData(data)

      // Notify parent that table was generated successfully
      if (onTableGenerated) {
        onTableGenerated(prompt)
      }
    } catch (err) {
      console.error("Error generating table:", err)
      setError(err instanceof Error ? err.message : "Failed to generate table. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value
    setPrompt(newPrompt)

    // If we have a table and the prompt changes, reset the table
    if (tableData && newPrompt !== prevPrompt && onResetTable) {
      onResetTable()
    }
  }

  return (
    <>
      {/* Grid Layout - Prompt Only */}
      {layoutMode === "grid" && (
        <div className="w-full">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative rounded-lg border border-white/20 bg-white/90 backdrop-blur-sm shadow-lg">
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                placeholder="What kind of table do you want to generate?"
                className="w-full resize-none rounded-lg border-0 p-4 pr-12 text-sm focus:ring-0 min-h-[280px] bg-transparent placeholder:text-gray-600"
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
            <Alert variant="destructive" className="mt-4 bg-red-50/90 backdrop-blur-sm border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-inter">{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Grid Layout - Table Only */}
      {layoutMode === "grid-table" && (
        <div className="w-full">
          {tableData ? (
            <TableDisplay tableData={tableData} />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[280px] text-white/70 text-center p-8">
              Enter a prompt in the top-left corner to generate a table
            </div>
          )}
        </div>
      )}

      {/* Stacked Layout - Both Prompt and Table */}
      {layoutMode === "stacked" && (
        <div className="w-full flex flex-col gap-8">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative rounded-lg border border-white/20 bg-white/90 backdrop-blur-sm shadow-lg">
                <textarea
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder="What kind of table do you want to generate?"
                  className="w-full resize-none rounded-lg border-0 p-4 pr-12 text-sm focus:ring-0 min-h-[120px] bg-transparent placeholder:text-gray-600"
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
              <Alert variant="destructive" className="mt-4 bg-red-50/90 backdrop-blur-sm border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-inter">{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="w-full max-w-5xl mx-auto">{tableData && <TableDisplay tableData={tableData} />}</div>
        </div>
      )}
    </>
  )
}
