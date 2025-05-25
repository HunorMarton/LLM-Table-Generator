'use client'

import type React from 'react'
import { useState, useCallback } from 'react'
import { generateTable } from '@/app/actions'
import TableDisplay from '@/components/table-display'
import type { TableData } from '@/lib/types'
import PromptInputArea from '@/components/prompt-input-area'
import { placeholderTableData } from '@/lib/placeholder-data'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCurrentDataStale, setIsCurrentDataStale] = useState(false)
  const [prevSubmittedPrompt, setPrevSubmittedPrompt] = useState('')

  const handlePromptChange = useCallback(
    (newPrompt: string) => {
      setPrompt(newPrompt)
      if (tableData) {
        setIsCurrentDataStale(newPrompt !== prevSubmittedPrompt)
      }
    },
    [tableData, prevSubmittedPrompt, setIsCurrentDataStale]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    if (tableData) {
      setIsCurrentDataStale(true)
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await generateTable(prompt)
      setTableData(data)
      setIsCurrentDataStale(false)
      setPrevSubmittedPrompt(prompt)
    } catch (err) {
      console.error('Error generating table:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate table. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const displayData = tableData || placeholderTableData
  const shouldTableBeStale = !tableData || isCurrentDataStale

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F4F1]">
      {/* Content container - uses flex for compact layout, grid for large screen */}
      <div
        className={`p-4 md:p-6 w-full min-h-screen 
                   flex flex-col items-center justify-start gap-6 py-4 
                   xl:grid xl:grid-cols-[280px_1fr_280px] xl:grid-rows-1 xl:gap-10`}
      >
        {/* Prompt Area - takes full width on small, first column on large */}
        <div
          className={`w-full max-w-5xl xl:max-w-none xl:sticky xl:top-8 xl:self-start`}
        >
          <PromptInputArea
            prompt={prompt}
            handlePromptChange={handlePromptChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Table Area - takes full width on small, middle column on large */}
        <div className="w-full max-w-5xl mx-auto xl:max-w-none xl:min-w-[640px] xl:flex xl:items-center xl:justify-center xl:h-full">
          {/* Render TableDisplay with actual data or placeholder data */}
          <TableDisplay tableData={displayData} isStale={shouldTableBeStale} />
        </div>

        {/* Empty Third Column (for large screen layout) - hidden on small screens by grid behavior */}
        <div className={`hidden xl:block`}></div>
      </div>
    </main>
  )
}
