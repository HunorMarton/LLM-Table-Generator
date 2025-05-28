'use server'

import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import type { TableData } from '@/lib/types'
import { Langfuse } from 'langfuse'
// import { TableDataSchema } from '@/lib/schema'

const langfuse = new Langfuse()

const fetchedPrompt = await langfuse.getPrompt('generate-table', undefined, {
  type: 'chat',
})

export async function generateTable(prompt: string): Promise<TableData> {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error(
        'Google Generative AI API key is not configured. Please check your environment variables.'
      )
    }

    const compiledPrompt = fetchedPrompt.compile({ prompt })
    const systemPrompt = compiledPrompt.find((p) => p.role == 'system')?.content
    const userPrompt = compiledPrompt.find((p) => p.role == 'user')?.content

    const { object } = await generateObject({
      model: google('gemini-2.5-flash-preview-05-20'),
      system: systemPrompt,
      prompt: userPrompt,
      // schema: TableDataSchema,
      output: 'no-schema', // Turns out providing a schema backfires as you can't define table schema with dynamic columns
      temperature: 0.7,
      maxTokens: 2000,
      experimental_telemetry: {
        isEnabled: true,
        metadata: {
          langfusePrompt: fetchedPrompt.toJSON(),
        },
      },
    })

    return object as unknown as TableData
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred during table generation.'

    console.error('Error in generateTable action:', errorMessage)
    throw new Error(`Table generation failed: ${errorMessage}`)
  }
}
