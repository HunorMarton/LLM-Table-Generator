'use client'

import type React from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PromptErrorProps {
  error: string
}

const PromptError: React.FC<PromptErrorProps> = ({ error }) => {
  return (
    <Alert
      variant="destructive"
      className="mt-4 bg-red-50/90 backdrop-blur-sm border-red-200"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="font-inter text-sm">
        {error}
      </AlertDescription>
    </Alert>
  )
}

export default PromptError
