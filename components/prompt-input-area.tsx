'use client'

import type React from 'react'
import { useEffect, useRef } from 'react'
import { ArrowUp, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MIN_TEXTAREA_HEIGHT } from '@/lib/constants'

interface PromptInputAreaProps {
  prompt: string
  handlePromptChange: (newPrompt: string) => void
  handleSubmit: (prompt: string) => void
  isLoading: boolean
  error: string | null
}

const PromptInputArea: React.FC<PromptInputAreaProps> = ({
  prompt,
  handlePromptChange,
  handleSubmit,
  isLoading,
  error,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto' // Reset height to recalculate
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.max(
        scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`
    }
  }, [prompt])

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(prompt)
        }}
        className="relative rounded-lg border border-white/20 bg-white/90 backdrop-blur-sm shadow-lg"
      >
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="What kind of table do you want to generate?"
          className="block w-full resize-none rounded-lg border-0 p-4 pr-12 text-sm focus:ring-0 bg-transparent placeholder:text-gray-600 overflow-y-hidden"
          style={{
            minHeight: `${MIN_TEXTAREA_HEIGHT}px`,
            height: `${MIN_TEXTAREA_HEIGHT}px`,
          }}
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
  )
}

export default PromptInputArea
