import { z } from 'zod'

// Define the schema for clarity and potential type inference aid
const ActionSchema = z.object({
  type: z.string(),
  label: z.string(),
  primary: z.boolean(),
})

const ColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
})

const RowSchema = z
  .object({
    actions: z.array(ActionSchema),
  })
  .catchall(z.string()) // Allows other dynamic properties (column data, *_icon fields)

export const TableDataSchema = z
  .object({
    title: z.string(),
    columns: z.array(ColumnSchema),
    rows: z.array(RowSchema),
  })
  .superRefine((data, ctx) => {
    if (!data.columns || !data.rows) return // Should be caught by base schema, but good practice

    const columnKeys = new Set(data.columns.map((col) => col.key))

    data.rows.forEach((row, rowIndex) => {
      // Get all keys from the row object, excluding 'actions' and potential conventional private/meta keys like '_icon'
      const rowDataKeys = Object.keys(row).filter(
        (key) => key !== 'actions' && !key.endsWith('_icon') // Adjust filter as per your conventions
      )

      // Check 1: Ensure all keys defined in `columns` are present in the row's data keys.
      for (const colKey of columnKeys) {
        if (!(colKey in row)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Row ${rowIndex} is missing data for column '${colKey}'.`,
            path: ['rows', rowIndex, colKey],
          })
        }
      }

      // Check 2: Ensure the row's data keys are all defined in `columns`.
      // This prevents extraneous properties in the row data.
      for (const rowKey of rowDataKeys) {
        if (!columnKeys.has(rowKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Row ${rowIndex} has extraneous data key '${rowKey}' which is not defined in columns.`,
            path: ['rows', rowIndex, rowKey],
          })
        }
      }
    })
  })
