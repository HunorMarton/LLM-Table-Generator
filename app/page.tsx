'use client'

import type React from 'react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { generateTable } from '@/app/actions'
import TableDisplay from '@/components/table-display'
import type { TableData } from '@/lib/types'
import PromptInput from '@/components/prompt-input'
import PromptError from '@/components/prompt-error'
import { placeholderTableData } from '@/lib/placeholder-data'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [submittedPrompt, setSubmittedPrompt] = useState('')

  const {
    data: tableData,
    isFetching: queryIsFetching,
    error: queryError,
  } = useQuery<TableData, Error>({
    queryKey: ['tableData', submittedPrompt],
    queryFn: async () => generateTable(submittedPrompt),
    initialData: placeholderTableData,
    enabled: !!submittedPrompt,
    retry: 1,
  })

  const isDisplayStale =
    !submittedPrompt || queryIsFetching || prompt !== submittedPrompt
  const currentError = queryError ? queryError.message : null

  return (
    <main className="min-h-screen overflow-hidden bg-gray-100">
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
          <PromptInput
            prompt={prompt}
            handlePromptChange={setPrompt}
            handleSubmit={setSubmittedPrompt}
            isLoading={queryIsFetching}
          />
          {currentError && <PromptError error={currentError} />}
        </div>

        {/* Table Area - takes full width on small, middle column on large */}
        <div className="w-full max-w-5xl mx-auto xl:max-w-none xl:min-w-[640px] xl:flex xl:items-center xl:justify-center xl:h-full">
          <TableDisplay tableData={tableData} isStale={isDisplayStale} />
        </div>

        {/* Empty Third Column (for large screen layout) - hidden on small screens by grid behavior */}
        <div className={`hidden xl:block`}></div>
      </div>
    </main>
  )
}
