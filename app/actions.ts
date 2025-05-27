'use server'

import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import type { TableData } from '@/lib/types'

export async function generateTable(prompt: string): Promise<TableData> {
  let rawResponseText = '' // Variable to store raw response text from the model

  try {
    // Check if the environment variable is available on the server
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error(
        'Google Generative AI API key is not configured. Please check your environment variables.'
      )
    }

    const systemPrompt = `
You are a table generator that creates structured data based on user prompts.
You will generate a JSON object that represents a table with the following structure:
{
  "title": "Title of the table",
  "columns": [
    { "key": "name", "label": "Name" },
    // Add more columns as needed
  ],
  "rows": [
    {
      "name": "Example Name",
      "name_icon": "file", // Optional icon key (file, payment, chart, message, check)
      // Add more fields corresponding to column keys
      "actions": [
        { "type": "edit", "label": "Edit", "primary": true },
        { "type": "delete", "label": "Delete", "primary": true },
        { "type": "view", "label": "View", "primary": false },
        // Add more actions as appropriate for the context
      ]
    }
    // Add more rows as needed
  ]
}

For the "actions" array in each row, include 3-5 contextually appropriate actions.
Mark 1-2 actions as "primary": true to indicate they should be highlighted.
Valid action types include: edit, delete, view, download, share, archive, restore, approve, reject, assign, complete, duplicate, print, export, preview, comment, bookmark.
Choose actions that make sense for the specific table context.

The first column should typically be a name or title column.
Each row should always include an "actions" array.
Include 4-6 rows of realistic, diverse data.
For icons, use one of these values: "file", "payment", "chart", "message", "check".
Make sure all JSON is valid and properly formatted.
ONLY RESPOND WITH THE JSON OBJECT, NO ADDITIONAL TEXT.
`

    const { text } = await generateText({
      model: google('gemini-2.5-flash-preview-05-20'),
      system: systemPrompt,
      prompt: `Generate a table based on this request: "${prompt}". Make sure to include appropriate columns and sample data that would be useful for this type of table.`,
      temperature: 0.7,
      maxTokens: 2000,
      experimental_telemetry: { isEnabled: true },
    })

    rawResponseText = text // Store the raw text from the AI model

    // Parse the JSON response
    // First try to extract JSON if it's wrapped in code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/) || [null, text]

    let jsonString = jsonMatch[1] || text

    // Clean up the string to ensure it's valid JSON
    // Remove any leading/trailing non-JSON content
    jsonString = jsonString.trim()

    // If the string starts with something that's not a {, try to find the first {
    if (!jsonString.startsWith('{')) {
      const startIndex = jsonString.indexOf('{')
      if (startIndex !== -1) {
        jsonString = jsonString.substring(startIndex)
      } else {
        // If no '{' is found, the string is definitely not valid JSON.
        throw new Error('Invalid JSON format: Missing opening brace.')
      }
    }

    // If the string ends with something that's not a }, try to find the last }
    if (!jsonString.endsWith('}')) {
      const endIndex = jsonString.lastIndexOf('}')
      if (endIndex !== -1) {
        jsonString = jsonString.substring(0, endIndex + 1)
      } else {
        // If no '}' is found after an opening brace, it's malformed.
        throw new Error('Invalid JSON format: Missing closing brace.')
      }
    }

    const tableData: TableData = JSON.parse(jsonString)

    // Ensure the table has the required structure
    if (!tableData.title || !tableData.columns || !tableData.rows) {
      throw new Error(
        'Invalid table structure in parsed JSON. Model output may be malformed.'
      )
    }

    return tableData
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred during table generation.'

    if (error instanceof Error) {
      errorMessage = error.message
    }

    console.error('Error in generateTable action:', errorMessage)

    // Log rawResponseText if it's available and the error isn't an API key issue.
    if (
      rawResponseText &&
      !(
        error instanceof Error &&
        error.message.includes('API key is not configured')
      )
    ) {
      console.error(
        'Raw model response text that might have caused the error:',
        rawResponseText
      )
    }

    // Re-throw an error to be handled by the client
    // If it's already one of our specific errors (API key, format, structure), re-throw as is.
    if (
      error instanceof Error &&
      (error.message.includes('API key is not configured') ||
        error.message.includes('Invalid JSON format') ||
        error.message.includes('Invalid table structure'))
    ) {
      throw error
    }
    // For other errors (e.g. network issues with generateText, or JSON.parse internal errors not caught by specific checks),
    // wrap them in a generic failure message, including the original error for context.
    throw new Error(`Table generation failed: ${errorMessage}`)
  }
}
