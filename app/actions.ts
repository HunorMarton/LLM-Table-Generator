"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import type { TableData } from "@/lib/types"

export async function generateTable(prompt: string): Promise<TableData> {
  try {
    // Check if the environment variable is available on the server
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("Google Generative AI API key is not configured. Please check your environment variables.")
    }

    const systemPrompt = `
You are a table generator that creates structured data based on user prompts.
You will generate a JSON object that represents a table with the following structure:
{
  "title": "Title of the table",
  "columns": [
    { "key": "name", "label": "Name" },
    // Add more columns as needed
    { "key": "actions", "label": "Actions" }
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
Valid action types include: edit, delete, view, download, share, archive, restore, approve, reject, assign, complete, duplicate, print, export, preview, comment.
Choose actions that make sense for the specific table context.

The first column should typically be a name or title column.
The last column should always be "actions" with the label "Actions".
Include 4-6 rows of realistic, diverse data.
For icons, use one of these values: "file", "payment", "chart", "message", "check".
Make sure all JSON is valid and properly formatted.
ONLY RESPOND WITH THE JSON OBJECT, NO ADDITIONAL TEXT.
`

    const { text } = await generateText({
      model: google("gemini-2.5-flash-preview-05-20"),
      system: systemPrompt,
      prompt: `Generate a table based on this request: "${prompt}". Make sure to include appropriate columns and sample data that would be useful for this type of table.`,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Parse the JSON response
    try {
      // First try to extract JSON if it's wrapped in code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text]

      let jsonString = jsonMatch[1] || text

      // Clean up the string to ensure it's valid JSON
      // Remove any leading/trailing non-JSON content
      jsonString = jsonString.trim()

      // If the string starts with something that's not a {, try to find the first {
      if (!jsonString.startsWith("{")) {
        const startIndex = jsonString.indexOf("{")
        if (startIndex !== -1) {
          jsonString = jsonString.substring(startIndex)
        }
      }

      // If the string ends with something that's not a }, try to find the last }
      if (!jsonString.endsWith("}")) {
        const endIndex = jsonString.lastIndexOf("}")
        if (endIndex !== -1) {
          jsonString = jsonString.substring(0, endIndex + 1)
        }
      }

      const tableData = JSON.parse(jsonString)

      // Ensure the table has the required structure
      if (!tableData.title || !tableData.columns || !tableData.rows) {
        throw new Error("Invalid table structure")
      }

      return tableData
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      throw new Error("Failed to parse table data. The model didn't return valid JSON.")
    }
  } catch (error) {
    console.error("Error generating table:", error)
    throw error
  }
}
