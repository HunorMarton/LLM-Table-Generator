import type { TableData } from './types'

// Define placeholder data
export const placeholderTableData: TableData = {
  title: 'New Table',
  columns: [
    { key: 'col1', label: 'Title' },
    { key: 'col2', label: 'Cell' },
    { key: 'col3', label: 'Cell' },
    { key: 'col4', label: 'Cell' },
  ],
  rows: [
    {
      col1: 'Title',
      col1_icon: 'file',
      col2: 'Cell',
      col3: 'Cell',
      col4: 'Cell',
      actions: [
        { type: 'edit', label: 'Edit', primary: true },
        { type: 'delete', label: 'Delete', primary: true },
        { type: 'view', label: 'View', primary: false },
      ],
    },
  ],
}
